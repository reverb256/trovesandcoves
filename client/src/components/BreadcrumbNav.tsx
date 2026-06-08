import { useLocation, Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeMap: Record<string, BreadcrumbItem[]> = {
  '/products': [
    { label: 'Shop', href: '/products' },
  ],
  '/about': [
    { label: 'About', href: '/about' },
  ],
  '/contact': [
    { label: 'Contact', href: '/contact' },
  ],
};

export function BreadcrumbNav() {
  const [location] = useLocation();

  // Skip breadcrumb on homepage
  if (location === '/') return null;

  // Look up known routes; fall back to derived name
  const crumbs = routeMap[location] || generateCrumbs(location);

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 max-w-7xl mx-auto">
      <ol className="flex items-center gap-1.5 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <li>
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity"
            style={{ color: 'hsl(var(--text-secondary))' }}
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'hsl(var(--text-muted))' }} />
            {i === crumbs.length - 1 ? (
              <span
                aria-current="page"
                style={{ color: 'hsl(var(--accent-vibrant))', fontWeight: 500 }}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:opacity-80 transition-opacity"
                style={{ color: 'hsl(var(--text-secondary))' }}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function generateCrumbs(path: string): BreadcrumbItem[] {
  // For any route not in routeMap, derive breadcrumb from path segments
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const crumbs: BreadcrumbItem[] = [];
  let accum = '';
  for (const seg of segments) {
    accum += '/' + seg;
    crumbs.push({
      label: seg.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      href: accum,
    });
  }
  return crumbs;
}
