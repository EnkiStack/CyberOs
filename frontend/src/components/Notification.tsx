const notifications = ['System update complete', 'New mission unlocked']

export function Notification() {
  return (
    <div className="notification-list" aria-label="Notifications">
      {notifications.map((message) => (
        <span key={message}>{message}</span>
      ))}
    </div>
  )
}
