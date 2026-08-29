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
}

export class AppDatabase extends Dexie {
  users!: Table<User>;
  config!: Table<Config>;
  logo!: Table<Logo>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      users: '++id, isLoggedIn',
      config: '++key, appName',
    });

    this.version(1).stores({
      logo: '++id, file',
    });

    this.getAppName();
    this.getAppLogo();
  }

  async getAppName() {
    const config = await this.config.toCollection().first();
    if (!config?.appName) {
      this.config.add({
        appName: 'HouseLan',
        key: 0,
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
}

export const db = new AppDatabase();
