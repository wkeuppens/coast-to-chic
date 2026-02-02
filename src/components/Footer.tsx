import { motion } from 'framer-motion';

const footerLinks = {
  journey: [
    { label: 'The Story', href: '#' },
    { label: 'All Stages', href: '#' },
    { label: 'Join a Team', href: '#' },
    { label: 'Watch Film', href: '#' },
  ],
  books: [
    { label: 'Volume I', href: '#' },
    { label: 'Volume II', href: '#' },
    { label: 'Kickstarter', href: '#' },
  ],
  causes: [
    { label: 'Physical', href: '#' },
    { label: 'Mental', href: '#' },
    { label: 'Ocean', href: '#' },
    { label: 'Donate', href: '#' },
  ],
  connect: [
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'Strava', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Top section */}
        <div className="grid md:grid-cols-5 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="font-display text-xl font-medium">
              Follow<br />the Coast
            </a>
          </div>

          {/* Links */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <FooterColumn title="Journey" links={footerLinks.journey} />
            <FooterColumn title="Books" links={footerLinks.books} />
            <FooterColumn title="Causes" links={footerLinks.causes} />
            <FooterColumn title="Connect" links={footerLinks.connect} />
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-sm text-white/40">
            © 2025 Follow the Coast. Running the European coastline, together.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ 
  title, 
  links 
}: { 
  title: string; 
  links: { label: string; href: string }[] 
}) => (
  <div>
    <p className="text-sm text-white/40 mb-4">{title}</p>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <a 
            href={link.href}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);