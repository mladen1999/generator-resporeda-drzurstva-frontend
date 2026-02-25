function ScheduleTable({ days, shifts, schedule }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Dan</th>
            {shifts.map((sh) => (
              <th key={sh}>{sh}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d}>
              <td>{d}</td>
              {shifts.map((sh) => (
                <td key={`${d}-${sh}`}>{schedule?.[`${d} - ${sh}`] || ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;
