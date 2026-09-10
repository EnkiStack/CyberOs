import { useEffect, useState } from 'react'

export function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <h1 id="clock">
      {time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </h1>
  )
}
