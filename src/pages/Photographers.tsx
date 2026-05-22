import { motion } from 'framer-motion';
import { Instagram, Globe } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useSanityFetch } from '@/hooks/useSanityData';
import { sanityClient, urlFor } from '@/lib/sanityClient';

interface Photographer {
  id: string
  name: string
  bio: string | null
  portraitUrl: string | null
  website: string | null
  instagramHandle: string | null
}

function usePhotographers() {
  return useSanityFetch<Photographer[]>(async () => {
    if (!sanityClient) return []
    const raw = await sanityClient.fetch(`
      *[_type == "photographer"] | order(name asc) {
        _id, name, bio, portrait, website, instagramHandle
      }
    `)
    return raw.map((r: Record<string, unknown>) => ({
      id: r._id as string,
      name: r.name as string,
      bio: (r.bio as string | null) ?? null,
      portraitUrl: r.portrait ? urlFor(r.portrait as Parameters<typeof urlFor>[0]).width(600).url() : null,
      website: (r.website as string | null) ?? null,
      instagramHandle: (r.instagramHandle as string | null) ?? null,
    }))
  })
}

const Photographers = () => {
  const { data: photographers, loading } = usePhotographers()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Photographers" description="The photographers documenting Follow the Coast. Every kilometre, every stage." path="/photographers" />
      <Navigation />

      <section className="pt-32 pb-16 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-caption text-muted-foreground mb-4">The Team</p>
          <h1 className="text-4xl md:text-6xl mt-2 mb-6">Photographers</h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            The photographers documenting every kilometre of Follow The Coast. Each contributing a unique perspective to the project.
          </p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-sm text-muted-foreground py-8">Loading…</div>
        ) : !photographers?.length ? (
          <div className="text-sm text-muted-foreground py-8">Photographer profiles coming soon.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {photographers.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <div className="aspect-[3/4] overflow-hidden bg-secondary mb-5">
                  {p.portraitUrl ? (
                    <img src={p.portraitUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
                <h3 className="text-lg">{p.name}</h3>
                {p.bio && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.bio}</p>}
                <div className="flex items-center gap-4 mt-4">
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`${p.name} website`}>
                      <Globe size={16} />
                    </a>
                  )}
                  {p.instagramHandle && (
                    <a href={`https://instagram.com/${p.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`${p.name} Instagram`}>
                      <Instagram size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default Photographers
