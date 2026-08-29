
import Dexie, { Table } from "dexie";

export interface User  {
    id?: number;
    password?: string;
    isLoggedIn: boolean;
}

export class AppDatabase extends Dexie {
  users!: Table<User>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      users: '++id, isLoggedIn'
    });
  }
}

export const db = new AppDatabase();