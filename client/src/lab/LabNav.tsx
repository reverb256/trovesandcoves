/**
 * Floating navigation indicator for the Lab page.
 * Shows current section and allows jumping between sections.
 */
import { useState } from 'react';

interface Section {
  id: string;
  label: string;
  icon: string;
}

interface LabNavProps {
  sections: readonly Section[];
  activeSection: string;
  onNavigate: (id: string) => void;
}

export default function LabNav({
  sections,
  activeSection,
  onNavigate,
}: LabNavProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      onNavigate(id);
    }
  };

  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Lab section navigation"
    >
      {sections.map(section => {
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            className="flex items-center gap-2 group transition-all duration-300"
            aria-label={`Navigate to ${section.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {/* Label — appears on hover */}
            <span
              className="text-[10px] tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-300"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: isActive
                  ? 'hsl(var(--accent-vibrant))'
                  : 'hsl(var(--text-secondary) / 0.4)',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0)' : 'translateX(8px)',
              }}
            >
              {section.label}
            </span>

            {/* Dot indicator */}
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: isActive ? 28 : 8,
                height: 8,
                backgroundColor: isActive
                  ? 'hsl(var(--accent-vibrant))'
                  : 'hsl(var(--text-secondary) / 0.2)',
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
