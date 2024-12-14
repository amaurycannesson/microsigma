export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Déclarer ses revenues</h1>
        <div>
          <a
            target="_blank"
            rel="external"
            href="https://www.autoentrepreneur.urssaf.fr/portail/accueil.html"
            className="inline-flex items-center justify-center rounded-lg bg-purple-200 px-3 py-1 text-sm text-purple-500 hover:bg-purple-300 hover:text-purple-900"
          >
            <span className="w-full">Urssaf</span>
            <svg
              className="ml-2 h-4 w-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
          <a
            target="_blank"
            rel="external"
            href="https://cfspro-idp.impots.gouv.fr/"
            className="ml-2 inline-flex items-center justify-center rounded-lg bg-pink-200 px-3 py-1 text-sm text-pink-500 hover:bg-pink-300 hover:text-pink-900"
          >
            <span className="w-full">Impôts</span>
            <svg
              className="ml-2 h-4 w-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}
