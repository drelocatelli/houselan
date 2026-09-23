// composables/useAnalytics.ts
import DataService from '@/services/data.service.js'
import { reactive, readonly, type UnwrapNestedRefs } from 'vue'

const dataService = new DataService()

export function useAnalytics() {
  const analytics = reactive({
    isLoading: true,

    hoursTotal: 0,
    hoursToday: 0,
    minutesTotal: 0,
    minutesToday: 0,
    hoursTotalLabel: '00:00',
    hoursTodayLabel: '00:00',
    financeTotal: 0,
    financeToday: 0,
    financeTotalLabel: 'R$ 0,00',
    financeTodayLabel: 'R$ 0,00',
  })

  async function loadAnalytics() {
    try {
      analytics.isLoading = true

      const data = await dataService.getAnalytics()
      await new Promise(resolve => setTimeout(resolve, 1000))

      Object.assign(analytics, data, { isLoading: false })
    } catch (err) {
      console.error(err)
      analytics.isLoading = false
    } finally {
        console.log('load analytics')
    }
  }

  return { analytics: readonly(analytics) as UnwrapNestedRefs<typeof analytics>, loadAnalytics }
}
