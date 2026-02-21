import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useEffect } from 'react';
import { SEO } from '@/components/SEO';

const introSections = [
  {
    content: [
      'We respect your privacy.',
      'When you visit this website or contact us, we may collect basic personal information such as your name, email address, or technical data related to your visit. We use this information only to operate the website, respond to your requests, and improve our services.',
      'We do not sell your data.\nWe only share information when necessary to provide a service or when required by law.',
      'You remain in control of your personal data at all times and may request access, correction, or deletion whenever you wish.',
      'For full details, please read the Privacy Policy below.',
    ],
  },
];

const policySections = [
  {
    number: '1',
    title: 'Collection of Personal Data',
    content: [
      'Cercatrova BV acts as the data controller for the personal data collected through this Website.',
      'We will always inform you when personal information is collected.',
      'The personal data we may collect includes, but is not limited to:',
    ],
    list: ['Name', 'Email address', 'Telephone number', 'Other similar contact information'],
    after: ['We may also automatically collect technical and analytical information such as:'],
    list2: ['IP address', 'Pages visited', 'Date and time of visits', 'Device or browser information', 'Website interaction data'],
    after2: ['Personal data may be collected in the following situations:'],
    list3: [
      'When you visit our Website',
      'When you subscribe to the Follow the Coast newsletter',
      'When you contact Follow the Coast or Cercatrova BV',
      'When you use services or functionalities offered through the Website',
    ],
  },
  {
    number: '2',
    title: 'Use of Personal Data',
    content: ['We process personal data for the following purposes:'],
    list: [
      'Processing orders, requests, or inquiries',
      'Sending newsletters or marketing communications',
      'Responding to questions or communications',
      'Improving our Website and services through statistical and analytical processing',
    ],
    after: [
      'In certain cases, personal data is necessary to perform a transaction between you and us, for example when making a purchase or requesting information.',
      'If we use your personal data to send newsletters, product information, or other marketing communications, this will only take place with your explicit consent, unless applicable legislation allows otherwise.',
      'We also maintain anonymised statistical information regarding visits to our Website.\nThis helps us improve functionality and better understand visitor interests.',
    ],
  },
  {
    number: '3',
    title: 'Disclosure of Personal Data',
    content: [
      'Cercatrova BV may share personal data with service providers where necessary to deliver requested services or purchased goods, such as courier or delivery companies.',
      'In certain circumstances and in accordance with applicable law, we may be required to disclose personal data to public authorities.',
      'We may also share information with third parties when necessary to establish, exercise, or defend legal claims.',
      'Personal data will not be shared with third parties without your consent except as described above.',
    ],
  },
  {
    number: '4',
    title: 'Data Retention',
    content: [
      'Personal data will be retained only for as long as necessary to fulfil the purposes described in this Privacy Policy.',
      'Data may be retained longer:',
    ],
    list: [
      'where required by law, or',
      'in anonymised form for statistical or analytical purposes.',
    ],
  },
  {
    number: '5',
    title: 'Cookies',
    content: [
      'This Website uses cookies.',
      'Cookies are small text files stored on your device that allow the Website to function properly and help us understand how visitors interact with it.',
      'Cookies are used for the following purposes:',
    ],
    list: [
      'Ensuring proper Website functionality',
      'Improving user experience',
      'Understanding visitor interests',
      'Statistical and analytical processing',
    ],
    after: [
      'You may manage or disable cookies through your browser settings.\nDisabling certain cookies may affect the functioning of the Website.',
    ],
  },
  {
    number: '6',
    title: 'Security',
    content: [
      'We have implemented appropriate technical and organisational security measures to ensure that our internal processes comply with high security standards.',
      'We make every reasonable effort to protect the quality, confidentiality, and integrity of your personal data.',
    ],
  },
  {
    number: '7',
    title: 'Your Rights',
    content: ['Under applicable data protection legislation, you have the right to:'],
    list: [
      'access the personal data we process about you (subject to legal exceptions)',
      'request restriction of processing',
      'request correction of inaccurate personal data',
      'request deletion of your personal data',
      'object to processing of your personal data for marketing purposes at any time',
    ],
  },
  {
    number: '8',
    title: 'Withdrawal of Consent',
    content: [
      'You may withdraw your consent at any time.',
      'To withdraw consent, please contact us at:',
      'hello@followthecoast.com',
      'For newsletters or electronic marketing communications, you may also use the unsubscribe link included in our emails.',
      'Withdrawal of consent does not affect the lawfulness of processing carried out before withdrawal.',
    ],
  },
  {
    number: '9',
    title: 'Access, Correction, or Deletion of Personal Data',
    content: [
      'If you wish to access, update, correct, or delete personal data we hold about you, or if you have questions regarding this Privacy Policy, you may contact us at:',
      'hello@followthecoast.com',
      'You may also contact us in writing at:',
      'Cercatrova BV\nKammenstraat 68\n2000 Antwerp\nBelgium',
    ],
  },
  {
    number: '10',
    title: 'Complaints',
    content: [
      'If you have concerns regarding the processing of your personal data, you may contact us using the details above.',
      'You also have the right to lodge a complaint with the Belgian Data Protection Authority (Gegevensbeschermingsautoriteit):',
    ],
    after: [],
    link: { label: 'gegevensbeschermingsautoriteit.be', href: 'https://www.gegevensbeschermingsautoriteit.be' },
  },
];

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="mt-4 space-y-2 pl-1">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-sm md:text-base text-foreground">
        <span className="text-[#5E7687] mt-1.5 text-[6px]">●</span>
        {item}
      </li>
    ))}
  </ul>
);

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Privacy Policy" description="Privacy policy for Follow the Coast. How we handle your data." path="/privacy" />
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4"
          >
            Privacy
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight"
          >
            Privacy at Follow the Coast
          </motion.h1>
        </div>
      </section>

      {/* Intro */}
      <section className="pb-16 md:pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          {introSections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {section.content.map((para, i) => (
                <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {para}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Policy title */}
      <section className="pb-8 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-xl md:text-2xl font-bold uppercase tracking-wide">
              Privacy Policy
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-4">
              This website is owned and operated by Cercatrova BV, registered under company number BE 0544 887 107, with registered office at Kammenstraat 68, 2000 Antwerp, Belgium ("Cercatrova", "we", "us", or "our").
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-4">
              This Privacy Policy explains how Cercatrova processes your personal data when you visit followthecoast.com (the "Website") or use our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy sections */}
      <section className="pb-24 md:pb-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto space-y-20">
          {policySections.map((section) => (
            <motion.div
              key={section.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              {/* Section number & title */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-xs text-muted-foreground font-mono tabular-nums">
                  {section.number.padStart(2, '0')}
                </span>
                <h2 className="font-display text-lg md:text-xl font-bold uppercase tracking-wide">
                  {section.title}
                </h2>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border mb-8" />

              {/* Content paragraphs */}
              <div className="space-y-4">
                {section.content.map((para, i) => (
                  <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>

              {/* Bullet list */}
              {section.list && <BulletList items={section.list} />}

              {/* After-list paragraphs */}
              {section.after && section.after.length > 0 && (
                <div className="mt-6 space-y-4">
                  {section.after.map((para, i) => (
                    <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Additional lists for section 1 */}
              {'list2' in section && section.list2 && <BulletList items={section.list2} />}
              {'after2' in section && section.after2 && (
                <div className="mt-6 space-y-4">
                  {(section.after2 as string[]).map((para, i) => (
                    <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              )}
              {'list3' in section && section.list3 && <BulletList items={section.list3} />}

              {/* External link */}
              {'link' in section && section.link && (
                <div className="mt-4">
                  <a
                    href={section.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base text-[#5E7687] hover:underline transition-colors"
                  >
                    {section.link.label}
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
