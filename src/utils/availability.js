export function buildAvailability(people, days, shifts) {
  const availability = {};
  for (const p of people) {
    availability[p] = Array.from({ length: days.length }, () =>
      Array.from({ length: shifts.length }, () => 1),
    );
  }
  return availability;
}
