// Ponto único de entrada da personalização (spec 009). O resto do app só importa daqui.
export { ComPersonalizacao } from "./rota";
export { BotaoPersonalizar } from "./BotaoPersonalizar";
export { useAparenciaVisivel, apagarAparencia } from "./armazenamento";
export type { Aparencia } from "./aparencia";
export { usePerfil, apagarPerfil } from "./armazenamento-perfil";
export { CENARIOS, NOME_MAX, nomeDoBroto, FOTO_TIPOS_ACEITOS, type Perfil, type ErroNome, type ErroFoto } from "./perfil";
