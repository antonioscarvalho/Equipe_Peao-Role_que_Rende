import { icones, type NomeIcone } from "./icones-data";

type Props = { nome: NomeIcone; tamanho?: number; rotulo?: string };

/** Ícone Lucide inline. Sem rótulo, fica oculto para leitores de tela (decorativo). */
export function Icone({ nome, tamanho = 24, rotulo }: Props) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      role={rotulo ? "img" : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icones[nome] }}
    />
  );
}
