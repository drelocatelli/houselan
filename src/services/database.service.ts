import { dayKey, formatBRL, formatClock, isToday, toNumber } from '@/utis/helpers';
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
  title?: string;
  status?: StationStatus;
  client?: ClientStation;
}

export enum StationStatus {
  Free = 'free',
  InUse = 'in_use',
  Maintenance = 'maintenance'
}

export interface ClientStation {
  id?: number;
  title?: string;
  finished: boolean
  stationId?: string;
  user?: string;
  time: number;
  datetime?: string;
}

export interface Analytics {
  id: number;
  date?:string;
  hoursTotal?: number
  hoursToday?: number
  minutesTotal?: number
  minutesToday?: number
  hoursTotalLabel?: string
  hoursTodayLabel?: string
  financeTotal?: number
  financeToday?: number
  financeTotalLabel?: string
  financeTodayLabel?: string
}

export class AppDatabase extends Dexie {
  users!: Table<User>;
  config!: Table<Config>;
  logo!: Table<Logo>;
  theme!: Table<Theme>;
  computers!: Table<Computer>;
  stations!: Table<Station, number>;
  analytics!: Table<Analytics>;
  sessions!: Table<ClientStation, number>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      users: '++id, isLoggedIn',
      config: 'key, appName',
      logo: '++id',
      theme: '++id',
      computers: '++id, title',
      stations: '++id',
      analytics: '++id',
      sessions: '++id, datetime, finished'
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

  async computeAnalytics(): Promise<Analytics> {
    const [stations, dbSessions, config] = await Promise.all([
      this.stations.toArray(),
      this.sessions.toArray(),
      this.config.toCollection().first(),
    ]);

    const pricePerHour = toNumber(config?.pricePerHour);

    const sessionMap = new Map<number | string, ClientStation>();

    for (const session of dbSessions) {
      if (session.id !== undefined) {
        sessionMap.set(session.id, session);
      }
    }

    for (const station of stations) {
      if (station.client && toNumber(station.client.time) > 0) {
        if (station.client.id && !sessionMap.has(station.client.id)) {
          sessionMap.set(station.client.id, station.client);
        } else if (!station.client.id) {
          const key = `active_${station.id}_${station.client.datetime}`;
          sessionMap.set(key, station.client);
        }
      }
    }

    const validSessions = Array.from(sessionMap.values()).filter(
      (s) => toNumber(s.time) > 0
    );

    const totalSeconds = validSessions.reduce(
      (acc, s) => acc + toNumber(s.time),
      0,
    );
    const secondsToday = validSessions
      .filter((s) => isToday(s.datetime))
      .reduce((acc, s) => acc + toNumber(s.time), 0);

    const hoursTotal = totalSeconds / 3600;
    const hoursToday = secondsToday / 3600;

    return {
      id: 1,
      date: dayKey(),

      hoursTotal: Number(hoursTotal.toFixed(4)),
      hoursToday: Number(hoursToday.toFixed(4)),

      minutesTotal: Math.round(totalSeconds / 60),
      minutesToday: Math.round(secondsToday / 60),

      hoursTotalLabel: formatClock(totalSeconds),
      hoursTodayLabel: formatClock(secondsToday),

      financeTotal: Number((hoursTotal * pricePerHour).toFixed(2)),
      financeToday: Number((hoursToday * pricePerHour).toFixed(2)),

      financeTotalLabel: formatBRL(hoursTotal * pricePerHour),
      financeTodayLabel: formatBRL(hoursToday * pricePerHour),
    };
  }


   /** Recalcula e grava o snapshot. Use após qualquer mutação em stations. */
  async refreshAnalytics(): Promise<Analytics> {
    const snapshot = await this.computeAnalytics();

    // id fixo 1 = snapshot único; put() insere ou substitui
    await this.analytics.put({ ...snapshot, id: 1 });

    return snapshot;
  }

  /** Lê do cache; recalcula sozinho se estiver vazio ou de um dia anterior. */
  async getAnalytics(): Promise<Analytics> {
    const cached = await this.analytics.get(1);

    if (!cached || cached.date !== dayKey()) {
      return this.refreshAnalytics();
    }

    return cached;
  }
}

export const db = new AppDatabase();
