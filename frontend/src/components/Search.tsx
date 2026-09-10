import { useState } from 'react'

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [videoQuery, setVideoQuery] = useState('')
  const [imageQuery, setImageQuery] = useState('')
  const [engine, setEngine] = useState('google')

  const openExternalSearch = (value: string, type: 'web' | 'video' | 'image') => {
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
    </div>
  )
}
