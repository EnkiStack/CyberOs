export function Settings() {
  return (
    <section className="widget settings-widget">
      <span className="widget-label">Settings</span>
      <div className="settings-list">
        <label>
          <span>Theme</span>
          <select defaultValue="dark">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="matrix">Matrix</option>
          </select>
        </label>
        <label>
          <span>Volume</span>
          <input type="range" min="0" max="100" defaultValue="70" />
        </label>
      </div>
    </section>
  )
}
