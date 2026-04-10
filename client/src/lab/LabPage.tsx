/**
 * Crystal Typography Lab — Main Page
 *
 * A scroll-through experience showcasing Pretext text layout capabilities
 * through crystal/gemstone-themed interactive experiments.
 */
import { useRef, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import RefractedLight from './components/refracted-light/RefractedLight';
import NaturalFacets from './components/natural-facets/NaturalFacets';
import StoryFlows from './components/story-flows/StoryFlows';
import TheWorkbench from './components/workbench/TheWorkbench';
import CrystalKinetics from './components/crystal-kinetics/CrystalKinetics';
import GemcutVariations from './components/gemcut-variations/GemcutVariations';
import LabNav from './LabNav';

const SECTIONS = [
  { id: 'refracted-light', label: 'Refracted Light', icon: '✦' },
  { id: 'natural-facets', label: 'Natural Facets', icon: '◆' },
  { id: 'story-flows', label: 'Story Flows', icon: '※' },
  { id: 'the-workbench', label: 'The Workbench', icon: '⚙' },
  { id: 'crystal-kinetics', label: 'Crystal Kinetics', icon: '◇' },
  { id: 'gemcut-variations', label: 'Gemcut Variations', icon: '⬡' },
] as const;

export default function LabPage() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const introRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <SEOHead path="/lab" />
      <div
        className="min-h-screen"
        style={{ background: 'hsl(var(--bg-primary))' }}
      >
        {/* Lab Nav — floating right side */}
        <LabNav
          sections={SECTIONS}
          activeSection={activeSection}
          onNavigate={setActiveSection}
        />

        {/* Intro Banner */}
        <div
          ref={introRef}
          className="relative flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
          style={{ minHeight: '40vh' }}
        >
          {/* Background crystal pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                60deg,
                hsl(var(--accent-vibrant)) 0px,
                hsl(var(--accent-vibrant)) 1px,
                transparent 1px,
                transparent 40px
              )`,
            }}
          />

          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-[0.2em] uppercase mb-8"
              style={{
                backgroundColor: 'hsl(var(--accent-vibrant) / 0.08)',
                color: 'hsl(var(--accent-vibrant))',
                border: '1px solid hsl(var(--accent-vibrant) / 0.15)',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              <span>Experimental</span>
              <span style={{ color: 'hsl(var(--gold-medium))' }}>|</span>
              <span>Typography Lab</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 flex flex-col items-center gap-2">
              <span
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  color: 'hsl(var(--accent-vibrant))',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Crystal
              </span>
              <span
                style={{
                  fontFamily: "'Alex Brush', cursive",
                  color: 'hsl(var(--gold-medium))',
                }}
                className="text-6xl md:text-8xl"
              >
                Typography
              </span>
            </h1>

            <p
              className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-4"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: 'hsl(var(--text-secondary))',
              }}
            >
              Exploring the intersection of pixel-perfect text layout and
              crystal aesthetics. Built with Pretext — a groundbreaking library
              that computes text geometry without the DOM.
            </p>

            <p
              className="text-sm tracking-[0.15em] uppercase"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: 'hsl(var(--text-secondary) / 0.5)',
              }}
            >
              Scroll to explore six experiments
            </p>

            <div className="mt-12 animate-bounce">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ color: 'hsl(var(--accent-vibrant) / 0.5)' }}
              >
                <path d="M10 14l-5-5h10l-5 5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div
          className="w-full h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(var(--gold-medium)), transparent)',
          }}
        />

        {/* Section 1: Refracted Light */}
        <RefractedLight onVisible={() => setActiveSection('refracted-light')} />

        {/* Section Divider */}
        <SectionDivider />

        {/* Section 2: Natural Facets */}
        <NaturalFacets onVisible={() => setActiveSection('natural-facets')} />

        {/* Section Divider */}
        <SectionDivider />

        {/* Section 3: Story Flows */}
        <StoryFlows onVisible={() => setActiveSection('story-flows')} />

        {/* Section Divider */}
        <SectionDivider />

        {/* Section 4: The Workbench */}
        <TheWorkbench onVisible={() => setActiveSection('the-workbench')} />

        {/* Section Divider */}
        <SectionDivider />

        {/* Section 5: Crystal Kinetics */}
        <CrystalKinetics
          onVisible={() => setActiveSection('crystal-kinetics')}
        />

        {/* Section Divider */}
        <SectionDivider />

        {/* Section 6: Gemcut Variations */}
        <GemcutVariations
          onVisible={() => setActiveSection('gemcut-variations')}
        />

        {/* Footer */}
        <div
          className="text-center py-16"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: 'hsl(var(--text-secondary) / 0.4)',
          }}
        >
          <p className="text-xs tracking-[0.2em] uppercase">
            Powered by Pretext — Pixel-perfect text without the DOM
          </p>
        </div>
      </div>
    </>
  );
}

function SectionDivider() {
  return (
    <div
      className="w-full h-px mx-auto"
      style={{
        maxWidth: '200px',
        background:
          'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant) / 0.2), transparent)',
      }}
    />
  );
}
