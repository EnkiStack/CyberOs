function Footer() {
  const links = [
    {
      href: 'https://t.me',
      label: 'Telegram',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.3 4.7 3.9 11.1c-1 .4-1 1.7.2 2l4.2 1.3 1.6 5.1c.2.7 1.1.9 1.6.4l2.2-2.3 4.5 3.2c.8.6 2 .2 2.3-.8l3.1-14.3c.3-1.2-.9-2.1-2-1.5Zm-6.6 11.8-1.1-3.9 6.9-6.7-5.8 10.6Z" />
        </svg>
      )
    },
    {
      href: 'https://github.com/EnkiStack',
      label: 'GitHub',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .8a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.7 1 .1-.8.4-1.4.7-1.7-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.3 0 0 1.1-.3 3.4 1.3a11.6 11.6 0 0 1 6.2 0c2.3-1.6 3.3-1.3 3.3-1.3.7 1.7.2 3 .1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .8Z" />
        </svg>
      )
    }
  ]

  return (
    <>
      {links.map(({ href, label, icon }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
          <span className="footer-icon">{icon}</span>
          <span>{label}</span>
        </a>
        
      ))}
    </>
  )
}

export default Footer;