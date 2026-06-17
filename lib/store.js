import fs from "node:fs";
import path from "node:path";

const SCORES_KEY = "wc2026:scores";
const LOCAL_FILE = path.join(process.cwd(), "data", "scores.local.json");

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

function readLocalFile() {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeLocalFile(scores) {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(scores, null, 2));
}

export async function getScores() {
  if (hasKV) {
    const redis = await getRedis();
    const scores = await redis.get(SCORES_KEY);
    return scores || {};
  }
  return readLocalFile();
}

export async function setMatchScore(matchId, home, away) {
  if (hasKV) {
    const redis = await getRedis();
    const scores = (await redis.get(SCORES_KEY)) || {};
    scores[matchId] = { home, away };
    await redis.set(SCORES_KEY, scores);
    return scores;
  }
  const scores = readLocalFile();
  scores[matchId] = { home, away };
  writeLocalFile(scores);
  return scores;
}

export async function clearMatchScore(matchId) {
  if (hasKV) {
    const redis = await getRedis();
    const scores = (await redis.get(SCORES_KEY)) || {};
    delete scores[matchId];
    await redis.set(SCORES_KEY, scores);
    return scores;
  }
  const scores = readLocalFile();
  delete scores[matchId];
  writeLocalFile(scores);
  return scores;
}
