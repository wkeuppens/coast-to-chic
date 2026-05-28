import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Project',
    links: [
      { label: 'Iceland 2027', href: '/iceland' },
      { label: 'EU Stages', href: '/eu-stages' },
      { label: 'Archive', href: '/archive' },
      { label: 'Shoreholders', href: '/shoreholders' },
      { label: 'Timeline', href: '/timeline' },
    ],
  },
  {
    title: 'Events',
    links: [
      { label: 'All events', href: '/events' },
      { label: 'Follow The Kust', href: '/follow-the-kust' },
      { label: 'Trail Retreat Girona', href: '/trail-retreat-girona' },
      { label: 'Crossing Madeira', href: '/crossing-madeira' },
      { label: 'Tour du Mont Blanc', href: '/tour-du-mont-blanc' },
    ],
  },
  {
    title: 'Publications',
    links: [
      { label: 'Book 3 · Gibraltar to Monaco', href: '/book-3' },
      { label: 'Order books', href: '/order-books' },
      { label: 'Prints', href: '/prints' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/followthecoast_' },
      { label: 'YouTube', href: 'https://www.youtube.com/channel/UCL6tnj4kOTP-X5DmxfWhnLA' },
      { label: 'WhatsApp', href: 'https://chat.whatsapp.com/BazCDyy7n0wDcAhFwyq1xV' },
      { label: 'Email', href: 'mailto:hello@followthecoast.com' },
      { label: 'Partner', href: '/support#contact' },
    ],
  },
];

/**
 * Colophon. Hairline bleeds off both edges. Monospace metadata below.
 * Studio name, Brussels coordinates, copyright, social links as plain text.
 */
export const Footer = () => {
  return (
    <footer className="bg-coast-blue text-primary-foreground">
      {/* Full-bleed hairline */}
      <div className="w-full border-t border-inv-border" />

      <div className="px-page pt-12 pb-10">
        {/* Top index strip — studio coordinates, system reference */}
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-12 text-inv-muted">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em]">
            Studio Willem Keuppens
          </span>
          <span className="font-mono text-[0.7rem] tracking-[0.06em]">
            Brussels · 50.8503°N · 04.3517°E
          </span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] ml-auto">
            SYS.001 · 2026
          </span>
        </div>

        {/* Links — mono labels, no chrome */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-14">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-inv-subtle mb-3">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => {
                  const isExternal = link.href.startsWith('http') || link.href.startsWith('mailto:');
                  const className = "font-mono text-[0.75rem] tracking-[0.02em] text-inv-muted hover:text-inv transition-colors duration-200";
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.href} className={className}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom — hairline bleeds, then mono metadata */}
        <div className="border-t border-inv-border pt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-inv-subtle">
            © 2026 Follow the Coast · All stages, all photographs
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-inv-subtle hover:text-inv transition-colors">
              Privacy
            </Link>
            <Link to="/participant-handbook" className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-inv-subtle hover:text-inv transition-colors">
              Handbook
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
