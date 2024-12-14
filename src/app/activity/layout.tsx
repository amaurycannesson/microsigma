export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-3">
      <h1 className="text-2xl">Renseigner ses jours d&apos;activité</h1>
      <div className="mt-4">{children}</div>
    </div>
  );
}
