import "./globals.css";

export const metadata = {
  title: "Quiniela Mundial 2026",
  description: "Captura de goles y tabla de posiciones de la quiniela familiar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
