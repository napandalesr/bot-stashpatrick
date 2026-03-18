export const cond = (): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();

  const limitDate = new Date(currentYear, 5, 2); 
  return now < limitDate;
}

