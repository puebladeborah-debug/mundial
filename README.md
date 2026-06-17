# Quiniela Mundial 2026

App para capturar los goles de cada partido de la fase de grupos, agregar
notas por partido, y ver la tabla de posiciones por persona (sistema 3-1-0:
victoria/empate/derrota). Los datos se guardan en **Firebase Firestore**, en
vivo: cualquier cambio de cualquier persona se ve al instante en todos los
celulares, sin botón de actualizar.

La pestaña **Ajustes** permite, sin tocar código:
- Cambiar el nombre que se muestra de cada una de las 6 personas.
- Reasignar qué persona tiene cada país — útil en la fase de eliminatorias,
  cuando se vaya sabiendo qué selección avanzó y a quién le toca.

## Configurar Firestore (una sola vez)

1. En la [consola de Firebase](https://console.firebase.google.com/), abre el
   proyecto `mundial-d17a2` → **Build → Firestore Database → Create
   database** (si no lo has creado todavía). Elige una región y "Start in
   production mode".
2. Ve a la pestaña **Rules** y pega las reglas de seguridad que delimitan el
   acceso solo a los documentos que usa esta app (te las paso por separado).

Sin este paso, la app no puede leer ni guardar nada — Firestore bloquea todo
acceso por default hasta que las reglas lo permiten explícitamente.

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
   cambiar ningún ajuste ni variables de entorno. Da clic en **Deploy**.

No se necesita ninguna base de datos de Vercel: la configuración de Firebase
ya está incluida en el código (la "apiKey" de Firebase no es secreta, el
acceso real lo controlan las reglas de Firestore).

## Correrlo en tu computadora

```
npm install
npm run dev
```

Abre `http://localhost:3000`. Ojo: aunque lo corras en tu máquina, lee y
escribe en la misma base de datos de Firestore que usa todo mundo — no hay
modo "solo local".

## Estructura

- `data/matches.js` — los 52 partidos de la fase de grupos y la asignación
  por defecto de país → persona (la pestaña Ajustes permite cambiarla sin
  tocar este archivo).
- `lib/firebase.js` — inicializa el cliente de Firebase/Firestore.
- `app/page.js` — interfaz: captura de goles y notas, tabla de posiciones,
  y pestaña de Ajustes. Lee/escribe directo en Firestore con `onSnapshot`
  (tiempo real) y `setDoc` (guardar).

Los datos viven en dos documentos de Firestore:
- `quiniela/scores` — `{ [matchId]: { home, away, note } }`
- `quiniela/settings` — `{ persons: { MARLEN: "Marlen", ... }, owners: { Argelia: "MARLEN", ... } }`

Cuando termine la fase de grupos (27 de junio) y se sepan los cruces de
eliminatorias, hay que agregar esos partidos a `data/matches.js` con sus
equipos reales (los países ya existentes se reasignan desde la app misma,
en Ajustes, sin tocar código).
