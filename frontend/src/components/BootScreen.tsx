import { useEffect, useState } from 'react'

const messages = [
  'INITIALIZING...',
  'CONNECTING...',
  'LOADING MODULES...',
  'ACCESS GRANTED',
  'WELCOME BACK',
]

export default function BootScreen() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => Math.min(current + 1, messages.length - 1))
    }, 600)

    const timer = window.setTimeout(() => {
      window.clearInterval(interval)
      setVisible(false)
    }, 3500)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timer)
    }
  }, [])

  if (!visible) {
    return null
  }

  return (
    <div className="boot-screen">
      <div className="boot-logo">CyberOs</div>
      <div className="boot-text" id="boot-text">
        {messages[index] ?? messages[messages.length - 1]}
      </div>
    </div>
  )
}
