export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export type ActivitySeverity = 'info' | 'warning' | 'critical'

export interface MetricPoint {
  timestamp: number
  cpu: number
  memory: number
  network: number
  requests: number
  activeConnections: number
}

export interface ActivityLog {
  id: string
  severity: ActivitySeverity
  message: string
  timestamp: number
}

export interface WebSocketMessage<T = unknown> {
  type: 'metrics' | 'alert'
  data: T
}

export interface AppState {
  metrics: MetricPoint[]
  activityLogs: ActivityLog[]
  connectionStatus: ConnectionStatus
  isPaused: boolean
  logFilter: ActivitySeverity | 'all'
  uptime: number
  avgLatency: number
  packetLoss: number
  errorRate: number
}

export interface ThresholdAlert {
  key: string
  severity: ActivitySeverity
  message: string
  cooldownMs: number
}
