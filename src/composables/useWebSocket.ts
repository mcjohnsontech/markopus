import { onMounted, onBeforeUnmount } from 'vue'
import { getWebSocketService } from '@/services/websocket.service'
import { useMetricsStore } from '@/stores/metrics.store'

export function useWebSocket() {
  const store = useMetricsStore()
  const ws = getWebSocketService()

  onMounted(async () => {
    const unsubscribeMessage = ws.onMessage((message) => {
      if (message.type === 'metrics') {
        store.addMetricPoint(message.data as any)
      } else if (message.type === 'alert') {
        store.addActivityLog(message.data as any)
      }
    })

    const unsubscribeStatus = ws.onStatusChange((status) => {
      store.setConnectionStatus(status)
    })

    try {
      await ws.connect()
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }

    onBeforeUnmount(() => {
      unsubscribeMessage()
      unsubscribeStatus()
      ws.disconnect()
    })
  })

  return {
    isConnected: () => ws.isConnected(),
    getStatus: () => ws.getStatus(),
  }
}
