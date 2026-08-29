export const readConfig = async() => window.config.read()

export const setConfig = async(key: string, value: string) => window.config.set(key, value)

const config = {
    read: readConfig,
    set: setConfig
}

export default config