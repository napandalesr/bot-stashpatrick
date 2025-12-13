export const cond = (): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();

  const limitDate = new Date(currentYear, 0, 15); 
  
  return now > limitDate;
}