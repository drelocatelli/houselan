import { fileToDataURL } from "@/utis/file";
import { db } from "./database.service";

export default class DataService {
    data: {
        config: {
            appName: string
            pricePerHour: number
        },
        logoUrl: string
        pricePerHour: number
        backgroundUrl: string
    } = {
        config: {
            appName: 'HouseLan',
            pricePerHour: 0
        },
        logoUrl: '',
        pricePerHour: 0,
        backgroundUrl: ''
    }

    constructor() {
        this.loadAll()
    }

    async loadAll() {
        await Promise.all([
            this.getConfig(),
            this.getLogo(),
            this.getTheme()
        ])
        return this.data
    }

    async getConfig() {
        const appConfig = await db.config.toCollection().first()
        this.data.config = {
            appName: appConfig?.appName || 'RaccoonTech',
            pricePerHour: appConfig?.pricePerHour || 0
        };
    }

    async getLogo() {
        let logoObjectUrl = null
        const logo = await db.logo.toCollection().first()

        if(logoObjectUrl) {
            URL.revokeObjectURL(logoObjectUrl)
        }

        if(logo?.file instanceof Blob) {
            logoObjectUrl = URL.createObjectURL(logo.file)
            this.data.logoUrl = logoObjectUrl

            // set app icon
            try {
                const dataUrl = await fileToDataURL(logo.file)
                if(window.electronAPI?.setIcon) {
                    await window.electronAPI.setIcon(dataUrl)
                }
            } catch(err) {
                console.error(err)
            }
        } else {
            this.data.logoUrl = '/logo.png'
        }
    }

    async getTheme() {
        const theme = await db.getTheme()
        this.data.backgroundUrl = theme;
    }

    
}