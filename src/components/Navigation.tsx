import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavTheme } from '@/hooks/useNavTheme';

const navItems = [
  { label: 'Archive', href: '/archive' },
  { label: 'Books', href: '/order-books' },
  { label: 'Side Routes', href: '/#events' },
  { label: 'Support', href: '/support' },
] as const;

/**
 * Minimal fixed navigation — secondary to content.
 * Adapts text color based on background luminance.
 */
export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navTheme = useNavTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleHashLink = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const [path, hash] = href.split('#');
    const targetPath = path || '/';
    if (location.pathname === targetPath) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(targetPath);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location.pathname, navigate]);

  const isLight = navTheme === 'light';
  const textBase = isLight ? 'text-primary-foreground' : 'text-foreground';
  const textMuted = isLight ? 'text-primary-foreground/50' : 'text-muted-foreground';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-normal">
      <div className="flex items-center justify-between px-page py-5">
        {/* Wordmark */}
        <a href="/" className={`text-[0.6rem] uppercase tracking-[0.18em] leading-tight transition-colors duration-500 ${textBase}`}>
          <span className="block">Follow</span>
          <span className="block">The Coast</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={item.href.includes('#') ? (e) => handleHashLink(e, item.href) : undefined}
              className={`text-[0.625rem] font-display uppercase tracking-[0.1em] transition-colors duration-500 ${textMuted} hover:${textBase}`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/register"
            className={`text-[0.625rem] font-display uppercase tracking-[0.1em] transition-colors duration-500 ${textBase} border-b border-current pb-px`}
          >
            Register
          </a>
        </div>

        {/* Mobile toggle — minimal hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden transition-colors duration-500 ${textBase} flex flex-col gap-1.5`}
          aria-label="Toggle menu"
          type="button"
        >
          <motion.span
            className="block w-5 h-px bg-current origin-center"
            animate={isOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-5 h-px bg-current"
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-px bg-current origin-center"
            animate={isOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="md:hidden fixed inset-0 bg-foreground z-40 flex flex-col justify-center px-page"
          >
            <div className="flex flex-col gap-10">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  onClick={item.href.includes('#') ? (e) => handleHashLink(e, item.href) : () => setIsOpen(false)}
                  className="font-display text-2xl text-primary-foreground uppercase tracking-wider"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="/register"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => setIsOpen(false)}
                className="font-display text-2xl text-primary-foreground uppercase tracking-wider"
              >
                Register
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
