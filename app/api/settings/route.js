import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/store";
import { PERSONS as DEFAULT_PERSONS, OWNER as DEFAULT_OWNER } from "@/data/matches";

const PERSON_KEYS = new Set(Object.keys(DEFAULT_PERSONS));
const COUNTRY_KEYS = new Set(Object.keys(DEFAULT_OWNER));
const MAX_NAME_LENGTH = 30;

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const updates = {};

  if (body.persons) {
    const persons = {};
    for (const [key, name] of Object.entries(body.persons)) {
      if (!PERSON_KEYS.has(key)) continue;
      if (typeof name !== "string" || !name.trim() || name.length > MAX_NAME_LENGTH) {
        return NextResponse.json({ error: `Nombre inválido para ${key}` }, { status: 400 });
      }
      persons[key] = name;
    }
    updates.persons = persons;
  }

  if (body.owners) {
    const owners = {};
    for (const [country, personKey] of Object.entries(body.owners)) {
      if (!COUNTRY_KEYS.has(country)) continue;
      if (!PERSON_KEYS.has(personKey)) {
        return NextResponse.json({ error: `Persona inválida para ${country}` }, { status: 400 });
      }
      owners[country] = personKey;
    }
    updates.owners = owners;
  }

  const settings = await saveSettings(updates);
  return NextResponse.json(settings);
}
