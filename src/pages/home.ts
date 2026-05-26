import { initSharedPage } from './shared';
import { initNewsletterModal } from '../layouts/NewsletterModal';

initSharedPage();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNewsletterModal, { once: true });
} else {
  initNewsletterModal();
}
