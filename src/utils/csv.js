export function downloadCSV(days, shifts, schedule) {
  let csv = "Dan," + shifts.join(",") + "\n";

  for (let di = 0; di < days.length; di++) {
    const row = [days[di]];
    for (let si = 0; si < shifts.length; si++) {
      const key = `${days[di]} - ${shifts[si]}`;
      row.push(schedule?.[key] ?? "");
    }
    csv +=
      row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",") + "\n";
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "schedule.csv";
  a.click();
  URL.revokeObjectURL(url);
}
