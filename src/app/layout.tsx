import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PanelHub // Tu Estación Central de Enlaces',
  description: 'Hub de recursos, repositorios y accesos rápidos accesible desde cualquier dispositivo.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-[#08090d] text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
