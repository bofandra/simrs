import Link from "next/link";

type PageShellProps = {
  currentPath: string;
  kicker: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

const navigation = [
  {
    href: "/",
    label: "Executive Overview",
    description: "Scope MVP, skenario utama, dan peta modul.",
  },
  {
    href: "/patients",
    label: "Front Office",
    description: "Registrasi pasien, antrean, dan admission awal.",
  },
  {
    href: "/clinical",
    label: "Clinical Core",
    description: "Rawat jalan, UGD, rawat inap, dan dokumentasi klinis.",
  },
  {
    href: "/operations",
    label: "Support Ops",
    description: "Lab, radiologi, farmasi, bed board, dan work queue.",
  },
  {
    href: "/finance",
    label: "Finance & Reports",
    description: "Billing, pembayaran, dan laporan operasional.",
  },
  {
    href: "/compliance",
    label: "Compliance Map",
    description: "KARS, regulasi Menkes, dan data inti SIMRS.",
  },
];

export function PageShell({
  currentPath,
  kicker,
  title,
  intro,
  children,
}: PageShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-badge">RS</span>
          <div>
            <h1>SIMRS Prototype</h1>
            <p>
              Fondasi awal untuk prototipe SIMRS yang menyatukan alur layanan,
              data episode pasien, dan kebutuhan kepatuhan.
            </p>
          </div>
        </div>

        <nav className="nav-group" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = item.href === currentPath;

            return (
              <Link
                className={`nav-link${active ? " active" : ""}`}
                href={item.href}
                key={item.href}
              >
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <strong>Deploy path</strong>
          <p>
            Stack awal disiapkan untuk Next.js + TypeScript dan bisa diteruskan
            ke Vercel + Supabase setelah dependency terpasang.
          </p>
        </div>
      </aside>

      <div className="page-area">
        <div className="page-inner">
          <section className="hero">
            <span className="hero-kicker">{kicker}</span>
            <h2>{title}</h2>
            <p>{intro}</p>
          </section>
          {children}
        </div>
      </div>
    </div>
  );
}
