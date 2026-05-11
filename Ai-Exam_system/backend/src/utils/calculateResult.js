export function calculateResult(obtained, total) {
  const percentage = (obtained / total) * 100;

  let grade = "";

  if (percentage < 21) grade = "F";
  else if (percentage < 50) grade = "D";
  else if (percentage < 70) grade = "C";
  else if (percentage < 90) grade = "B";
  else grade = "A";

  return {
    percentage: percentage.toFixed(2),
    grade,
    pass: percentage >= 21,
  };
}