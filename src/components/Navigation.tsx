import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import wavesLogo from '@/assets/waves-logo.png';

const navItems = [
  { label: 'Stages', href: '#stages' },
  { label: 'Books', href: '#books' },
  { label: 'Side routes', href: '#events' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Scroll progress bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-left"
        style={{ scaleX }}
      />
      <div className="flex items-center justify-between px-6 md:px-12 py-6">
        <a href="#" className="flex items-center gap-3">
          <img src={wavesLogo} alt="" className="h-8 w-auto" />
          <span className="font-display text-[10px] font-medium text-[#F4F2EE] uppercase tracking-wider leading-tight">
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
              className="relative text-sm text-[#F4F2EE]/80 hover:text-[#F4F2EE] transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#F4F2EE] after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#stages"
            className="text-sm font-medium text-[#F4F2EE] border border-[#F4F2EE]/30 px-4 py-2 hover:bg-[#F4F2EE] hover:text-[#2B2E31] transition-all"
          >
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#F4F2EE]"
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
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-display text-white"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="#stages"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setIsOpen(false)}
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