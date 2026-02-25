export function useScheduleApi(apiBase, setStatus, setResult) {
  async function loadExample() {
    try {
      setStatus({ kind: "loading", text: "Učitavam primer..." });
      setResult(null);

      const res = await fetch(`${apiBase}/example`);
      const data = await res.json();

      setStatus({ kind: "ok", text: "Primer učitan." });
      return data;
    } catch {
      setStatus({ kind: "err", text: "Greška pri učitavanju primera." });
      return null;
    }
  }

  async function generate(payload) {
    setStatus({ kind: "loading", text: "Računam raspored..." });
    setResult(null);

    const res = await fetch(`${apiBase}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus({ kind: "err", text: data.error || "Greška." });
      return null;
    }

    if (!data.feasible) {
      setStatus({ kind: "err", text: data.message || "Nema rešenja." });
      return null;
    }

    setStatus({ kind: "ok", text: "Raspored generisan ✅" });
    return data;
  }

  return { loadExample, generate };
}
