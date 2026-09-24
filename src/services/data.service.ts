import { fileToDataURL } from '@/utis/file';
import { formatBRL, formatClock, isToday, toNumber } from '@/utis/helpers';
import { ClientStation, db, Station } from './database.service';

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

  async assignClientToStation(data: ClientStation) {
    const station = await db.stations.where("id").equals(data.stationId).first()
    if(station) {
      await db.stations.update(station.id, { ...station, client: data })
    }
    return await db.stations.toArray();
  }

  async removeStation(id: number) {
    await db.stations.delete(id);
    return await db.stations.toArray();
  }

  async setFinishedClientStation(id: number) {
    const station = await db.stations.where("id").equals(id).first()

    if(station) {
      station.client.finished = true
      await db.stations.update(id, station)
    }
    return await db.stations.toArray();
  }

  async getStationsWithClient() {
    const stations = await this.getStations()

    return stations
  }

  async getAnalytics() {
    const stations = await this.getStations();

    const pricePerHour = toNumber(this.data.config.pricePerHour);

    const sessions = (stations || []).filter((s) => (Number(s.client?.time) || 0) > 0);

    const totalSeconds = sessions.reduce((acc, s) => acc + (Number(s.client?.time) || 0), 0);
    const secondsToday = sessions.filter((s) => isToday(s.client?.datetime)).reduce((acc, s) => acc + (Number(s.client?.time) || 0), 0);

    const hoursTotal = totalSeconds / 3600;
    const hoursToday = secondsToday / 3600;

    return {
      // horas em decimal (arredondado, sem 0.0833333333)
      hoursTotal: Number(hoursTotal.toFixed(4)),
      hoursToday: Number(hoursToday.toFixed(4)),

      // minutos — o mais fácil de ler para sessões curtas
      minutesTotal: Math.round(totalSeconds / 60),
      minutesToday: Math.round(secondsToday / 60),

      // formato de relógio 00:05
      hoursTotalLabel: formatClock(totalSeconds), // "00:05"
      hoursTodayLabel: formatClock(secondsToday),

      financeTotal: Number((hoursTotal * pricePerHour).toFixed(2)),
      financeToday: Number((hoursToday * pricePerHour).toFixed(2)),

      financeTotalLabel: formatBRL(hoursTotal * pricePerHour), // "R$ 0,08"
      financeTodayLabel: formatBRL(hoursToday * pricePerHour),
    };
  }
}
