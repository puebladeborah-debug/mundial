import { NextResponse } from "next/server";
import { getScores, setMatchScore, clearMatchScore } from "@/lib/store";
import { GROUP_STAGE } from "@/data/matches";

const VALID_IDS = new Set(GROUP_STAGE.map((m) => m.id));
const MAX_GOALS = 30;

export async function GET() {
  const scores = await getScores();
  return NextResponse.json({ scores });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.matchId !== "string" || !VALID_IDS.has(body.matchId)) {
    return NextResponse.json({ error: "matchId inválido" }, { status: 400 });
  }

  if (body.clear) {
    const scores = await clearMatchScore(body.matchId);
    return NextResponse.json({ scores });
  }

  const home = Number(body.home);
  const away = Number(body.away);
  const valid = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;
  if (!valid(home) || !valid(away)) {
    return NextResponse.json({ error: "Goles inválidos" }, { status: 400 });
  }

  const scores = await setMatchScore(body.matchId, home, away);
  return NextResponse.json({ scores });
}
