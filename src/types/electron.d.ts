// Defina a estrutura das suas propriedades para ter autocomplete das chaves conhecidas
export interface AppProperties {
  password?: string;
  [key: string]: string | undefined; // Permite outras chaves genéricas
}

// Interface com os métodos expostos no preload.ts
export interface ElectronConfigAPI {
  read: () => Promise<AppProperties>;
  set: (key: string, value: string) => Promise<AppProperties>;
}

export interface ElectronAPI {
  openExternal: (url: string) => void;
  setIcon: (iconData: string) => Promise<boolean>;
}

// Estende a interface Window global do navegador
declare global {
  interface Window {
    config: ElectronConfigAPI;
    electronAPI?: ElectronAPI;
  }
}