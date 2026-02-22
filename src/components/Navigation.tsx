import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import wavesLogo from '@/assets/waves-logo.png';
import { useNavTheme } from '@/hooks/useNavTheme';

const navItems = [
  { label: 'Stages', href: '/#stages' },
  { label: 'Archive', href: '/archive' },
  { label: 'Books', href: '/#books' },
  { label: 'Prints', href: '/prints' },
  { label: 'Side routes', href: '/#events' },
] as const;

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
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
  const textMuted = isLight ? 'text-primary-foreground/80' : 'text-foreground/80';
  const borderColor = isLight ? 'border-primary-foreground/30' : 'border-foreground/30';
  const hoverBg = isLight
    ? 'hover:bg-primary-foreground hover:text-foreground'
    : 'hover:bg-foreground hover:text-primary-foreground';
  const underlineColor = isLight ? 'after:bg-primary-foreground' : 'after:bg-foreground';
  const logoFilter = isLight ? '' : 'brightness-0';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-left"
        style={{ scaleX }}
      />
      <div className="flex items-center justify-between px-6 md:px-12 py-6 transition-colors duration-300">
        <a href="/" className="flex items-center gap-3">
          <img
            src={wavesLogo}
            alt=""
            className={`h-8 w-auto transition-[filter] duration-300 ${logoFilter}`}
          />
          <span className={`font-display text-[10px] font-medium uppercase tracking-wider leading-tight transition-colors duration-300 ${textColor}`}>
            <span className="block">Follow</span>
            <span className="block">The</span>
            <span className="block">Coast</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={item.href.includes('#') ? (e) => handleHashLink(e, item.href) : undefined}
              className={`relative text-sm transition-colors duration-300 ${textMuted} hover:${isLight ? 'text-primary-foreground' : 'text-foreground'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 ${underlineColor} after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#stages"
            onClick={(e) => handleHashLink(e, '/#stages')}
            className={`text-sm font-medium transition-all duration-300 border px-5 py-2 rounded-full ${textColor} ${borderColor} ${hoverBg}`}
          >
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden transition-colors duration-300 ${textColor}`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 bg-black z-40 pt-24 px-6"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={item.href.includes('#') ? (e) => handleHashLink(e, item.href) : () => setIsOpen(false)}
                  className="text-3xl font-display text-white"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="/#stages"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => handleHashLink(e, '/#stages')}
                className="text-3xl font-display text-accent"
              >
                Register →
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
