# Quiniela Mundial 2026

App para capturar los goles de cada partido de la fase de grupos, agregar
notas por partido, y ver la tabla de posiciones por persona (sistema 3-1-0:
victoria/empate/derrota).

La pestaña **Ajustes** permite, sin tocar código:
- Cambiar el nombre que se muestra de cada una de las 6 personas.
- Reasignar qué persona tiene cada país — útil en la fase de eliminatorias,
  cuando se vaya sabiendo qué selección avanzó y a quién le toca.

## Subir a GitHub

1. Entra a [github.com/new](https://github.com/new) y crea un repositorio
   (puede ser privado).
2. En la página del repo recién creado, da clic en **"uploading an existing
   file"**.
3. Arrastra todo el contenido de esta carpeta **excepto** `node_modules` y
   `.next` (si existen) — son carpetas generadas que Vercel reinstala solo.
4. Confirma el commit ("Commit changes").

## Desplegar en Vercel

1. Entra a [vercel.com/new](https://vercel.com/new) y elige **"Import Git
   Repository"**, selecciona el repo que acabas de subir y la cuenta/equipo
   donde quieras que quede.
2. Vercel detecta que es un proyecto Next.js automáticamente — no necesitas
   cambiar ningún ajuste. Da clic en **Deploy**.
3. **Importante para que los goles se compartan entre todos los celulares:**
   ya con el proyecto desplegado, ve a la pestaña **Storage** del proyecto →
   **Create Database** → **Redis** → **Connect**. Esto agrega las variables
   de entorno necesarias automáticamente.
4. Vuelve a la pestaña **Deployments** y da clic en **Redeploy** en el último
   deployment para que tome la base de datos nueva.

Sin el paso 3, la app sigue funcionando pero cada quien vería resultados
distintos (no se guardan compartidos).

## Correrlo en tu computadora

```
npm install
npm run dev
```

Abre `http://localhost:3000`. En este modo, sin Redis configurado, los
marcadores se guardan en `data/scores.local.json` en tu propia máquina.

## Estructura

- `data/matches.js` — los 52 partidos de la fase de grupos y la asignación
  por defecto de país → persona (la pestaña Ajustes permite cambiarla sin
  tocar este archivo).
- `lib/store.js` — guarda/lee marcadores, notas y ajustes (Redis en
  producción, archivos locales en desarrollo).
- `app/api/scores/route.js` — API para leer/guardar goles y notas por partido.
- `app/api/settings/route.js` — API para leer/guardar nombres de personas y
  la asignación país → persona.
- `app/page.js` — interfaz: captura de goles y notas, tabla de posiciones,
  y pestaña de Ajustes.

Cuando termine la fase de grupos (27 de junio) y se sepan los cruces de
eliminatorias, hay que agregar esos partidos a `data/matches.js` con sus
equipos reales (los países ya existentes se reasignan desde la app misma,
en Ajustes, sin tocar código).
