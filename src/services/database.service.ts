import Dexie, { Table } from 'dexie';

export interface Logo {
  id?: number;
  file?: Blob;
}

export interface User {
  id?: number;
  password?: string;
  isLoggedIn: boolean;
}

export interface Config {
  appName: string;
  key: any;
  pricePerHour: number
}

export interface Theme {
  id?: number
  background?: Blob
}

export interface Computer {
  id?: number;
  title?: string
}

export class AppDatabase extends Dexie {
  users!: Table<User>;
  config!: Table<Config>;
  logo!: Table<Logo>;
  theme!: Table<Theme>;
  computers!: Table<Computer>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      users: '++id, isLoggedIn',
      config: '++key, appName',
      logo: '++id, file',
      theme: '++id, background',
      computers: 'id, title',
    });

    this.version(1).stores({
      logo: '++id, file',
    });

    this.getAppConfig();
    this.getAppLogo();
    this.getTheme()
  }

  async getAppConfig() {
    const config = await this.config.toCollection().first();
    if (!config?.appName) {
      this.config.add({
        appName: 'HouseLan',
        key: 0,
        pricePerHour: 0
      });
    }
  }

  async getAppLogo(): Promise<string> {
    const logo = await this.logo.toCollection().first();

    if (logo?.file instanceof Blob) {
      return URL.createObjectURL(logo.file);
    }

    const response = await fetch('/logo.png');
    const blob = await response.blob();

    if (logo) {
      await this.logo.update(logo.id, {
        file: blob,
      });
    } else {
      await this.logo.add({
        id: 0,
        file: blob,
      });
    }

    return URL.createObjectURL(blob);
  }

  async getTheme(): Promise<string> {
    const theme = await this.theme.toCollection().first()

    if(theme?.background) {
      return URL.createObjectURL(theme.background)
    } 

    const response = await fetch('/bg.png')
    const blob = await response.blob()
    
    if(theme) {
      theme.background = blob
      await this.theme.put(theme)
    } else {
      await this.theme.add({background: blob})
    }

    return URL.createObjectURL(blob)
  }
}

export const db = new AppDatabase();
