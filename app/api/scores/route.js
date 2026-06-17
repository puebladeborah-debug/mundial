import { NextResponse } from "next/server";
import { getScores, updateMatch, clearMatchScore } from "@/lib/store";
import { GROUP_STAGE } from "@/data/matches";

const VALID_IDS = new Set(GROUP_STAGE.map((m) => m.id));
const MAX_GOALS = 30;
const MAX_NOTE_LENGTH = 300;

export async function GET() {
  const scores = await getScores();
  return NextResponse.json({ scores });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.matchId !== "string" || !VALID_IDS.has(body.matchId)) {
    return NextResponse.json({ error: "matchId inválido" }, { status: 400 });
  }

  if (body.clearScore) {
    const scores = await clearMatchScore(body.matchId);
    return NextResponse.json({ scores });
  }

  const patch = {};
  const isValidGoals = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

  if (body.home !== undefined || body.away !== undefined) {
    const home = Number(body.home);
    const away = Number(body.away);
    if (!isValidGoals(home) || !isValidGoals(away)) {
      return NextResponse.json({ error: "Goles inválidos" }, { status: 400 });
    }
    patch.home = home;
    patch.away = away;
  }

  if (body.note !== undefined) {
    if (typeof body.note !== "string" || body.note.length > MAX_NOTE_LENGTH) {
      return NextResponse.json({ error: "Nota inválida" }, { status: 400 });
    }
    patch.note = body.note.trim();
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nada para guardar" }, { status: 400 });
  }

  const scores = await updateMatch(body.matchId, patch);
  return NextResponse.json({ scores });
}
