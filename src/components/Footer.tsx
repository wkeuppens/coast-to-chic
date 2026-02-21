import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  stages: [
    { label: 'EU Stages', href: '/eu-stages' },
    { label: 'Home Run', href: '/homerun' },
    { label: 'Archive', href: '/archive' },
    { label: 'Shoreholders', href: '/shoreholders' },
    { label: 'Timeline', href: '/timeline' },
  ],
  books: [
    { label: 'Order Books', href: '/order-books' },
    
    { label: 'Prints', href: '/prints' },
  ],
  sideRoutes: [
    { label: 'Home Run', href: '/homerun' },
    { label: 'Follow The Kust', href: '/follow-the-kust' },
    { label: 'Tour du Mont Blanc', href: '/tour-du-mont-blanc' },
  ],
  contact: [
    { label: 'Instagram', href: 'https://www.instagram.com/followthecoast_' },
    { label: 'Contact', href: 'mailto:hello@followthecoast.com' },
    { label: 'Support the Project', href: '/support' },
  ],
};

export const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="bg-foreground text-primary-foreground">
      <div className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Top section */}
          <div className="grid md:grid-cols-5 gap-12 md:gap-8 mb-16">
            {/* Brand */}
            <motion.div 
              className="md:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="font-display text-xl font-bold uppercase">
                <span className="block">Follow</span>
                <span className="block">The Coast</span>
              </Link>
            </motion.div>

            {/* Links */}
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([key, links], columnIndex) => (
                <FooterColumn 
                  key={key} 
                  title={key.charAt(0).toUpperCase() + key.slice(1)} 
                  links={links}
                  delay={0.1 * (columnIndex + 1)}
                  isInView={isInView}
                />
              ))}
            </div>
          </div>

          {/* Bottom section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <p className="text-sm text-white/40">
              © 2026 FOLLOW THE COAST
            </p>
            <div className="flex gap-6 text-sm text-white/40">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/participant-handbook" className="hover:text-white transition-colors">
                Participant Handbook
              </Link>
            </div>
          </motion.div>

          {/* Contact email */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <a 
              href="mailto:hello@followthecoast.com" 
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              hello@followthecoast.com
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ 
  title, 
  links,
  delay,
  isInView
}: { 
  title: string; 
  links: { label: string; href: string }[];
  delay: number;
  isInView: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay }}
  >
    <p className="text-sm text-white/40 mb-4">{title}</p>
    <ul className="space-y-3">
      {links.map((link) => {
        const isExternal = link.href.startsWith('http') || link.href.startsWith('mailto:');
        return (
          <li key={link.label}>
            {isExternal ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  </motion.div>
);
