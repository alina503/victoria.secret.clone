import type { NavigationItem, BrandNavigationItem } from '../types';
import { ROUTES } from './routes';

export const BRAND_NAV: BrandNavigationItem[] = [
  { key: 'vs', label: "VICTORIA'S SECRET", href: ROUTES.home },
  { key: 'pink', label: 'PINK', href: ROUTES.pink },
  { key: 'beauty', label: 'BEAUTY', href: ROUTES.beauty },
];

export const CATEGORY_NAV: NavigationItem[] = [
  { key: 'nou', label: 'NOU', href: ROUTES.nou },
  { key: 'sutiene', label: 'SUTIENE', href: ROUTES.sutiene },
  { key: 'chiloti', label: 'CHILOȚI', href: ROUTES.chiloti },
  { key: 'lenjerie', label: 'LENJERIE', href: ROUTES.lenjerie },
  { key: 'pijama', label: 'PIJAMA', href: ROUTES.pijama },
  { key: 'haine-sport', label: 'HAINE SPORT', href: ROUTES.haineSport },
  { key: 'beauty', label: 'BEAUTY', href: ROUTES.beauty },
  { key: 'accesorii', label: 'ACCESORII', href: ROUTES.accesorii },
  { key: 'swim', label: 'SWIM', href: ROUTES.swim },
  { key: 'vs-now', label: 'VS NOW', href: ROUTES.vsNow },
];

export const FOOTER_NAV = {
  help: [
    { label: 'FAQ', href: '#' },
    { label: 'Magazinele Noastre', href: '#' },
    { label: 'Contactează-ne', href: '#' },
  ],
  info: [
    { label: 'Livrare și plată', href: '#' },
    { label: 'Returnări și reclamații', href: '#' },
    { label: 'Politică de confidențialitate', href: '#' },
    { label: 'Politica Privind Cookie-Urile', href: '#' },
    { label: 'Formular de retur', href: '#' },
  ],
  support: [
    { label: 'Contul meu', href: '#' },
    { label: 'Lista De Dorințe', href: '#' },
    { label: 'Termenii Și Condițiile', href: '#' },
    { label: 'Reguli De Promovare', href: '#' },
    { label: 'Returnări Și Reclamații', href: '#' },
  ],
} as const;
