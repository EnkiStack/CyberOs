export type NotificationTone = 'info' | 'success' | 'warning' | 'error'

export type NotificationItem = {
  id: string
  message: string
  tone?: NotificationTone
}

type NotificationProps = {
  items: NotificationItem[]
}

export function Notification({ items }: NotificationProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="notification-layer" aria-live="polite" aria-label="Notifications">
      {items.map((item) => (
        <div
          key={item.id}
          className={`notification-toast ${item.tone ?? 'info'}`}
        >
          <span className="notification-icon">
            {item.tone === 'success' ? '✓' : item.tone === 'warning' ? '⚠' : item.tone === 'error' ? '⛔' : 'ℹ'}
          </span>
          <span>{item.message}</span>
        </div>
      ))}
    </div>
  )
}
