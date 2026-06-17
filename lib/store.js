import fs from "node:fs";
import path from "node:path";
import { PERSONS as DEFAULT_PERSONS, OWNER as DEFAULT_OWNER } from "@/data/matches";

const SCORES_KEY = "wc2026:scores";
const SETTINGS_KEY = "wc2026:settings";

// La integración de Redis en el Vercel Marketplace inyecta distintos nombres
// de variables según la versión; revisamos las variantes conocidas.
const REDIS_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const hasKV = Boolean(REDIS_URL && REDIS_TOKEN);

let redisClient = null;
async function getRedis() {
  if (!redisClient) {
    const { Redis } = await import("@upstash/redis");
    redisClient = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
  }
  return redisClient;
}

function localFilePath(name) {
  return path.join(process.cwd(), "data", `${name}.local.json`);
}

function readLocalFile(name) {
  try {
    return JSON.parse(fs.readFileSync(localFilePath(name), "utf8"));
  } catch {
    return null;
  }
}

function writeLocalFile(name, value) {
  const file = localFilePath(name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

async function readRecord(redisKey, localName) {
  if (hasKV) {
    const redis = await getRedis();
    return (await redis.get(redisKey)) || null;
  }
  return readLocalFile(localName);
}

async function writeRecord(redisKey, localName, value) {
  if (hasKV) {
    const redis = await getRedis();
    await redis.set(redisKey, value);
    return;
  }
  writeLocalFile(localName, value);
}

// ---- Marcadores y notas por partido ----

export async function getScores() {
  return (await readRecord(SCORES_KEY, "scores")) || {};
}

export async function updateMatch(matchId, patch) {
  const scores = await getScores();
  const existing = scores[matchId] || {};
  const next = { ...existing, ...patch };
  scores[matchId] = next;
  await writeRecord(SCORES_KEY, "scores", scores);
  return scores;
}

export async function clearMatchScore(matchId) {
  const scores = await getScores();
  const existing = scores[matchId];
  if (existing) {
    delete existing.home;
    delete existing.away;
    if (!existing.note) {
      delete scores[matchId];
    } else {
      scores[matchId] = existing;
    }
  }
  await writeRecord(SCORES_KEY, "scores", scores);
  return scores;
}

// ---- Ajustes: nombres de personas y país -> persona ----

export async function getSettings() {
  const stored = await readRecord(SETTINGS_KEY, "settings");

  const persons = {};
  for (const key of Object.keys(DEFAULT_PERSONS)) {
    persons[key] = {
      ...DEFAULT_PERSONS[key],
      ...(stored?.persons?.[key] ? { name: stored.persons[key] } : {}),
    };
  }

  const owners = { ...DEFAULT_OWNER, ...(stored?.owners || {}) };

  return { persons, owners };
}

export async function saveSettings(updates) {
  const current = await getSettings();
  const next = {
    persons: Object.fromEntries(Object.entries(current.persons).map(([k, p]) => [k, p.name])),
    owners: { ...current.owners },
  };

  if (updates.persons) {
    for (const [key, name] of Object.entries(updates.persons)) {
      if (DEFAULT_PERSONS[key] && typeof name === "string" && name.trim()) {
        next.persons[key] = name.trim().slice(0, 30);
      }
    }
  }

  if (updates.owners) {
    for (const [country, personKey] of Object.entries(updates.owners)) {
      if (country in DEFAULT_OWNER && DEFAULT_PERSONS[personKey]) {
        next.owners[country] = personKey;
      }
    }
  }

  await writeRecord(SETTINGS_KEY, "settings", next);
  return getSettings();
}
