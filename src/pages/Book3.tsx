import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { MagneticButton } from '@/components/MagneticButton';
import { EventCheckoutButton } from '@/components/EventCheckoutButton';
import coastalPath from '@/assets/coastal-path.jpg';
import bookMockup from '@/assets/book-mockup.jpg';
import bookVol2Cover from '@/assets/book-vol2-cover.jpg';
import cliffBay from '@/assets/cliff-bay.jpg';
import sailboatSea from '@/assets/sailboat-sea.jpg';

const Book3 = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Book 3 — Gibraltar to Monaco"
      description="Follow The Coast Chapter Three. From Gibraltar to Monaco along the Mediterranean coast. Publication event June 20, Antwerp."
      path="/book-3"
    />
    <Navigation />

    {/* Hero */}
    <section className="relative h-[75vh] overflow-hidden">
      <img src={coastalPath} alt="Mediterranean coastline" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 px-page pb-16 max-w-content mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-caption text-primary-foreground/60 mb-3">
            <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Chapter Three
          </p>
          <h1 className="text-5xl md:text-7xl text-primary-foreground tracking-tight leading-[0.9] mb-4">
            Gibraltar<br />to Monaco
          </h1>
          <p className="text-primary-foreground/70 text-sm max-w-sm">
            The Mediterranean arc. 4,000 km of coastline. 400 pages.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Intro */}
    <section className="px-page py-section max-w-content mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            With our Follow The Coast community, we've run the entire coastline from Belgium to
            Venice — covering over 17,000 kilometres. Along the way, we created two photo books
            now found in more than 4,000 homes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            The third chapter follows the Mediterranean from Gibraltar to Monaco — sweeping drone
            vistas, cultural photography, runner portraits, and a curated travel guide across one
            of the world's most celebrated coastlines.
          </p>
          <MagneticButton
            href="/order-books"
            className="inline-flex items-center justify-center bg-accent text-white rounded-full px-6 py-2.5 text-sm tracking-wide hover:opacity-80 transition-opacity"
          >
            Order the book — €65
          </MagneticButton>
        </motion.div>
        <div className="space-y-3">
          <img src={bookMockup} alt="Follow the Coast Book 3" className="w-full object-cover" />
        </div>
      </div>
    </section>

    {/* Publication event */}
    <section className="bg-secondary px-page py-section">
      <div className="max-w-content mx-auto">
        <hr className="rule mb-12" />
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-label mb-4"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Launch event</p>
            <h2 className="text-2xl md:text-3xl tracking-tight mb-6">
              Saturday 20 June<br />Brouwerij De Koninck, Antwerp
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Official publication of Book 3. Pick up your book, drinks courtesy of Duvel, a
              community run, presentation and Q&A. Join for part of the day or the whole evening.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-8">
              <p>14:00–17:00 — Book pick-up</p>
              <p>17:00–18:00 — Community run, 10 km</p>
              <p>18:00–19:00 — Open bar</p>
              <p>19:00–20:00 — Presentation & Q&A</p>
              <p>20:00–22:00 — Walking dinner & open bar</p>
              <p>22:00+ — Drinks in the city</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Mechelsesteenweg 291, 2018 Antwerpen
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-background border border-border p-6">
              <h3 className="text-base mb-1">Drinks & Presentation</h3>
              <p className="text-xs text-muted-foreground mb-4">18:00–22:00 · Open bar, presentation, Q&A</p>
              <p className="text-2xl text-accent mb-6">Free</p>
              <EventCheckoutButton
                eventId="book_launch_free"
                price={0}
                label="RSVP — Free"
              />
            </div>
            <div className="bg-background border-2 border-accent p-6">
              <h3 className="text-base mb-1">Walking Dinner & Everything</h3>
              <p className="text-xs text-muted-foreground mb-4">18:00–late · Full evening, food & open bar</p>
              <p className="text-2xl text-accent mb-6">€45</p>
              <EventCheckoutButton
                eventId="book_launch_dinner"
                price={45}
                label="Register — €45"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* The series */}
    <section className="px-page py-section max-w-content mx-auto">
      <hr className="rule mb-12" />
      <p className="text-label mb-10"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />The series</p>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { vol: 'Volume I', route: 'Knokke → San Sebastián', available: true },
          { vol: 'Volume II', route: 'San Sebastián → Gibraltar', available: true },
          { vol: 'Volume III', route: 'Gibraltar → Monaco', available: true },
        ].map(book => (
          <div key={book.vol} className="border-t border-border pt-6">
            <p className="text-caption text-accent mb-1">{book.vol}</p>
            <p className="text-sm text-muted-foreground mb-4">{book.route}</p>
            <Link to="/order-books" className="text-xs underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground transition-colors">
              Order — €65
            </Link>
          </div>
        ))}
      </div>
    </section>

    <Footer />
  </div>
);

export default Book3;
