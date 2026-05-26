import type { NewsletterFormData } from '../types';
import { ROUTES } from '../constants/routes';

export function submitNewsletterForm(data: NewsletterFormData): void {
  const params = new URLSearchParams();
  if (data.name) params.set('name', data.name);
  params.set('email', data.email);
  window.location.href = `${ROUTES.register}?${params.toString()}`;
}
