// Quiniela Mundial 2026 — fase de grupos con equipos confirmados.
// Hora de Ciudad de México (UTC-6). La fase eliminatoria se agrega cuando
// se definan los cruces al cerrar la fase de grupos (27 de junio).

export const PERSONS = {
  MARLEN: { name: "Marlen", color: "#e63946" },
  YESS: { name: "Yess", color: "#f4a261" },
  DEBBIE: { name: "Debbie", color: "#2a9d8f" },
  MARISOL: { name: "Marisol", color: "#457b9d" },
  SAM: { name: "Sam", color: "#8338ec" },
  GALI: { name: "Gali", color: "#ffb703" },
};

export const OWNER = {
  Argelia: "MARLEN", Colombia: "MARLEN", Inglaterra: "MARLEN", "Nueva Zelanda": "MARLEN",
  Portugal: "MARLEN", Catar: "MARLEN", Egipto: "MARLEN", Suiza: "MARLEN",

  Curazao: "YESS", "Rep. Dem. del Congo": "YESS", "Países Bajos": "YESS", Túnez: "YESS",
  Senegal: "YESS", Croacia: "YESS", Argentina: "YESS", Panamá: "YESS",

  Australia: "DEBBIE", Uruguay: "DEBBIE", "Corea del Sur": "DEBBIE", Brasil: "DEBBIE",
  Sudáfrica: "DEBBIE", Francia: "DEBBIE", Paraguay: "DEBBIE", "Cabo Verde": "DEBBIE",

  Noruega: "MARISOL", "Costa de Marfil": "MARISOL", Escocia: "MARISOL", Uzbekistán: "MARISOL",
  Ghana: "MARISOL", Haití: "MARISOL", Turquía: "MARISOL", España: "MARISOL",

  Marruecos: "SAM", Ecuador: "SAM", "Estados Unidos": "SAM", Jordania: "SAM",
  Suecia: "SAM", Irak: "SAM", México: "SAM", Austria: "SAM",

  Alemania: "GALI", Japón: "GALI", "República Checa": "GALI", Canadá: "GALI",
  "Arabia Saudita": "GALI", Bélgica: "GALI", Irán: "GALI", Bosnia: "GALI",
};

export const FLAG = {
  Argelia: "🇩🇿", Colombia: "🇨🇴", Inglaterra: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Nueva Zelanda": "🇳🇿", Portugal: "🇵🇹", Catar: "🇶🇦", Egipto: "🇪🇬", Suiza: "🇨🇭",
  Curazao: "🇨🇼", "Rep. Dem. del Congo": "🇨🇩", "Países Bajos": "🇳🇱", Túnez: "🇹🇳", Senegal: "🇸🇳", Croacia: "🇭🇷", Argentina: "🇦🇷", Panamá: "🇵🇦",
  Australia: "🇦🇺", Uruguay: "🇺🇾", "Corea del Sur": "🇰🇷", Brasil: "🇧🇷", Sudáfrica: "🇿🇦", Francia: "🇫🇷", Paraguay: "🇵🇾", "Cabo Verde": "🇨🇻",
  Noruega: "🇳🇴", "Costa de Marfil": "🇨🇮", Escocia: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Uzbekistán: "🇺🇿", Ghana: "🇬🇭", Haití: "🇭🇹", Turquía: "🇹🇷", España: "🇪🇸",
  Marruecos: "🇲🇦", Ecuador: "🇪🇨", "Estados Unidos": "🇺🇸", Jordania: "🇯🇴", Suecia: "🇸🇪", Irak: "🇮🇶", México: "🇲🇽", Austria: "🇦🇹",
  Alemania: "🇩🇪", Japón: "🇯🇵", "República Checa": "🇨🇿", Canadá: "🇨🇦", "Arabia Saudita": "🇸🇦", Bélgica: "🇧🇪", Irán: "🇮🇷", Bosnia: "🇧🇦",
};

// id: gXX en orden cronológico
export const GROUP_STAGE = [
  { id: "g01", date: "2026-06-17", day: "Miércoles 17 de junio", time: "19:00", home: "Uzbekistán", away: "Colombia", group: "K", venue: "Kansas City" },
  { id: "g02", date: "2026-06-17", day: "Miércoles 17 de junio", time: "10:00", home: "Portugal", away: "Rep. Dem. del Congo", group: "J", venue: "Toronto" },
  { id: "g03", date: "2026-06-17", day: "Miércoles 17 de junio", time: "13:00", home: "Inglaterra", away: "Croacia", group: "L", venue: "Nueva York/Nueva Jersey" },
  { id: "g04", date: "2026-06-17", day: "Miércoles 17 de junio", time: "17:00", home: "Ghana", away: "Panamá", group: "F", venue: "Miami" },

  { id: "g05", date: "2026-06-18", day: "Jueves 18 de junio", time: "13:00", home: "Canadá", away: "Catar", group: "A", venue: "Toronto" },
  { id: "g06", date: "2026-06-18", day: "Jueves 18 de junio", time: "10:00", home: "Suiza", away: "Bosnia", group: "B", venue: "Boston" },
  { id: "g07", date: "2026-06-18", day: "Jueves 18 de junio", time: "19:00", home: "México", away: "Corea del Sur", group: "C", venue: "Ciudad de México" },
  { id: "g08", date: "2026-06-18", day: "Jueves 18 de junio", time: "12:00", home: "República Checa", away: "Sudáfrica", group: "D", venue: "Guadalajara" },

  { id: "g09", date: "2026-06-19", day: "Viernes 19 de junio", time: "11:00", home: "Estados Unidos", away: "Australia", group: "D", venue: "Dallas" },
  { id: "g10", date: "2026-06-19", day: "Viernes 19 de junio", time: "22:00", home: "Turquía", away: "Paraguay", group: "G", venue: "Los Ángeles" },
  { id: "g11", date: "2026-06-19", day: "Viernes 19 de junio", time: "16:00", home: "Escocia", away: "Marruecos", group: "H", venue: "Boston" },
  { id: "g12", date: "2026-06-19", day: "Viernes 19 de junio", time: "19:00", home: "Brasil", away: "Haití", group: "I", venue: "Miami" },

  { id: "g13", date: "2026-06-20", day: "Sábado 20 de junio", time: "20:00", home: "Túnez", away: "Japón", group: "F", venue: "Nueva York/Nueva Jersey" },
  { id: "g14", date: "2026-06-20", day: "Sábado 20 de junio", time: "13:00", home: "Países Bajos", away: "Suecia", group: "E", venue: "Los Ángeles" },
  { id: "g15", date: "2026-06-20", day: "Sábado 20 de junio", time: "18:00", home: "Ecuador", away: "Curazao", group: "E", venue: "Houston" },
  { id: "g16", date: "2026-06-20", day: "Sábado 20 de junio", time: "15:00", home: "Alemania", away: "Costa de Marfil", group: "J", venue: "Kansas City" },

  { id: "g17", date: "2026-06-21", day: "Domingo 21 de junio", time: "16:00", home: "Nueva Zelanda", away: "Egipto", group: "I", venue: "Miami" },
  { id: "g18", date: "2026-06-21", day: "Domingo 21 de junio", time: "10:00", home: "Bélgica", away: "Irán", group: "H", venue: "Boston" },
  { id: "g19", date: "2026-06-21", day: "Domingo 21 de junio", time: "10:00", home: "España", away: "Arabia Saudita", group: "C", venue: "Filadelfia" },
  { id: "g20", date: "2026-06-21", day: "Domingo 21 de junio", time: "16:00", home: "Uruguay", away: "Cabo Verde", group: "L", venue: "Atlanta" },

  { id: "g21", date: "2026-06-22", day: "Lunes 22 de junio", time: "18:00", home: "Jordania", away: "Argelia", group: "D", venue: "Nueva York/Nueva Jersey" },
  { id: "g22", date: "2026-06-22", day: "Lunes 22 de junio", time: "10:00", home: "Argentina", away: "Austria", group: "B", venue: "Filadelfia" },
  { id: "g23", date: "2026-06-22", day: "Lunes 22 de junio", time: "16:00", home: "Francia", away: "Irak", group: "I", venue: "Houston" },
  { id: "g24", date: "2026-06-22", day: "Lunes 22 de junio", time: "18:00", home: "Noruega", away: "Senegal", group: "G", venue: "Nueva York/Nueva Jersey" },

  { id: "g25", date: "2026-06-23", day: "Martes 23 de junio", time: "18:00", home: "Colombia", away: "Rep. Dem. del Congo", group: "K", venue: "Nueva York/Nueva Jersey" },
  { id: "g26", date: "2026-06-23", day: "Martes 23 de junio", time: "10:00", home: "Portugal", away: "Uzbekistán", group: "J", venue: "Toronto" },
  { id: "g27", date: "2026-06-23", day: "Martes 23 de junio", time: "17:00", home: "Panamá", away: "Croacia", group: "L", venue: "Atlanta" },
  { id: "g28", date: "2026-06-23", day: "Martes 23 de junio", time: "14:00", home: "Inglaterra", away: "Ghana", group: "F", venue: "Filadelfia" },

  { id: "g29", date: "2026-06-24", day: "Miércoles 24 de junio", time: "10:00", home: "Suiza", away: "Canadá", group: "A", venue: "Toronto" },
  { id: "g30", date: "2026-06-24", day: "Miércoles 24 de junio", time: "10:00", home: "Bosnia", away: "Catar", group: "A", venue: "Boston" },
  { id: "g31", date: "2026-06-24", day: "Miércoles 24 de junio", time: "21:00", home: "República Checa", away: "México", group: "C", venue: "Ciudad de México" },
  { id: "g32", date: "2026-06-24", day: "Miércoles 24 de junio", time: "21:00", home: "Sudáfrica", away: "Corea del Sur", group: "D", venue: "Monterrey" },
  { id: "g33", date: "2026-06-24", day: "Miércoles 24 de junio", time: "16:00", home: "Marruecos", away: "Haití", group: "E", venue: "Miami" },
  { id: "g34", date: "2026-06-24", day: "Miércoles 24 de junio", time: "16:00", home: "Escocia", away: "Brasil", group: "H", venue: "Boston" },

  { id: "g35", date: "2026-06-25", day: "Jueves 25 de junio", time: "18:00", home: "Paraguay", away: "Australia", group: "D", venue: "Dallas" },
  { id: "g36", date: "2026-06-25", day: "Jueves 25 de junio", time: "18:00", home: "Turquía", away: "Estados Unidos", group: "G", venue: "Houston" },
  { id: "g37", date: "2026-06-25", day: "Jueves 25 de junio", time: "19:00", home: "Japón", away: "Suecia", group: "E", venue: "Los Ángeles" },
  { id: "g38", date: "2026-06-25", day: "Jueves 25 de junio", time: "16:00", home: "Túnez", away: "Países Bajos", group: "F", venue: "Nueva York/Nueva Jersey" },
  { id: "g39", date: "2026-06-25", day: "Jueves 25 de junio", time: "15:00", home: "Curazao", away: "Costa de Marfil", group: "J", venue: "Kansas City" },
  { id: "g40", date: "2026-06-25", day: "Jueves 25 de junio", time: "15:00", home: "Ecuador", away: "Alemania", group: "I", venue: "Kansas City" },

  { id: "g41", date: "2026-06-26", day: "Viernes 26 de junio", time: "18:00", home: "Nueva Zelanda", away: "Bélgica", group: "H", venue: "Atlanta" },
  { id: "g42", date: "2026-06-26", day: "Viernes 26 de junio", time: "18:00", home: "Egipto", away: "Irán", group: "B", venue: "Miami" },
  { id: "g43", date: "2026-06-26", day: "Viernes 26 de junio", time: "16:00", home: "Uruguay", away: "España", group: "L", venue: "Atlanta" },
  { id: "g44", date: "2026-06-26", day: "Viernes 26 de junio", time: "17:00", home: "Cabo Verde", away: "Arabia Saudita", group: "C", venue: "Miami" },
  { id: "g45", date: "2026-06-26", day: "Viernes 26 de junio", time: "13:00", home: "Senegal", away: "Irak", group: "G", venue: "Boston" },
  { id: "g46", date: "2026-06-26", day: "Viernes 26 de junio", time: "13:00", home: "Noruega", away: "Francia", group: "I", venue: "Boston" },

  { id: "g47", date: "2026-06-27", day: "Sábado 27 de junio", time: "19:00", home: "Jordania", away: "Argentina", group: "B", venue: "Nueva York/Nueva Jersey" },
  { id: "g48", date: "2026-06-27", day: "Sábado 27 de junio", time: "19:00", home: "Argelia", away: "Austria", group: "D", venue: "Nueva York/Nueva Jersey" },
  { id: "g49", date: "2026-06-27", day: "Sábado 27 de junio", time: "17:30", home: "Rep. Dem. del Congo", away: "Uzbekistán", group: "K", venue: "Toronto" },
  { id: "g50", date: "2026-06-27", day: "Sábado 27 de junio", time: "17:30", home: "Colombia", away: "Portugal", group: "J", venue: "Toronto" },
  { id: "g51", date: "2026-06-27", day: "Sábado 27 de junio", time: "15:00", home: "Croacia", away: "Ghana", group: "L", venue: "Atlanta" },
  { id: "g52", date: "2026-06-27", day: "Sábado 27 de junio", time: "15:00", home: "Panamá", away: "Inglaterra", group: "F", venue: "Miami" },
];
