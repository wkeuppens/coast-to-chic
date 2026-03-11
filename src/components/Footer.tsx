import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Project',
    links: [
      { label: 'Register', href: '/register' },
      { label: 'Archive', href: '/archive' },
      { label: 'Shoreholders', href: '/shoreholders' },
      { label: 'Timeline', href: '/timeline' },
    ],
  },
  {
    title: 'Publications',
    links: [
      { label: 'Books', href: '/order-books' },
      { label: 'Prints', href: '/prints' },
    ],
  },
  {
    title: 'Side Routes',
    links: [
      { label: 'Home Run', href: '/homerun' },
      { label: 'Follow The Kust', href: '/follow-the-kust' },
      { label: 'Tour du Mont Blanc', href: '/tour-du-mont-blanc' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/followthecoast_' },
      { label: 'Email', href: 'mailto:hello@followthecoast.com' },
      { label: 'Support', href: '/support' },
    ],
  },
];

/**
 * Minimal editorial footer — like the colophon of a book.
 * Dark background, quiet typography, no decoration.
 */
export const Footer = () => {
  return (
    <footer className="text-primary-foreground" style={{ backgroundColor: 'hsl(var(--coast-blue))' }}>
      <div className="px-page py-16 md:py-24">
        <div className="max-w-content mx-auto">
          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="text-sm uppercase tracking-wider">
                <span className="block">Follow</span>
                <span className="block">The Coast</span>
              </Link>
            </div>
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-caption text-inv-subtle mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => {
                    const isExternal = link.href.startsWith('http') || link.href.startsWith('mailto:');
                    return (
                      <li key={link.label}>
                        {isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-inv-muted hover:text-inv transition-colors duration-300"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            className="text-sm text-inv-muted hover:text-inv transition-colors duration-300"
                          >
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

          {/* Bottom bar */}
          <div className="border-t border-inv-border pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-caption text-inv-subtle">
              © 2026 Follow The Coast
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-caption text-inv-subtle hover:text-inv transition-colors">
                Privacy
              </Link>
              <Link to="/participant-handbook" className="text-caption text-inv-subtle hover:text-inv transition-colors">
                Handbook
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
