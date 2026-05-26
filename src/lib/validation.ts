export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return { valid: false, error: 'Email-ul este obligatoriu.' };
  if (!re.test(email)) return { valid: false, error: 'Email invalid.' };
  return { valid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name.trim()) return { valid: false, error: 'Prenumele este obligatoriu.' };
  if (name.trim().length < 2) return { valid: false, error: 'Prenumele trebuie să aibă cel puțin 2 caractere.' };
  return { valid: true };
}

export function validateSizeSelected(size: string | null | undefined): ValidationResult {
  if (!size) return { valid: false, error: 'Selectează o mărime.' };
  return { valid: true };
}

export function validatePromoCode(
  code: string,
  validCodes: Record<string, number>,
): ValidationResult {
  if (!code.trim()) return { valid: false, error: 'Introdu un cod promoțional.' };
  if (!validCodes[code.toUpperCase()]) return { valid: false, error: 'Cod invalid. Încearcă din nou.' };
  return { valid: true };
}
