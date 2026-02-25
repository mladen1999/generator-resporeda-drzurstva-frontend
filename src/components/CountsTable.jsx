function CountsTable({ counts }) {
  const rows = Object.entries(counts || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="tableWrap countsTable">
      <table>
        <thead>
          <tr>
            <th>Osoba</th>
            <th>Broj smena</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([p, c]) => (
            <tr key={p}>
              <td>{p}</td>
              <td className="center">
                <b>{c}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CountsTable;
