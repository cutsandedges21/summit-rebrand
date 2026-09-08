import { Link, NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <header className="flex items-baseline justify-between px-6 py-5 md:px-12">
      <Link to="/" aria-label="mossimo Studios, home">
        <img
          src="/brand/logo-wordmark.png"
          alt="mossimo Studios"
          width={2069}
          height={760}
          className="h-7 w-auto mix-blend-multiply md:h-9"
        />
      </Link>
      <nav className="flex gap-1 font-sans text-[11px] font-medium md:gap-2 md:text-[13px]">
        {LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-2 py-1 ${isActive ? 'bg-accent font-semibold' : 'text-ink-muted hover:text-ink'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
