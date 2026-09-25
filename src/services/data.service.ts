import { fileToDataURL } from '@/utis/file';
import { Analytics, ClientStation, db, Station, StationStatus } from './database.service';

export default class DataService {
  data: {
    config: {
      appName: string;
      pricePerHour: number;
    };
    logoUrl: string;
    pricePerHour: number;
    backgroundUrl: string;
  } = {
    config: {
      appName: 'HouseLan',
      pricePerHour: 0,
    },
    logoUrl: '',
    pricePerHour: 0,
    backgroundUrl: '',
  };

  constructor() {
    this.loadAll();
  }

  async loadAll() {
    await Promise.all([this.getConfig(), this.getLogo(), this.getTheme()]);
    return this.data;
  }

  async getConfig() {
    const appConfig = await db.config.toCollection().first();
    this.data.config = {
      appName: appConfig?.appName || 'RaccoonTech',
      pricePerHour: appConfig?.pricePerHour || 0,
    };
  }

  async getLogo() {
    let logoObjectUrl = null;
    const logo = await db.logo.toCollection().first();

    if (logoObjectUrl) {
      URL.revokeObjectURL(logoObjectUrl);
    }

    if (logo?.file instanceof Blob) {
      logoObjectUrl = URL.createObjectURL(logo.file);
      this.data.logoUrl = logoObjectUrl;

      // set app icon
      try {
        const dataUrl = await fileToDataURL(logo.file);
        if (window.electronAPI?.setIcon) {
          await window.electronAPI.setIcon(dataUrl);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      this.data.logoUrl = '/logo.png';
    }
  }

  async getTheme() {
    const theme = await db.getTheme();
    this.data.backgroundUrl = theme;
  }

  async getStations() {
    return await db.stations.toArray();
  }

  async createStation(data: Station) {
    await db.stations.add(data);
    return await db.stations.toArray();
  }

  async updateStation(data: Station) {
    await db.stations.update(data.id, data);
    return await db.stations.toArray();
  }

  async assignClientToStation(data: ClientStation) {
    const station = await db.stations.where("id").equals(data.stationId).first();
    if(station) {
      const sessionId = await db.sessions.add(data);
      const clientWithId = { ...data, id: sessionId };
      station.status = StationStatus.InUse;
      station.client = clientWithId;
      await db.stations.update(station.id, station);
    }
    await this.refreshAnalytics();
    return await db.stations.toArray();
  }

  async removeStation(id: number) {
    const station = await db.stations.where("id").equals(id).first();
    if (station?.client) {
      if (station.client.id) {
        await db.sessions.update(station.client.id, { finished: true });
      } else {
        await db.sessions.add({ ...station.client, finished: true });
      }
    }
    await db.stations.delete(id);
    await this.refreshAnalytics();
    return await db.stations.toArray();
  }

  async removeClientFromStation(id: number, timeOverride?: number) {
    const station = await db.stations.where("id").equals(id).first();
    
    if(station) {
      if (station.client) {
        station.client.finished = true;
        if (typeof timeOverride === 'number' && timeOverride >= 0) {
          station.client.time = timeOverride;
        }
        if (station.client.id) {
          await db.sessions.update(station.client.id, { finished: true, time: station.client.time });
        } else {
          await db.sessions.add(station.client);
        }
      }
      station.client = null;
      station.status = StationStatus.Free;
      await db.stations.update(id, station);
    }
    await this.refreshAnalytics();
    return await db.stations.toArray();
  }

  async setFinishedClientStation(id: number) {
    const station = await db.stations.where("id").equals(id).first();

    if(station && station.client) {
      station.client.finished = true;
      await db.stations.update(id, station);
      if (station.client.id) {
        await db.sessions.update(station.client.id, { finished: true });
      }
    }
    await this.refreshAnalytics();
    return await db.stations.toArray();
  }

  async getStationsWithClient() {
    const stations = await this.getStations()

    return stations
  }

  async getAnalytics(): Promise<Analytics> {
    const analytics = await db.getAnalytics()
    return analytics;
  }

  async refreshAnalytics(): Promise<Analytics> {
    return db.refreshAnalytics();
  }

  // async getAnalytics() {
  //   const stations = await this.getStations();

  //   const pricePerHour = toNumber(this.data.config.pricePerHour);

  //   const sessions = (stations || []).filter((s) => (Number(s.client?.time) || 0) > 0);

  //   const totalSeconds = sessions.reduce((acc, s) => acc + (Number(s.client?.time) || 0), 0);
  //   const secondsToday = sessions.filter((s) => isToday(s.client?.datetime)).reduce((acc, s) => acc + (Number(s.client?.time) || 0), 0);

  //   const hoursTotal = totalSeconds / 3600;
  //   const hoursToday = secondsToday / 3600;

  //   return {
  //     // horas em decimal (arredondado, sem 0.0833333333)
  //     hoursTotal: Number(hoursTotal.toFixed(4)),
  //     hoursToday: Number(hoursToday.toFixed(4)),

  //     // minutos — o mais fácil de ler para sessões curtas
  //     minutesTotal: Math.round(totalSeconds / 60),
  //     minutesToday: Math.round(secondsToday / 60),

  //     // formato de relógio 00:05
  //     hoursTotalLabel: formatClock(totalSeconds), // "00:05"
  //     hoursTodayLabel: formatClock(secondsToday),

  //     financeTotal: Number((hoursTotal * pricePerHour).toFixed(2)),
  //     financeToday: Number((hoursToday * pricePerHour).toFixed(2)),

  //     financeTotalLabel: formatBRL(hoursTotal * pricePerHour), // "R$ 0,08"
  //     financeTodayLabel: formatBRL(hoursToday * pricePerHour),
  //   };
  // }
}
