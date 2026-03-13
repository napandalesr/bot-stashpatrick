export const cond = (): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();

  const limitDate = new Date(currentYear, 3, 25); 
  return now < limitDate;
}

