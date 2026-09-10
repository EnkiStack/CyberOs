import { useState } from 'react'

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [videoQuery, setVideoQuery] = useState('')
  const [imageQuery, setImageQuery] = useState('')
  const [chatQuery, setChatQuery] = useState('')
  const [engine, setEngine] = useState('google')

  const openExternalSearch = (value: string, type: 'web' | 'video' | 'image' | 'chat') => {
    const query = value.trim()
    if (!query) {
      return
    }

    const encoded = encodeURIComponent(query)
    let url = 'https://www.google.com/search?q=' + encoded

    if (type === 'video') {
      url = 'https://www.youtube.com/results?search_query=' + encoded
    } else if (type === 'image') {
      url = 'https://yandex.com/images/search?text=' + encoded
    } else if (type === 'chat') {
      url = 'https://chat.openai.com/?q=' + encoded
    } else if (engine === 'duckduck') {
      url = 'https://duckduckgo.com/?q=' + encoded
    } else if (engine === 'yandex') {
      url = 'https://yandex.com/search/?text=' + encoded
    }

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="search-container">
      <section className="search-box">
        <div className="search-box-items search-box-items-web">
          <input
            placeholder="Search..."
            aria-label="Search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                openExternalSearch(searchQuery, 'web')
              }
            }}
          />
          <select
            aria-label="Search engine"
            value={engine}
            onChange={(event) => setEngine(event.target.value)}
          >
            <option value="google">Google</option>
            <option value="duckduck">DuckDuck</option>
            <option value="yandex">yandex</option>
          </select>
        </div>
      </section>

      <section className="search-box">
        <div className="search-box-items">
          <img
            src="/legacy_site/assets/icons/image.png"
            alt="youtube icon"
            className="youtube-icon"
          />
          <input
            placeholder="YouTube"
            aria-label="YouTube"
            value={videoQuery}
            onChange={(event) => setVideoQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                openExternalSearch(videoQuery, 'video')
              }
            }}
          />
        </div>
      </section>

      <section className="search-box">
        <div className="search-box-items">
          <div className="SearchImages">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEaD8dCtJfUONN7JGwxsMfb0GQ1ArXYiSfKxJAMzH2ew&s=10"
              alt="yandex icon"
              className="yandex-icon"
            />
          </div>
          <input
            placeholder="Search images"
            className="yandex-input"
            aria-label="Search images"
            value={imageQuery}
            onChange={(event) => setImageQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                openExternalSearch(imageQuery, 'image')
              }
            }}
          />
        </div>
      </section>

      <section className="search-box">
        <div className="search-box-items">
          <img
            src="data:image/png;base64,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"
            alt="chatgpt icon"
            className="youtube-icon"
          />
          <input
            placeholder="ChatGPT"
            aria-label="ChatGPT"
            className="chatgpt-input"
            value={chatQuery}
            onChange={(event) => setChatQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                openExternalSearch(chatQuery, 'chat')
              }
            }}
          />
        </div>
      </section>
    </div>
  )
}
