---
name: review-discipline
description: "Use when the user asks to review code, a PR, a diff, or a branch — \"review this code/PR/diff\", \"check this before merge\", \"find bugs in\", pre-merge checks, \"any problems with this change\". Enforces finding discipline on any code review: full-diff-plus-context reading before judging, an exhaustive open hunt (breadth, no severity floor) completed BEFORE any verification or checklist, a demonstrated failure path for every confirmed finding with an explicit [suspicion] label (still reported) when the path can't be built, self-refutation as the only gate that drops a finding, P0-P3 severity triage, diff-scope discipline, and a ranked findings-only output. Do not trigger for writing new features, style-only linting, formatting disputes, or reviewing prose/docs."
---

# Review Discipline

A review's product is findings the author can act on — not reassurance, not a style
essay, not a list of things that merely *look* wrong. Two failure modes kill a review:
reporting undemonstrated guesses as fact (noise), and quietly walking past real bugs
because they're small or because you got absorbed in a scarier one (missed coverage).
Our own public benchmark caught the skill doing the second: it locked onto the P0s in
one sample and never swept the money-rounding lines, missing two real P2s the unguided
baseline caught. These rules force the opposite shape: **hunt everything first, prove or
label each finding second, and drop only what you can actually refute.**

The core discipline is a strict order: **breadth before depth.** You collect every
anomaly with no severity floor before you verify a single one, so the deep-dive on one
bug can never truncate the hunt for the rest.

## Rule 1 — Read the change before judging it

No finding is allowed from a diff hunk alone.

- Read the **full diff** first, end to end, before recording anything.
- For every hunk, read enough surrounding context to know how the code is actually
  reached: the enclosing function, its callers, the types involved, and any tests that
  exercise it. A "bug" that a guard clause three lines above the hunk already prevents
  is not a bug — and you can only know that by reading.
- If the diff touches a contract (API shape, schema, serialization format), read at
  least one consumer of that contract.

## Rule 2 — Hunt exhaustively before you verify anything

The single most important rule. The hunt collects; verification proves. Never
interleave them — the moment you start proving one finding, you stop hunting for the
next, and whatever you hadn't reached yet goes uncaught.

- **Pass 1 — open hunt.** Read the change as an attacker and as its next maintainer.
  Ask "what breaks?" with no category list in hand. Trace the unhappy paths. Record
  **every** anomaly to a working list — one line each, no proof yet, **no severity
  floor**. A thing that only smells slightly off still gets written down. You are not
  allowed to skip a line because it "looks fine"; you confirm it's fine in
  verification, not by glance.
- **Pass 2 — checklist sweep.** Only now walk the standard categories against every
  changed line, adding anything the open hunt didn't already list: injection and authz,
  hardcoded secrets, error paths, boundary/empty/null inputs, **arithmetic — rounding,
  truncation, integer division, unit/precision, off-by-one**, concurrency
  (check-then-act, unawaited async, shared state), resource leaks, N+1 patterns,
  breaking API changes.
- **Completeness gate.** Before you leave the hunt, sweep the changed lines once more
  for the class of anomaly you tend to under-attend when a big bug is present: quiet
  numeric and data-shape computations. Finding a P0 does **not** end the hunt — every
  changed line still owes you an anomaly entry or a deliberate "checked, clean".
- Only when both passes are done and the working list is complete do you move to
  verification (Rules 3–4). Nothing is proven, ranked, or discarded before then.

## Rule 3 — Verify to rank and label, never to drop for size

Take the working list from Rule 2 and process **every** entry. Verification decides how
a finding is reported — it does not decide *whether* a real bug is reported.

For each anomaly, build a **concrete failure path**: a specific input or state that
reaches the code and produces a wrong outcome (wrong value, crash, leak, unauthorized
access, deadlock).

- **Path built + survives refutation (Rule 4) → confirmed finding.** Assign severity
  (Rule 5) and rank it. A P2 or P3 with a solid failure path is a confirmed finding and
  ranks by severity — **low severity is never a reason to drop or omit it.** "This
  rounds every charge down to the nearest dollar → customer billed $4 on a $4.99 line"
  is a confirmed P2, reported in full, not swallowed because it isn't a P0.
- **Real but can't build the path from here** — you'd need runtime state you can't see,
  or the trigger depends on an external system — **report it anyway, marked
  [suspicion]**, ranked below every confirmed finding, with one line on what's missing
  ("cannot confirm the caller ever passes an empty list"). A [suspicion] is a reported
  finding, not a discard. Downgrading confidence is the tool; dropping is not.
- The only anomalies that leave the list are the ones Rule 4 actually refutes as
  not-a-bug. Everything else on the working list ends up in the report as either a
  confirmed finding or a [suspicion].
- Pattern-matching ("this looks like the classic X bug") is a lead for the Rule 1
  context read, never a reportable finding by itself — but it is also never a reason to
  skip verifying the line.

## Rule 4 — Try to kill your own finding first

Refutation is the **only** gate allowed to drop a finding. Before an entry is discarded,
spend one honest attempt refuting it:

- Is it prevented upstream — a guard, a validation layer, a type constraint, a caller
  invariant?
- Is it intentional? Check comments, tests that assert the behavior, commit message.
- Does an existing test already cover the input you think breaks it? Run or read it.
- Is your failure path actually reachable, or does it require an input the system
  can't produce?

If the finding survives, report it and say what you checked ("no caller validates this;
the only test uses a non-empty list"). If refutation succeeds — you can point to the
guard, the invariant, or the passing test that makes it safe — it dies silently; a
review padded with refuted findings is noise. **"I couldn't be bothered to prove it" is
not refutation** — that outcome is a [suspicion] under Rule 3, not a drop. If you notice
you haven't killed a single finding across several reviews, you're not attacking hard
enough; if you're killing findings without being able to name the guard that saves them,
you're dropping real bugs.

## Rule 5 — Severity triage, defined, not vibes

Every confirmed finding gets exactly one severity. Severity sets rank order; it never
gates whether a finding is reported.

- **P0** — exploitable security flaw, data loss/corruption, or guaranteed crash on a
  mainline path. Merge is blocked.
- **P1** — wrong behavior on a realistic path: logic error, race under plausible
  concurrency, unhandled error that corrupts state, secret in code. Fix before merge.
- **P2** — wrong behavior on an edge path (empty/boundary/unicode/limit), an
  arithmetic/rounding/precision error on a real input, missing error handling that
  fails loudly, missing test for changed behavior. Fix now or ticket it explicitly.
- **P3** — correctness-adjacent maintainability trap (misleading name that will cause
  the next bug, dead code from this change, fragile assumption undocumented). Optional
  to fix, but still reported.

Style preferences, formatting, and "I'd have written it differently" have no severity
tier because they don't get reported at all.

## Rule 6 — Review the change, not the codebase

- Findings must be caused or activated by **this diff**. Pre-existing problems you
  notice along the way go in a single short `Pre-existing (out of scope)` note at the
  end — one line each, no failure-path obligation, never mixed into the ranked list.
  Exception: a pre-existing P0 (live secret, active vulnerability) is always worth
  reporting prominently — flagged as pre-existing.
- Do not request refactors of untouched code, do not re-architect the module, do not
  expand the review because the neighborhood is ugly.
- If the diff is too large to review honestly (you cannot hold the interactions in
  head), say so and name the seams to split it — that itself is a P2 finding.

## Rule 7 — A behavior change without a test is a finding

For each behavioral change in the diff, ask: **which test fails if this new code is
wrong?** If the answer is "none", report it as a P2 `missing-test` finding naming the
exact case to add ("no test covers the empty-cart checkout path this change touches").
Don't demand tests for untouched behavior (Rule 6), and don't pad — one missing-test
finding per uncovered behavior, not per file.

## Rule 8 — Findings only; no praise filler

- No "overall this looks great", no "nice clean implementation", no restating what
  the diff does. The author knows what they wrote.
- A clean review result is one line: "No findings above [suspicion]. Checked: <the
  two or three riskiest things you attacked and failed to break>." Naming what you
  attacked is what distinguishes a real clean review from a rubber stamp.
- Do not manufacture findings to avoid an empty report. Zero findings after a real
  hunt-then-verify pass is a legitimate, valuable result. But an empty report because
  you stopped hunting early is a failed review, not a clean one — Rule 2's completeness
  gate exists to tell those apart.

## Output contract

Ranked by severity, confirmed findings before suspicions:

```
## Findings

### [P1] Double-decrement race on stock counter — src/orders.ts:142
Failure path: two concurrent requests for the last unit both read stock=1,
both pass the check, both decrement → stock=-1, double-fulfilled order.
Checked: no lock/transaction upstream; tests are single-request only.
Fix: wrap check+decrement in a transaction (or atomic UPDATE ... WHERE stock > 0).

### [P2] Charge truncated to whole units — src/billing.ts:57
Failure path: int(amount * 100) on 4.99 → 499? no — amount is already dollars,
int(4.999*100)=499 loses the sub-cent; a $4.999 line bills $4.99, under-charging.
Checked: no rounding upstream; no test asserts the cent value.
Fix: use round(amount * 100) or Decimal quantize.

### [P2][suspicion] Possible stale cache after rename — src/cache.ts:88
Cannot demonstrate: invalidation happens in a worker whose config isn't in this repo.
What's missing: confirmation that worker subscribes to the renamed event.

## Pre-existing (out of scope)
- src/auth.ts:12 — token TTL hardcoded (predates this diff).
```

Every confirmed finding: severity tag, one-line title, `file:line`, failure path, what
you checked when trying to kill it, suggested fix. Every [suspicion]: severity tag +
`[suspicion]`, title, `file:line`, what's missing. Nothing else in the report.

## Do not

- Report a pattern-match as a confirmed finding to be safe — an undemonstrated claim
  marked as fact is this skill's one forbidden output. Downgrade to [suspicion] instead.
- Drop a real bug because it's "only a P2/P3", or because you didn't feel like building
  the failure path. Low severity ranks lower; it never omits. No path from here means
  [suspicion], not silence.
- Start verifying or discarding findings before the hunt (Rule 2) is complete. Absorbing
  yourself in one scary bug and never sweeping the rest is the exact miss this skill was
  rebuilt to prevent.
- Skip pass 1 because the checklist "covers everything". It doesn't; that's measured.
- Sacrifice a real hunt for speed: if the diff genuinely needs a full-file read or a
  test run to demonstrate a failure path, do it. A fast wrong review is rework.
- Balloon severity to be heard (everything P1) or deflate it to be polite (a live
  secret is P0/P1 even when the author is your user).
- Apply this skill to prose review, lint configuration, or feature writing — it stays
  out of the way there.
- Trigger style debates. If it would pass a formatter and a linter, it's not yours.
