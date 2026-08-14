export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string) => {
  // 8-16 characters, 1 uppercase, 1 special character
  const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~]).{8,16}$/;
  return re.test(password);
};

export const validateName = (name: string) => {
  return name.length >= 20 && name.length <= 60;
};

export const validateAddress = (address: string) => {
  return address.length > 0 && address.length <= 400;
};
