import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavTheme } from '@/hooks/useNavTheme';

const navItems = [
  { label: 'Coastal Archive', href: '/archive' },
  { label: 'Books', href: '/order-books' },
  { label: 'Prints', href: '/prints' },
  { label: 'Side routes', href: '/#events' },
  { label: 'Support', href: '/support' },
] as const;

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
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(targetPath);
      setTimeout(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location.pathname, navigate]);

  const isLight = navTheme === 'light';
  const textColor = isLight ? 'text-primary-foreground' : 'text-foreground';
  const textMuted = isLight ? 'text-primary-foreground/70' : 'text-muted-foreground';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-5 transition-colors duration-300">
        {/* Logo — clean text mark like the book */}
        <a href="/" className="flex items-center gap-2">
          <span className={`font-display text-[10px] font-medium uppercase tracking-[0.15em] leading-tight transition-colors duration-300 ${textColor}`}>
            <span className="block">Follow</span>
            <span className="block">The Coast</span>
          </span>
        </a>

        {/* Desktop nav — minimal text links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={item.href.includes('#') ? (e) => handleHashLink(e, item.href) : undefined}
              className={`text-xs font-display uppercase tracking-[0.08em] transition-colors duration-300 ${textMuted} hover:${isLight ? 'text-primary-foreground' : 'text-foreground'}`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/register"
            className={`text-xs font-display uppercase tracking-[0.08em] transition-colors duration-300 ${textColor} border-b border-current pb-0.5`}
          >
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden transition-colors duration-300 ${textColor}`}
          aria-label="Toggle menu"
          type="button"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu — full screen, black, editorial */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-foreground z-40 pt-24 px-8"
          >
            <div className="flex flex-col gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={item.href.includes('#') ? (e) => handleHashLink(e, item.href) : () => setIsOpen(false)}
                  className="text-2xl font-display text-primary-foreground uppercase tracking-wide"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="/register"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-display text-primary-foreground uppercase tracking-wide border-b border-primary-foreground/30 pb-1 inline-block self-start"
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
