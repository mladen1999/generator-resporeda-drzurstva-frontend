import { useMemo, useState, useCallback } from "react";
import "./App.css";

import { splitLines } from "./utils/text";
import { buildAvailability } from "./utils/availability";
import { useScheduleApi } from "./hooks/useScheduleApi";

import AvailabilityTable from "./components/AvailabilityTable";
import ScheduleTable from "./components/ScheduleTable";
import { downloadCSV } from "./utils/csv";
import CountsTable from "./components/CountsTable";

const DEFAULT_API = "http://127.0.0.1:8000";

export default function App() {
  const [apiBase, setApiBase] = useState(DEFAULT_API);

  const [peopleText, setPeopleText] = useState(
    "Ana\nMarko\nJelena\nIvan\nSara",
  );
  const [daysText, setDaysText] = useState("Pon\nUto\nSre\nČet\nPet\nSub\nNed");
  const [shiftsText, setShiftsText] = useState("Prepodne\nPopodne");

  const people = useMemo(() => splitLines(peopleText), [peopleText]);
  const days = useMemo(() => splitLines(daysText), [daysText]);
  const shifts = useMemo(() => splitLines(shiftsText), [shiftsText]);

  const [availability, setAvailability] = useState({});
  const [maxPerPerson, setMaxPerPerson] = useState(3);
  const [forbidConsecutiveDays, setForbidConsecutiveDays] = useState(false);
  const [forbidTwoShiftsSameDay, setForbidTwoShiftsSameDay] = useState(true);

  const [status, setStatus] = useState({ kind: "idle", text: "" });
  const [result, setResult] = useState(null);

  const initAvailability = useCallback(() => {
    setAvailability(buildAvailability(people, days, shifts));
  }, [people, days, shifts]);

  const api = useScheduleApi(apiBase, setStatus, setResult);

  const toggle = useCallback(
    (p, di, si) => {
      setAvailability((prev) => {
        const next = structuredClone(prev);

        if (!next[p]) {
          next[p] = Array.from({ length: days.length }, () =>
            Array.from({ length: shifts.length }, () => 0),
          );
        }
        if (!next[p][di]) {
          next[p][di] = Array.from({ length: shifts.length }, () => 0);
        }

        next[p][di][si] = next[p][di][si] ? 0 : 1;
        return next;
      });
    },
    [days.length, shifts.length],
  );

  async function loadExample() {
    const ex = await api.loadExample();
    if (!ex) return;

    setPeopleText(ex.people.join("\n"));
    setDaysText(ex.days.join("\n"));
    setShiftsText(ex.shifts.join("\n"));
    setAvailability(ex.availability);

    setMaxPerPerson(ex.constraints.maxPerPerson);
    setForbidConsecutiveDays(ex.constraints.forbidConsecutiveDays);
    setForbidTwoShiftsSameDay(ex.constraints.forbidTwoShiftsSameDay);
  }

  async function generate() {
    const avail =
      Object.keys(availability).length === 0
        ? buildAvailability(people, days, shifts)
        : availability;

    setAvailability(avail);

    const data = await api.generate({
      people,
      days,
      shifts,
      availability: avail,
      constraints: {
        maxPerPerson,
        forbidConsecutiveDays,
        forbidTwoShiftsSameDay,
      },
    });

    if (data) setResult(data);
  }

  return (
    <div className="app">
      <h1>Generator rasporeda dežurstava</h1>
      <p>Tip 2: React (Vite) + Node + optimizacija</p>

      <div className="grid">
        {/* LEFT */}
        <div className="card">
          <h2>Ulaz</h2>

          <div className="field">
            <div className="label">Backend URL</div>
            <input
              type="text"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
            />
          </div>

          <div className="rowBtns">
            <button className="btn" onClick={loadExample}>
              Učitaj primer
            </button>
            <button className="btn" onClick={initAvailability}>
              Napravi dostupnost (sve 1)
            </button>
          </div>

          <div className="field">
            <div className="label">Ljudi</div>
            <textarea
              value={peopleText}
              onChange={(e) => setPeopleText(e.target.value)}
              rows={4}
            />
          </div>

          <div className="field">
            <div className="label">Dani</div>
            <textarea
              value={daysText}
              onChange={(e) => setDaysText(e.target.value)}
              rows={4}
            />
          </div>

          <div className="field">
            <div className="label">Smene</div>
            <textarea
              value={shiftsText}
              onChange={(e) => setShiftsText(e.target.value)}
              rows={3}
            />
          </div>

          <h3>Ograničenja</h3>

          <div className="field">
            <div className="label">Maks smena po osobi</div>
            <input
              type="number"
              min={1}
              value={maxPerPerson}
              onChange={(e) => setMaxPerPerson(Number(e.target.value))}
            />
          </div>

          <div className="checkRow">
            <input
              type="checkbox"
              checked={forbidConsecutiveDays}
              onChange={(e) => setForbidConsecutiveDays(e.target.checked)}
            />
            <span>Zabrani uzastopne dane</span>
          </div>

          <div className="checkRow">
            <input
              type="checkbox"
              checked={forbidTwoShiftsSameDay}
              onChange={(e) => setForbidTwoShiftsSameDay(e.target.checked)}
            />
            <span>Zabrani 2 smene istog dana</span>
          </div>

          <div style={{ marginTop: 10 }}>
            <button className="btn btnPrimary" onClick={generate}>
              Generiši raspored
            </button>
          </div>

          <div className={`status ${status.kind}`}>{status.text}</div>
        </div>

        {/* RIGHT */}
        <div className="card">
          <h2>Dostupnost</h2>

          {!people.length || !days.length || !shifts.length ? (
            <div className="tableWrap fixedHeight" style={{ padding: 12 }}>
              Unesi ljude/dane/smene.
            </div>
          ) : !Object.keys(availability).length ? (
            <div className="tableWrap fixedHeight" style={{ padding: 12 }}>
              Klikni “Napravi dostupnost (sve 1)” ili “Učitaj primer”.
            </div>
          ) : (
            <AvailabilityTable
              people={people}
              days={days}
              shifts={shifts}
              availability={availability}
              onToggle={toggle}
            />
          )}
        </div>
      </div>

      {/* RESULT */}
      <div className="card" style={{ marginTop: 14 }}>
        <h2>Rezultat</h2>

        <div className="resultBody">
          {!result ? (
            <p style={{ opacity: 0.8 }}>Nema rezultata još.</p>
          ) : (
            <>
              <div className="badges">
                <span className="badge">
                  Vreme rešavanja: <b>{result.stats.solveTimeMs} ms</b>
                </span>
                <span className="badge">
                  Fairness gap: <b>{result.stats.fairnessGap}</b>
                </span>
                <span className="badge">
                  Max smena: <b>{result.stats.maxAssignments}</b>
                </span>
                <span className="badge">
                  Min smena: <b>{result.stats.minAssignments}</b>
                </span>
              </div>

              <button
                className="btn"
                onClick={() => downloadCSV(days, shifts, result.schedule)}
              >
                Export CSV
              </button>

              <div className="sectionGap">
                <ScheduleTable
                  days={days}
                  shifts={shifts}
                  schedule={result.schedule}
                />
              </div>

              <div className="sectionGap">
                <CountsTable counts={result.stats.assignmentsPerPerson} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
