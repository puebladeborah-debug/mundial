"use client";

import { useEffect, useMemo, useState } from "react";
import { GROUP_STAGE, OWNER, FLAG, PERSONS } from "@/data/matches";

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

function computeStandings(scores) {
  const table = {};
  for (const key of Object.keys(PERSONS)) {
    table[key] = { key, name: PERSONS[key].name, color: PERSONS[key].color, pts: 0, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 };
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
    if (!s) continue;
    addResult(OWNER[m.home], s.home, s.away);
    addResult(OWNER[m.away], s.away, s.home);
  }

  return Object.values(table).sort(
    (a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf
  );
}

function PersonBadge({ country }) {
  const key = OWNER[country];
  const p = PERSONS[key];
  if (!p) return null;
  return <span className="badge" style={{ background: p.color }}>{p.name}</span>;
}

function MatchCard({ match, saved, onSave, onClear }) {
  const [home, setHome] = useState(saved ? String(saved.home) : "");
  const [away, setAway] = useState(saved ? String(saved.away) : "");
  const [status, setStatus] = useState("idle");

  const isValid = (v) => v !== "" && Number.isInteger(Number(v)) && Number(v) >= 0;
  const canSave = isValid(home) && isValid(away);

  async function handleSave() {
    setStatus("saving");
    await onSave(match.id, Number(home), Number(away));
    setStatus("saved");
  }

  async function handleClear() {
    setStatus("saving");
    setHome("");
    setAway("");
    await onClear(match.id);
    setStatus("idle");
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
            <PersonBadge country={match.home} />
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
            <PersonBadge country={match.away} />
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

      <div className="match-actions">
        {status === "saved" && <span className="status-text saved">Guardado ✓</span>}
        {saved && <button className="clear-btn" onClick={handleClear}>Borrar</button>}
        <button className="save-btn" disabled={!canSave || status === "saving"} onClick={handleSave}>
          Guardar
        </button>
      </div>
    </div>
  );
}

function StandingsTable({ scores }) {
  const rows = useMemo(() => computeStandings(scores), [scores]);
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

export default function Home() {
  const [scores, setScores] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("partidos");
  const [refreshKey, setRefreshKey] = useState(0);

  async function fetchScores() {
    const res = await fetch("/api/scores", { cache: "no-store" });
    const data = await res.json();
    setScores(data.scores || {});
    setLoaded(true);
    setRefreshKey((k) => k + 1);
  }

  useEffect(() => {
    fetchScores();
  }, []);

  async function handleSave(matchId, home, away) {
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, home, away }),
    });
    const data = await res.json();
    setScores(data.scores || {});
  }

  async function handleClear(matchId) {
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, clear: true }),
    });
    const data = await res.json();
    setScores(data.scores || {});
  }

  const days = useMemo(() => groupByDay(GROUP_STAGE), []);

  return (
    <div className="app">
      <div className="header">
        <h1>QUINIELA MUNDIAL 2026</h1>
        <p>Captura los goles de cada partido · hora CDMX</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === "partidos" ? "active" : ""}`} onClick={() => setTab("partidos")}>
          Partidos
        </button>
        <button className={`tab-btn ${tab === "tabla" ? "active" : ""}`} onClick={() => setTab("tabla")}>
          Tabla de posiciones
        </button>
      </div>

      <button className="refresh-btn" onClick={fetchScores}>↻ Actualizar resultados</button>

      {!loaded && <div className="loading">Cargando…</div>}

      {loaded && tab === "partidos" && days.map((d) => (
        <div key={d.day}>
          <div className="day-title">{d.day}</div>
          {d.matches.map((m) => (
            <MatchCard
              key={`${m.id}-${refreshKey}`}
              match={m}
              saved={scores[m.id]}
              onSave={handleSave}
              onClear={handleClear}
            />
          ))}
        </div>
      ))}

      {loaded && tab === "tabla" && <StandingsTable scores={scores} />}
    </div>
  );
}
