/**
 * Guia de bloqueio e autoexclusão (MVP #6).
 * Conceito: controle de estímulos (fricção entre impulso e aposta).
 * Skill: controle-estimulos-financas. O app orienta; a pessoa executa. Nunca acessa conta bancária.
 * Conteúdo regulatório com data de verificação em content/bloqueio.json.
 */
import { Pagina } from '@/components/Pagina'
import { Aviso } from '@/components/Aviso'
import { Cartao } from '@/components/Cartao'
import { Botao } from '@/components/Botao'
import { useDados } from '@/hooks/DadosContext'
import { formatarData } from '@/domain/datas'
import bloqueio from '@/content/bloqueio.json'

export function Bloqueio() {
  const { estado, atualizar } = useDados()
  const feitos = new Set(estado.bloqueioFeitos)
  const grupos = Array.from(new Set(bloqueio.passos.map((p) => p.grupo)))

  function alternar(id: string) {
    atualizar((e) => ({
      ...e,
      bloqueioFeitos: e.bloqueioFeitos.includes(id) ? e.bloqueioFeitos.filter((f) => f !== id) : [...e.bloqueioFeitos, id],
    }))
  }

  return (
    <Pagina titulo="Bloquear apostas" voltarPara="/">
      <p>Cada passo deixa mais difícil apostar no impulso. Quanto mais passos, mais tempo a vontade tem para passar.</p>
      <Aviso tipo="atencao">{bloqueio.aviso}</Aviso>
      <p className="dica" role="status">
        Você fez {feitos.size} de {bloqueio.passos.length} passos.
      </p>
      {grupos.map((g) => (
        <Cartao key={g} titulo={g}>
          <ul className="lista lista--checklist">
            {bloqueio.passos
              .filter((p) => p.grupo === g)
              .map((p) => (
                <li key={p.id}>
                  <label className="confirmacao">
                    <input type="checkbox" checked={feitos.has(p.id)} onChange={() => alternar(p.id)} />
                    <span>
                      <strong>{p.titulo}</strong>
                      <br />
                      {p.como}
                    </span>
                  </label>
                  {'link' in p && p.link && (
                    <Botao variante="discreto" href={p.link}>
                      Abrir site oficial
                    </Botao>
                  )}
                </li>
              ))}
          </ul>
        </Cartao>
      ))}
      <p className="dica">Informações verificadas em {formatarData(bloqueio.verificadoEm)}. Regras sobre apostas estão mudando; confira antes.</p>
    </Pagina>
  )
}
