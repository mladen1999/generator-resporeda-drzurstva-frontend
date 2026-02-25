import { memo } from "react";

function AvailabilityTable({ people, days, shifts, availability, onToggle }) {
  return (
    <div className="tableWrap fixedHeight">
      <table>
        <thead>
          <tr>
            <th>Osoba</th>
            {days.map((d, di) =>
              shifts.map((sh, si) => (
                <th key={`${di}-${si}`}>
                  {d}
                  <br />
                  {sh}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p}>
              <td>{p}</td>
              {days.map((_, di) =>
                shifts.map((_, si) => (
                  <td key={`${p}-${di}-${si}`} className="center">
                    <input
                      type="checkbox"
                      checked={(availability?.[p]?.[di]?.[si] ?? 0) === 1}
                      onChange={() => onToggle(p, di, si)}
                    />
                  </td>
                )),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(AvailabilityTable);
