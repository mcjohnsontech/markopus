import type { ConnectionStatus, WebSocketMessage, MetricPoint, ActivityLog } from '@/types'

type MessageCallback = (message: WebSocketMessage) => void
type StatusCallback = (status: ConnectionStatus) => void

class WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempt = 0
  private maxReconnectAttempts = Infinity
  private reconnectDelay = 1000
  private maxReconnectDelay = 30000
  private messageCallbacks: MessageCallback[] = []
  private statusCallbacks: StatusCallback[] = []
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private isManuallyClosed = false

  constructor(url = 'ws://localhost:8888') {
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isManuallyClosed = false
        this.notifyStatus('connecting')

        this.ws = new WebSocket(this.url)

        this.connectionTimeout = setTimeout(() => {
          if (this.ws?.readyState === WebSocket.CONNECTING) {
            this.ws.close()
            reject(new Error('Connection timeout'))
          }
        }, 5000)

        this.ws.onopen = () => {
          clearTimeout(this.connectionTimeout!)
          this.reconnectAttempt = 0
          this.reconnectDelay = 1000
          this.notifyStatus('connected')
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.notifyMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onerror = () => {
          this.notifyStatus('error')
        }

        this.ws.onclose = () => {
          clearTimeout(this.connectionTimeout!)
          if (!this.isManuallyClosed) {
            this.attemptReconnect()
          }
        }
      } catch (error) {
        this.notifyStatus('error')
        reject(error)
      }
    })
  }

  private attemptReconnect(): void {
    if (this.isManuallyClosed) return

    this.notifyStatus('disconnected')
    this.reconnectAttempt++

    const jitter = Math.random() * 1000
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempt - 1) + jitter,
      this.maxReconnectDelay
    )

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isManuallyClosed) {
        this.connect().catch(() => {
          // Connection failed, attemptReconnect will be called from onclose
        })
      }
    }, delay)
  }

  disconnect(): void {
    this.isManuallyClosed = true
    if (this.connectionTimeout) clearTimeout(this.connectionTimeout)
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.notifyStatus('disconnected')
  }

  send(message: WebSocketMessage): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message))
        return true
      } catch (error) {
        console.error('Failed to send WebSocket message:', error)
        return false
      }
    }
    return false
  }

  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.push(callback)
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter((cb) => cb !== callback)
    }
  }

  onStatusChange(callback: StatusCallback): () => void {
    this.statusCallbacks.push(callback)
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter((cb) => cb !== callback)
    }
  }

  private notifyMessage(message: WebSocketMessage): void {
    this.messageCallbacks.forEach((cb) => {
      try {
        cb(message)
      } catch (error) {
        console.error('Error in message callback:', error)
      }
    })
  }

  private notifyStatus(status: ConnectionStatus): void {
    this.statusCallbacks.forEach((cb) => {
      try {
        cb(status)
      } catch (error) {
        console.error('Error in status callback:', error)
      }
    })
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  getStatus(): ConnectionStatus {
    if (this.ws?.readyState === WebSocket.OPEN) return 'connected'
    if (this.ws?.readyState === WebSocket.CONNECTING) return 'connecting'
    if (this.isManuallyClosed) return 'disconnected'
    return 'error'
  }
}

// Singleton instance
let wsInstance: WebSocketService | null = null

export function getWebSocketService(): WebSocketService {
  if (!wsInstance) {
    wsInstance = new WebSocketService()
  }
  return wsInstance
}

export function resetWebSocketService(): void {
  if (wsInstance) {
    wsInstance.disconnect()
    wsInstance = null
  }
}
