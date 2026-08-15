export const validateName = (name: string): boolean => {
  return typeof name === 'string' && name.trim().length >= 20 && name.trim().length <= 60;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

export const validateAddress = (address: string): boolean => {
  return typeof address === 'string' && address.trim().length > 0 && address.trim().length <= 400;
};

export const validatePassword = (password: string): boolean => {
  if (typeof password !== 'string' || password.length < 8 || password.length > 16) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return hasUppercase && hasSpecial;
};
