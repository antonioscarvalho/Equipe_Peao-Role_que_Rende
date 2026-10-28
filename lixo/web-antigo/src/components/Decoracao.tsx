export function Decoracao() {
  return (
    <div className="decor" aria-hidden="true">
      <svg className="g g--seta rqr-anim-flutuar" viewBox="0 0 120 80">
        <path
          className="rqr-anim-pincelada"
          style={{ ['--rqr-traco' as string]: 260 }}
          d="M8 60 C30 10 70 10 74 40 C78 64 50 64 56 40 C62 20 96 18 112 30 M112 30 l-16 -4 M112 30 l-6 14"
        />
      </svg>
      <svg className="g g--anel rqr-anim-flutuar" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="20" />
      </svg>
      <svg className="g g--flor rqr-anim-flutuar" viewBox="0 0 60 60">
        <path d="M30 6v48M6 30h48M13 13l34 34M47 13L13 47" />
      </svg>
      <svg className="g g--arco rqr-anim-flutuar" viewBox="0 0 100 60">
        <path d="M8 10 C20 56 80 56 92 10" />
      </svg>
      <svg className="g g--tri rqr-anim-flutuar" viewBox="0 0 60 60">
        <path d="M30 8 L54 50 L6 50Z" />
      </svg>
    </div>
  )
}
