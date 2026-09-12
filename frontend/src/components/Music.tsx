import { type ChangeEvent, useEffect, useRef, useState } from 'react'

type Track = {
  title: string
  src: string
}

type MusicProps = {
  isPlaying: boolean
  onToggle: () => void
}

const STORAGE_KEY = 'cyberstart-custom-music-v1'

const defaultTracks: Track[] = [
  { title: 'My Favorite Song', src: '/legacy_site/assets/sounds/sakura-serenade_89861.mp3' },
  { title: 'Night Pulse', src: '/legacy_site/assets/sounds/sakura-serenade_89861.mp3' },
  { title: 'Dream Horizon', src: '/legacy_site/assets/sounds/sakura-serenade_89861.mp3' },
]

const readSavedTracks = (): Track[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return []
    }

    const parsed = JSON.parse(saved) as Track[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function Music({ isPlaying, onToggle }: MusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [customTracks, setCustomTracks] = useState<Track[]>(() => readSavedTracks())
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const tracks = [...defaultTracks, ...customTracks]
  const currentTrack = tracks[currentTrackIndex] ?? defaultTracks[0]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customTracks))
    }
  }, [customTracks])

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
      if (tracks.length === 0) {
        return 0
      }

      if (direction === 'prev') {
        return (current - 1 + tracks.length) % tracks.length
      }

      return (current + 1) % tracks.length
    })
  }

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) {
      return
    }

    const loadedTracks = await Promise.all(
      files
        .filter((file) => file.type.startsWith('audio/'))
        .map((file) => {
          return new Promise<Track>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              const result = typeof reader.result === 'string' ? reader.result : ''
              resolve({
                title: file.name.replace(/\.[^/.]+$/, '') || 'New track',
                src: result,
              })
            }
            reader.onerror = () => reject(new Error(`Ошибка чтения: ${file.name}`))
            reader.readAsDataURL(file)
          })
        }),
    )

    const validTracks = loadedTracks.filter((track) => track.src)
    if (validTracks.length === 0) {
      event.target.value = ''
      return
    }

    setCustomTracks((current) => {
      const nextTracks = [...current, ...validTracks]
      setCurrentTrackIndex(defaultTracks.length + nextTracks.length - 1)
      return nextTracks
    })

    event.target.value = ''
  }

  const addMusic = () => {
    fileInputRef.current?.click()
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
          <button
            type="button"
            className="player-control-btn add-new-music"
            onClick={addMusic}
            aria-label="Добавить новую музыку"
          >
            ➕
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />

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
