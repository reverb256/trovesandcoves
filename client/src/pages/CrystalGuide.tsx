import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import SEOHead from '@/components/SEOHead';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { WebsiteSchema, OrganizationSchema, LocalBusinessSchema, FAQSchema, ArticleSchema } from '@/components/SchemaOrg';
import { Shield, Sparkles, Heart, Zap, Eye, Moon, Feather, ArrowRight } from 'lucide-react';

const crystals = [
  {
    name: 'Amethyst',
    color: 'Purple to violet',
    chakra: 'Crown (7th) & Third Eye (6th)',
    properties: ['Calming', 'Intuition', 'Spiritual awareness'],
    description: 'Amethyst is a powerful and protective stone with a high vibration. It guards against negative energy, clears the mind, and helps achieve a state of stillness and insight.',
    benefits: 'Enhances meditation, promotes restful sleep, and helps with decision-making.',
    icon: Zap,
  },
  {
    name: 'Citrine',
    color: 'Yellow to golden',
    chakra: 'Solar Plexus (3rd)',
    properties: ['Abundance', 'Joy', 'Energy'],
    description: 'Citrine is known as the merchant stone for its ability to attract prosperity and abundance. It carries the energy of the sun, bringing warmth, joy, and positivity.',
    benefits: 'Boosts confidence, enhances creativity, and dissipates negative energy.',
    icon: Sparkles,
  },
  {
    name: 'Obsidian',
    color: 'Deep black',
    chakra: 'Root (1st)',
    properties: ['Protection', 'Grounding', 'Truth'],
    description: 'Black obsidian is a protective stone that forms a shield against negativity. It grounds you to Earth energy and helps uncover hidden truths.',
    benefits: 'Provides emotional support during difficult transitions, releases blocked energy.',
    icon: Shield,
  },
  {
    name: 'Lepidolite',
    color: 'Lilac to purple',
    chakra: 'Third Eye (6th) & Crown (7th)',
    properties: ['Tranquility', 'Stress relief', 'Balance'],
    description: 'Lepidolite contains natural lithium, known for its calming properties. It brings emotional balance during stressful times and promotes peaceful sleep.',
    benefits: 'Reduces anxiety, encourages self-love, and helps with mood swings.',
    icon: Moon,
  },
  {
    name: 'Lapis Lazuli',
    color: 'Deep blue with gold flecks',
    chakra: 'Throat (5th) & Third Eye (6th)',
    properties: ['Wisdom', 'Truth', 'Communication'],
    description: 'Lapis lazuli has been valued for millennia for its deep blue color and spiritual properties. It enhances intellectual ability and stimulates wisdom.',
    benefits: 'Enhances honest communication, encourages self-awareness, and expresses creativity.',
    icon: Eye,
  },
  {
    name: 'Rose Quartz',
    color: 'Soft pink',
    chakra: 'Heart (4th)',
    properties: ['Love', 'Compassion', 'Healing'],
    description: 'Rose quartz is the stone of unconditional love and infinite peace. It attracts love of all kinds and restores trust and harmony in relationships.',
    benefits: 'Promotes self-love, heals emotional wounds, and fosters empathy.',
    icon: Heart,
  },
  {
    name: 'Clear Quartz',
    color: 'Transparent to white',
    chakra: 'All chakras',
    properties: ['Amplification', 'Clarity', 'Energy'],
    description: 'Clear quartz is the most versatile healing stone. It amplifies energy and thought, as well as the effect of other crystals.',
    benefits: 'Enhances mental clarity, balances all chakras, and amplifies intentions.',
    icon: Sparkles,
  },
  {
    name: 'Smoky Quartz',
    color: 'Brown to black',
    chakra: 'Root (1st)',
    properties: ['Grounding', 'Protection', 'Transformation'],
    description: 'Smoky quartz grounds and centers energy while providing protective barriers. It helps transform negative energy into positive.',
    benefits: 'Dissolves fear and depression, brings emotional calmness, and relieves stress.',
    icon: Feather,
  },
];

const crystalQuestions = [
  {
    '@type': 'Question',
    name: 'What are the healing properties of crystals?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Crystals are believed to carry vibrational energy that can interact with the body energy field. Each crystal has unique properties: amethyst promotes calmness and intuition, citrine attracts abundance, rose quartz fosters love and compassion, obsidian provides protection, and clear quartz amplifies energy.',
    },
  },
  {
    '@type': 'Question',
    name: 'How do I choose the right crystal for me?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Choose crystals based on what you are drawn to visually or what you feel you need in your life. Trust your intuition—if a crystal catches your eye, it may have energy you need. You can also choose based on specific properties: amethyst for stress relief, citrine for abundance, rose quartz for love matters, or obsidian for protection.',
    },
  },
  {
    '@type': 'Question',
    name: 'How do I cleanse and charge my crystals?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Crystals can be cleansed by running them under cool water, placing them in moonlight overnight, or using sage smoke. To charge your crystals, place them in sunlight briefly, bury them in earth overnight, or place them on a selenite charging plate. Set your intention while charging to program the crystal with your desired outcome.',
    },
  },
];

const pageDate = '2024-03-15';

export default function CrystalGuide() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Crystal Properties Guide', path: '/crystal-guide' },
        ]}
      />
      <SEOHead
        path="/crystal-guide"
        title="Crystal Properties Guide | Meanings & Healing Benefits"
        description="Discover the healing properties and meanings of authentic crystals. Learn about amethyst, citrine, obsidian, lepidolite, lapis lazuli, rose quartz, and smoky quartz used in our handcrafted jewelry."
      />
      <WebsiteSchema />
      <OrganizationSchema />
      <LocalBusinessSchema />
      <FAQSchema questions={crystalQuestions} />
      <ArticleSchema
        title="Crystal Properties Guide: Meanings & Healing Benefits"
        description="Comprehensive guide to crystal meanings and healing properties. Learn about amethyst, citrine, obsidian, lepidolite, lapis lazuli, rose quartz, smoky quartz."
        datePublished={pageDate}
        dateModified={pageDate}
        authorName="Troves & Coves"
      />

      <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
        {/* Header */}
        <section className="py-24">
          <div className="chamber-container text-center max-w-4xl">
            <div className="mb-6">
              <Sparkles className="w-16 h-16 mx-auto" style={{ color: 'hsl(var(--gold-medium))' }} />
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{
                fontFamily: '"Libre Baskerville", serif',
                color: 'hsl(var(--text-primary))',
              }}
            >
              Crystal Properties Guide
            </h1>
            <div
              className="w-16 h-0.5 mx-auto mb-6"
              style={{ backgroundColor: 'hsl(var(--gold-medium))' }}
            />
            <p
              className="text-lg leading-relaxed mb-4"
              style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
            >
              Discover the ancient wisdom and healing properties of authentic crystals.
              Each stone carries unique energy to support your journey.
            </p>
            <p
              className="text-sm"
              style={{ color: 'hsl(var(--text-muted))', fontFamily: '"Montserrat", sans-serif' }}
            >
              Last updated: {new Date(pageDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        <div className="chamber-container pb-20">
          {/* Introduction */}
          <section className="max-w-4xl mx-auto mb-20">
            <div
              className="p-8 rounded-2xl mb-12"
              style={{
                backgroundColor: 'hsl(var(--bg-card))',
                border: '1px solid hsla(var(--accent-vibrant), 0.1)',
              }}
            >
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
              >
                Understanding Crystal Energy
              </h2>
              <p
                className="mb-4"
                style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
              >
                For thousands of years, crystals have been used for their healing properties and spiritual significance. Each crystal
                carries a unique vibrational frequency that can interact with your body energy field, known as the aura or subtle
                body.
              </p>
              <p
                className="mb-4"
                style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
              >
                The crystals we use in our handcrafted jewelry are authentic gemstones, ethically sourced and selected for their
                beauty and energy. When you wear crystal jewelry, you carry the stone properties with you throughout the day.
              </p>
              <p
                style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem', fontFamily: '"Montserrat", sans-serif' }}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Note: Crystal healing is complementary and should not replace professional medical advice or treatment.
              </p>
            </div>
          </section>

          {/* Crystals Grid */}
          <section className="mb-20">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-center"
              style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
            >
              Our Crystal Collection
            </h2>
            <p
              className="text-center mb-12"
              style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
            >
              Explore the unique properties of each stone
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {crystals.map((crystal) => {
                const Icon = crystal.icon;
                return (
                  <div
                    key={crystal.name}
                    className="p-8 rounded-2xl transition-all duration-300 hover:shadow-lg"
                    style={{
                      backgroundColor: 'hsl(var(--bg-card))',
                      border: '1px solid hsla(var(--accent-vibrant), 0.1)',
                    }}
                  >
                    {/* Icon */}
                    <div className="mb-6">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'hsla(var(--accent-vibrant), 0.1)' }}
                      >
                        <Icon className="w-6 h-6" style={{ color: 'hsl(var(--accent-vibrant))' }} />
                      </div>
                    </div>

                    <h3
                      className="text-2xl font-semibold mb-2"
                      style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
                    >
                      {crystal.name}
                    </h3>

                    <p
                      className="text-sm mb-3"
                      style={{ color: 'hsl(var(--accent-vibrant))', fontFamily: '"Montserrat", sans-serif' }}
                    >
                      {crystal.color}
                    </p>

                    <p
                      className="text-sm mb-4"
                      style={{ color: 'hsl(var(--text-muted))', fontFamily: '"Montserrat", sans-serif' }}
                    >
                      Chakra: {crystal.chakra}
                    </p>

                    <p
                      className="mb-4"
                      style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
                    >
                      {crystal.description}
                    </p>

                    <div className="mb-4">
                      <p
                        className="text-xs font-semibold mb-2"
                        style={{ color: 'hsl(var(--text-primary))', fontFamily: '"Montserrat", sans-serif' }}
                      >
                        Properties:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {crystal.properties.map((prop) => (
                          <span
                            key={prop}
                            className="px-3 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: 'hsla(var(--accent-vibrant), 0.1)',
                              color: 'hsl(var(--accent-vibrant))',
                            }}
                          >
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p
                      className="text-sm italic"
                      style={{ color: 'hsl(var(--text-muted))', fontFamily: '"Montserrat", sans-serif' }}
                    >
                      {crystal.benefits}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How to Use Crystals */}
          <section className="max-w-4xl mx-auto mb-20">
            <h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center"
              style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
            >
              How to Use Your Crystal Jewelry
            </h2>
            <div
              className="p-8 rounded-2xl"
              style={{ backgroundColor: 'hsl(var(--bg-card))' }}
            >
              <ol className="space-y-6">
                <li
                  className="flex gap-4"
                  style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: 'hsl(var(--gold-medium))', color: 'hsl(var(--bg-primary))' }}
                  >
                    1
                  </span>
                  <p><strong>Set Your Intention</strong> — Hold your crystal jewelry and focus on what you want to invite into your life (peace, abundance, love, protection).</p>
                </li>
                <li
                  className="flex gap-4"
                  style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: 'hsl(var(--gold-medium))', color: 'hsl(var(--bg-primary))' }}
                  >
                    2
                  </span>
                  <p><strong>Wear Regularly</strong> — Consistent wear allows the crystal energy to interact with your aura throughout the day.</p>
                </li>
                <li
                  className="flex gap-4"
                  style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: 'hsl(var(--gold-medium))', color: 'hsl(var(--bg-primary))' }}
                  >
                    3
                  </span>
                  <p><strong>Cleanse Periodically</strong> — Rinse under cool water or place in moonlight overnight to reset the crystal energy.</p>
                </li>
                <li
                  className="flex gap-4"
                  style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: 'hsl(var(--gold-medium))', color: 'hsl(var(--bg-primary))' }}
                  >
                    4
                  </span>
                  <p><strong>Charge Under Moonlight</strong> — Place your jewelry in moonlight overnight to enhance its natural properties.</p>
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <p
              className="mb-6"
              style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
            >
              Find the perfect crystal piece that speaks to you
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'hsl(var(--text-primary))',
                color: 'hsl(var(--bg-primary))',
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              Shop Crystal Jewelry
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
