/**
 * Tela inicial: SOS a 1 toque, "Seu motivo", Guardião e contador (MVP #2, #1, #10, #5).
 * Skills: prevencao-recaida, entrevista-motivacional, design-etico-saude-digital.
 */
import { Pagina } from '@/components/Pagina'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { Guardiao } from '@/components/Guardiao'
import { useDados } from '@/hooks/DadosContext'
import { calcularProgresso, formatarReais } from '@/domain/contador'
import { formatarData, hojeISO } from '@/domain/datas'

export function Inicio() {
  const { estado } = useDados()
  const ob = estado.onboarding
  if (!ob) return null
  const hoje = hojeISO()
  const p = calcularProgresso(ob.inicio, hoje, estado.registros, ob.gastoSemanal)
  const registroHoje = estado.registros.find((r) => r.data === hoje)
  const apostouHoje = registroHoje?.apostou === true
  const motivo = [ob.motivoTexto, ...ob.motivos].filter(Boolean)

  return (
    <Pagina titulo="Oi, que bom te ver">
      <Botao variante="sos" para="/sos" larguraTotal>
        Bateu a vontade? Toque aqui
      </Botao>

      {motivo.length > 0 && (
        <Cartao titulo="Seu motivo" destaque>
          <p className="motivo">{motivo.join(' · ')}</p>
        </Cartao>
      )}

      <Cartao titulo="Sua jornada">
        <div className="jornada">
          <Guardiao estagio={p.estagioGuardiao} humor={apostouHoje ? 'acolhendo' : 'tranquilo'} />
          <div>
            <p className="numero-grande">
              {p.totalSemApostar} {p.totalSemApostar === 1 ? 'dia' : 'dias'} sem apostar
            </p>
            <p className="dica">desde {formatarData(ob.inicio)}. Sequência atual: {p.sequenciaAtual} {p.sequenciaAtual === 1 ? 'dia' : 'dias'}.</p>
            {p.dinheiroPreservado !== null && (
              <p>
                Cerca de <strong>{formatarReais(p.dinheiroPreservado)}</strong> preservados
                {ob.metaConcreta ? <> para <strong>{ob.metaConcreta}</strong></> : null}.
                <span className="dica"> (estimativa com o valor que você informou)</span>
              </p>
            )}
            {p.proximoMarco !== null && (
              <p className="dica">Próximo marco do Guardião: {p.proximoMarco} dias (faltam {p.faltamParaMarco}).</p>
            )}
          </div>
        </div>
        {apostouHoje && (
          <p className="acolhimento" role="status">
            Recomeçar faz parte do processo. Seus {p.totalSemApostar} dias continuam valendo.
          </p>
        )}
      </Cartao>

      <Cartao titulo="Hoje">
        {registroHoje ? (
          <p>Registro de hoje feito. Obrigado por cuidar de você.</p>
        ) : (
          <p>Como foi o seu dia? Leva menos de um minuto.</p>
        )}
        <Botao variante="secundario" para="/registro">
          {registroHoje ? 'Mudar o registro de hoje' : 'Registrar o dia'}
        </Botao>
      </Cartao>

      <nav aria-label="Ferramentas" className="grade">
        <Botao variante="secundario" para="/plano">Meu plano</Botao>
        <Botao variante="secundario" para="/bloqueio">Bloquear apostas</Botao>
        <Botao variante="secundario" para="/apoio">Apoio e contatos</Botao>
        <Botao variante="secundario" para="/configuracoes">Configurações</Botao>
      </nav>
    </Pagina>
  )
}
