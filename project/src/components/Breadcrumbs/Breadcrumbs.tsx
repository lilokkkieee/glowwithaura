import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-cream-300/70 mb-8" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-gold-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gold-400 font-medium">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="text-cream-400/40">/</span>}
        </span>
      ))}
    </nav>
  );
}
