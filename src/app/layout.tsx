import type { Metadata } from 'next';
import { Cabin } from 'next/font/google';
import Link from 'next/link';
import NavLink from './components/NavLink';
import './globals.css';
const inter = Cabin({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MicroSigma',
  description: 'Gérer votre micro entreprise',
};

export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        <header>
          <nav className="border-gray-200 bg-white px-4 py-2.5 shadow-md">
            <div className="flex flex-wrap items-center justify-between">
              <div className="self-center whitespace-nowrap text-xl font-semibold">
                <Link href="/">📊 MicroSigma</Link>
              </div>
              <div>
                <ul className="flex">
                  <li>
                    <NavLink href="/declaration">Déclaration</NavLink>
                  </li>
                  <li>
                    <NavLink href="/revenue">Suivi du CA</NavLink>
                  </li>
                  <li>
                    <NavLink href="/activity">Rapport d&apos;activité</NavLink>
                  </li>
                </ul>
              </div>
              <div></div>
            </div>
          </nav>
        </header>
        <main className="h-full bg-gray-100">
          <div className="m-auto max-w-screen-md">{children}</div>
        </main>
      </body>
    </html>
  );
}
