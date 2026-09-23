function toNumber(value: any) {
    if (typeof value === 'number') return value
    if (!value) return 0

    const clean = String(value)
        .replace(/[^\d,.-]/g, '')   // tira "R$" e espaços
        .replace(/\./g, '')         // milhar "1.234,56"
        .replace(',', '.')          // decimal pt-BR

    const n = Number(clean)
    return Number.isNaN(n) ? 0 : n
}

function isToday(dateValue: any) {
    const d = new Date(dateValue)
    if (Number.isNaN(d.getTime())) return false

    const now = new Date()
    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
    )
}

function formatBRL(value: any) {
    return (Number(value) || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

function formatClock(seconds: any) {
    const total = Math.max(0, Math.round(Number(seconds) || 0))

    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60

    const pad = (n) => String(n).padStart(2, '0')

    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export {
    formatBRL, formatClock, isToday, toNumber
}

