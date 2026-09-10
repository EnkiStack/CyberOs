import { useEffect, useRef, useState } from 'react'

type MusicProps = {
  isPlaying: boolean
  onToggle: () => void
}

const tracks = [
  { title: 'My Favorite Song', src: '/legacy_site/assets/sounds/sakura-serenade_89861.mp3' },
  { title: 'Night Pulse', src: '/legacy_site/assets/sounds/sakura-serenade_89861.mp3' },
  { title: 'Dream Horizon', src: '/legacy_site/assets/sounds/sakura-serenade_89861.mp3' },
]

export function Music({ isPlaying, onToggle }: MusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.src = currentTrack.src
    audio.load()

    if (isPlaying) {
      audio.play().catch(() => undefined)
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlaying])

  const changeTrack = (direction: 'prev' | 'next') => {
    setCurrentTrackIndex((current) => {
      if (direction === 'prev') {
        return (current - 1 + tracks.length) % tracks.length
      }

      return (current + 1) % tracks.length
    })
  }

  return (
    <div className={`music-player ${isPlaying ? 'playing' : 'paused'}`}>
      <div className="container">
        <div className="player-info">
          <span className="music-icon">♪</span>
          <div>
            <div className="song-name">{currentTrack.title}</div>
            <div className="song-status">{isPlaying ? 'Playing' : 'Paused'}</div>
          </div>
        </div>

        <div className="player-controls">
          <button type="button" className="player-control-btn" onClick={() => changeTrack('prev')} aria-label="Previous track">
            ⏮
          </button>
          <button type="button" className="play-btn" onClick={onToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <button type="button" className="player-control-btn" onClick={() => changeTrack('next')} aria-label="Next track">
            ⏭
          </button>
        </div>

        <input type="range" min="0" max="100" value={isPlaying ? 45 : 0} readOnly aria-label="Track progress" />

        <audio ref={audioRef} preload="auto" loop>
          <source src={currentTrack.src} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  )
}
