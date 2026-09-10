import { useEffect, useRef } from 'react'

type MusicProps = {
  isPlaying: boolean
  onToggle: () => void
}

export function Music({ isPlaying, onToggle }: MusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) audio.play().catch(() => undefined)
    else audio.pause()
  }, [isPlaying])

  return (
    <div className={`music-player ${isPlaying ? 'playing' : 'paused'}`}>
      <div className="container">
        <div className="player-info">
          <span className="music-icon">♪</span>
          <div>
            <div className="song-name">My Favorite Song</div>
            <div className="song-status">{isPlaying ? 'Playing' : 'Paused'}</div>
          </div>
        </div>

        <div className="player-controls">
          <button type="button" className="play-btn" onClick={onToggle}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <input type="range" min="0" max="100" value={isPlaying ? 45 : 0} readOnly />
        </div>

        <audio ref={audioRef} preload="auto">
          <source src="/legacy_site/assets/sounds/sakura-serenade_89861.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  )
}
