"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, setDoc, deleteField } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GROUP_STAGE, FLAG, PERSONS as DEFAULT_PERSONS, OWNER as DEFAULT_OWNER } from "@/data/matches";

const scoresRef = doc(db, "quiniela", "scores");
const settingsRef = doc(db, "quiniela", "settings");

function groupByDay(matches) {
  const days = [];
  const map = {};
  for (const m of matches) {
    if (!map[m.day]) {
      map[m.day] = [];
      days.push(m.day);
    }
    map[m.day].push(m);
  }
  return days.map((day) => ({ day, matches: map[day] }));
}

function mergePersons(storedPersons) {
  const persons = {};
  for (const key of Object.keys(DEFAULT_PERSONS)) {
    persons[key] = {
      ...DEFAULT_PERSONS[key],
      ...(storedPersons?.[key] ? { name: storedPersons[key] } : {}),
    };
  }
  return persons;
}

function computeStandings(scores, persons, owners) {
  const table = {};
  for (const key of Object.keys(persons)) {
    table[key] = { key, name: persons[key].name, color: persons[key].color, pts: 0, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 };
  }

  function addResult(ownerKey, gf, gc) {
    const t = table[ownerKey];
    if (!t) return;
    t.pj += 1;
    t.gf += gf;
    t.gc += gc;
    if (gf > gc) {
      t.g += 1;
      t.pts += 3;
    } else if (gf === gc) {
      t.e += 1;
      t.pts += 1;
    } else {
      t.p += 1;
    }
  }

  for (const m of GROUP_STAGE) {
    const s = scores[m.id];
    if (!s || s.home === undefined || s.away === undefined) continue;
    addResult(owners[m.home], s.home, s.away);
    addResult(owners[m.away], s.away, s.home);
  }

  return Object.values(table).sort(
    (a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf
  );
}

function PersonBadge({ country, persons, owners }) {
  const key = owners[country];
  const p = persons[key];
  if (!p) return null;
  return <span className="badge" style={{ background: p.color }}>{p.name}</span>;
}

function MatchCard({ match, saved, persons, owners }) {
  const savedHome = saved?.home !== undefined ? String(saved.home) : "";
  const savedAway = saved?.away !== undefined ? String(saved.away) : "";
  const savedNote = saved?.note || "";

  const [home, setHome] = useState(savedHome);
  const [away, setAway] = useState(savedAway);
  const [note, setNote] = useState(savedNote);
  const [status, setStatus] = useState("idle");

  const isValidGoals = (v) => v !== "" && Number.isInteger(Number(v)) && Number(v) >= 0;
  const scoreValid = isValidGoals(home) && isValidGoals(away);
  const noteChanged = note.trim() !== savedNote;
  const canSave = scoreValid || noteChanged;

  async function handleSave() {
    setStatus("saving");
    const patch = {};
    if (scoreValid) {
      patch.home = Number(home);
      patch.away = Number(away);
    }
    if (noteChanged) {
      patch.note = note.trim();
    }
    try {
      await setDoc(scoresRef, { [match.id]: patch }, { merge: true });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  async function handleClear() {
    setStatus("saving");
    setHome("");
    setAway("");
    try {
      await setDoc(scoresRef, { [match.id]: { home: deleteField(), away: deleteField() } }, { merge: true });
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="match-card">
      <div className="match-meta">
        <span className="time">{match.time}</span>
        <span>{match.venue} · Grupo {match.group}</span>
      </div>

      <div className="team-row">
        <div className="team-info">
          <span className="flag">{FLAG[match.home]}</span>
          <span className="names">
            <span className="country">{match.home}</span>
            <PersonBadge country={match.home} persons={persons} owners={owners} />
          </span>
        </div>
        <input
          className="goal-input"
          type="number"
          inputMode="numeric"
          min={0}
          max={30}
          value={home}
          onChange={(e) => { setHome(e.target.value); setStatus("idle"); }}
        />
      </div>

      <div className="team-row">
        <div className="team-info">
          <span className="flag">{FLAG[match.away]}</span>
          <span className="names">
            <span className="country">{match.away}</span>
            <PersonBadge country={match.away} persons={persons} owners={owners} />
          </span>
        </div>
        <input
          className="goal-input"
          type="number"
          inputMode="numeric"
          min={0}
          max={30}
          value={away}
          onChange={(e) => { setAway(e.target.value); setStatus("idle"); }}
        />
      </div>

      <textarea
        className="note-input"
        placeholder="Nota (opcional): alineación, polémica, lo que sea…"
        rows={2}
        maxLength={300}
        value={note}
        onChange={(e) => { setNote(e.target.value); setStatus("idle"); }}
      />

      <div className="match-actions">
        {status === "saved" && <span className="status-text saved">Guardado ✓</span>}
        {status === "error" && <span className="status-text error">Error al guardar</span>}
        {saved && (saved.home !== undefined) && <button className="clear-btn" onClick={handleClear}>Borrar marcador</button>}
        <button className="save-btn" disabled={!canSave || status === "saving"} onClick={handleSave}>
          Guardar
        </button>
      </div>
    </div>
  );
}

function StandingsTable({ scores, persons, owners }) {
  const rows = useMemo(() => computeStandings(scores, persons, owners), [scores, persons, owners]);
  return (
    <table className="standings-table">
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Persona</th>
          <th>Pts</th>
          <th>PJ</th>
          <th>G</th>
          <th>E</th>
          <th>P</th>
          <th>GF</th>
          <th>GC</th>
          <th>DG</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key}>
            <td>
              <span className="person-cell">
                <span className="dot" style={{ background: r.color }} />
                {r.name}
              </span>
            </td>
            <td className="pts-cell">{r.pts}</td>
            <td>{r.pj}</td>
            <td>{r.g}</td>
            <td>{r.e}</td>
            <td>{r.p}</td>
            <td>{r.gf}</td>
            <td>{r.gc}</td>
            <td>{r.gf - r.gc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SettingsPanel({ persons, owners }) {
  const [names, setNames] = useState(
    Object.fromEntries(Object.entries(persons).map(([k, p]) => [k, p.name]))
  );
  const [namesStatus, setNamesStatus] = useState("idle");
  const [savingCountry, setSavingCountry] = useState(null);

  useEffect(() => {
    setNames(Object.fromEntries(Object.entries(persons).map(([k, p]) => [k, p.name])));
  }, [persons]);

  async function handleSaveNames() {
    setNamesStatus("saving");
    try {
      await setDoc(settingsRef, { persons: names }, { merge: true });
      setNamesStatus("saved");
    } catch {
      setNamesStatus("error");
    }
  }

  async function handleOwnerChange(country, personKey) {
    setSavingCountry(country);
    try {
      await setDoc(settingsRef, { owners: { [country]: personKey } }, { merge: true });
    } finally {
      setSavingCountry(null);
    }
  }

  const sortedCountries = useMemo(() => Object.keys(owners).sort((a, b) => a.localeCompare(b, "es")), [owners]);

  return (
    <div>
      <div className="settings-section">
        <h2>Nombres de las personas</h2>
        <p className="settings-hint">Cambia el nombre que se muestra en cada quiniela.</p>
        {Object.keys(persons).map((key) => (
          <div className="name-row" key={key}>
            <span className="dot" style={{ background: persons[key].color }} />
            <input
              className="name-input"
              value={names[key] || ""}
              maxLength={30}
              onChange={(e) => { setNames({ ...names, [key]: e.target.value }); setNamesStatus("idle"); }}
            />
          </div>
        ))}
        <div className="match-actions">
          {namesStatus === "saved" && <span className="status-text saved">Guardado ✓</span>}
          {namesStatus === "error" && <span className="status-text error">Error al guardar</span>}
          <button className="save-btn" disabled={namesStatus === "saving"} onClick={handleSaveNames}>
            Guardar nombres
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>País → persona</h2>
        <p className="settings-hint">
          Útil para la fase de eliminatorias: cuando se sepa qué país avanzó, confirma o cambia aquí a quién le toca.
        </p>
        {sortedCountries.map((country) => (
          <div className="owner-row" key={country}>
            <span className="flag">{FLAG[country]}</span>
            <span className="owner-country">{country}</span>
            <select
              className="owner-select"
              value={owners[country]}
              onChange={(e) => handleOwnerChange(country, e.target.value)}
            >
              {Object.keys(persons).map((key) => (
                <option key={key} value={key}>{persons[key].name}</option>
              ))}
            </select>
            {savingCountry === country && <span className="status-text">…</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [scores, setScores] = useState({});
  const [persons, setPersons] = useState(DEFAULT_PERSONS);
  const [owners, setOwners] = useState(DEFAULT_OWNER);
  const [loaded, setLoaded] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [tab, setTab] = useState("partidos");

  useEffect(() => {
    const unsubScores = onSnapshot(
      scoresRef,
      (snap) => {
        setScores(snap.data() || {});
        setLoaded(true);
        setConnectionError(false);
      },
      () => setConnectionError(true)
    );

    const unsubSettings = onSnapshot(
      settingsRef,
      (snap) => {
        const data = snap.data();
        setPersons(mergePersons(data?.persons));
        setOwners({ ...DEFAULT_OWNER, ...(data?.owners || {}) });
      },
      () => setConnectionError(true)
    );

    return () => {
      unsubScores();
      unsubSettings();
    };
  }, []);

  const days = useMemo(() => groupByDay(GROUP_STAGE), []);

  return (
    <div className="app">
      <div className="header">
        <h1>QUINIELA MUNDIAL 2026</h1>
        <p>Captura los goles de cada partido · hora CDMX</p>
        <p className="live-indicator">{connectionError ? "⚠ Sin conexión con la base de datos" : "● En vivo — se sincroniza solo"}</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === "partidos" ? "active" : ""}`} onClick={() => setTab("partidos")}>
          Partidos
        </button>
        <button className={`tab-btn ${tab === "tabla" ? "active" : ""}`} onClick={() => setTab("tabla")}>
          Tabla
        </button>
        <button className={`tab-btn ${tab === "ajustes" ? "active" : ""}`} onClick={() => setTab("ajustes")}>
          Ajustes
        </button>
      </div>

      {!loaded && <div className="loading">Cargando…</div>}

      {loaded && tab === "partidos" && days.map((d) => (
        <div key={d.day}>
          <div className="day-title">{d.day}</div>
          {d.matches.map((m) => {
            const saved = scores[m.id];
            const cardKey = `${m.id}:${saved?.home ?? ""}:${saved?.away ?? ""}:${saved?.note ?? ""}`;
            return <MatchCard key={cardKey} match={m} saved={saved} persons={persons} owners={owners} />;
          })}
        </div>
      ))}

      {loaded && tab === "tabla" && <StandingsTable scores={scores} persons={persons} owners={owners} />}

      {loaded && tab === "ajustes" && <SettingsPanel persons={persons} owners={owners} />}
    </div>
  );
}
