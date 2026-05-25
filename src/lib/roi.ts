export function computeROI(
  monthlyHours: number, 
  hourlyCost: number, 
  employees: number, 
  coveragePct: number
) {
  const hoursSaved = Math.round(monthlyHours * (coveragePct/100) * employees);
  const monthlySavings = Math.round(hoursSaved * hourlyCost);
  const annual = monthlySavings * 12;
  return { hoursSaved, monthlySavings, annual };
}