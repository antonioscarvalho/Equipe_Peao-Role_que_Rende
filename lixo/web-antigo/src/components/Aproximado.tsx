/** "≈" antes de um valor estimado; o leitor de tela lê "cerca de" em vez do nome do símbolo. */
export function Aproximado() {
  return (
    <>
      <span aria-hidden="true">≈ </span>
      <span className="sr-only">cerca de </span>
    </>
  )
}
