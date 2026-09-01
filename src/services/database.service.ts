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

export interface Station {
  id?: number;
  title: string;
  status: 'free' | 'in_use' | 'maintenance';
  user?: string;
  time: number;
}

export class AppDatabase extends Dexie {
  users!: Table<User>;
  config!: Table<Config>;
  logo!: Table<Logo>;
  theme!: Table<Theme>;
  computers!: Table<Computer>;
  stations!: Table<Station, number>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      users: '++id, isLoggedIn',
      config: 'key, appName',
      logo: '++id',
      theme: '++id',
      computers: '++id, title',
      stations: '++id',
    });

    this.getAppConfig();
    this.getAppLogo();
    this.getTheme()
  }

  async getAppConfig() {
    const config = await this.config.toCollection().first();
    if (!config?.appName) {
      this.config.add({
        appName: 'RaccoonTech',
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

    // store logo
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
  }

  async getTheme(): Promise<string> {
    const theme = await this.theme.toCollection().first()

    if(theme?.background) {
      return URL.createObjectURL(theme.background)
    } 

    const response = await fetch('/bg.png')
    const blob = await response.blob()
    
    // store theme
    if(theme) {
      theme.background = blob
      await this.theme.put(theme)
    } else {
      await this.theme.add({background: blob})
    }
  }
}

export const db = new AppDatabase();
