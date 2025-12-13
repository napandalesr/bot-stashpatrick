export const cond = (): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();

  const limitDate = new Date(currentYear, 11, 31); 
  
  return now > limitDate;
}