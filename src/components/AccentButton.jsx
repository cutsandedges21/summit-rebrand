import { Link } from 'react-router-dom'
import Magnetic from './Magnetic.jsx'

/**
 * The site's one button. Ink sweeps up from the bottom edge on hover and the
 * label inverts with it, so the two layers must share a duration and a curve or
 * the text changes colour before the fill arrives underneath it.
 *
 * Wrapped in <Magnetic>, which is inert on touch and under reduced motion.
 */
export default function AccentButton({ to, href, children, className = '', ...rest }) {
  const classes =
    'group relative inline-block overflow-hidden bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase ' +
    className

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
      />
      <span className="relative transition-colors duration-500 group-hover:text-paper group-focus-visible:text-paper">
        {children}
      </span>
    </>
  )

  return (
    <Magnetic>
      {to ? (
        <Link to={to} className={classes} {...rest}>
          {inner}
        </Link>
      ) : (
        <a href={href} className={classes} {...rest}>
          {inner}
        </a>
      )}
    </Magnetic>
  )
}

/** The quieter sibling: a text link whose arrow steps forward on hover. */
export function ArrowLink({ to, children, className = '' }) {
  return (
    <Link to={to} className={`group inline-flex items-center gap-2 ${className}`}>
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:translate-x-1.5 motion-reduce:transition-none"
      >
        →
      </span>
    </Link>
  )
}
