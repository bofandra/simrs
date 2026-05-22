import { PageShell } from "@/components/page-shell";
import { frontOfficeQueues, journeys, mvpModules } from "@/lib/prototype-data";

export default function PatientsPage() {
  const rawatJalanJourney = journeys.find((journey) => journey.slug === "rajal");
  const frontOfficeModules = mvpModules.filter((module) =>
    ["Front Office", "Clinical"].includes(module.category),
  );

  return (
    <PageShell
      currentPath="/patients"
      kicker="Front Office"
      title="Mulai dari titik yang paling sering disentuh: pasien, antrean, dan pembukaan encounter."
      intro="Halaman ini merangkum area registrasi dan admission awal. Fokusnya adalah memastikan pasien masuk ke sistem dengan rapi, cepat, dan langsung terhubung ke modul klinis berikutnya."
    >
      <section className="grid two">
        <article className="panel panel-strong">
          <div className="section-title">
            <h3>Flow Rawat Jalan</h3>
            <span>{rawatJalanJourney?.owner}</span>
          </div>
          <div className="timeline">
            {rawatJalanJourney?.steps.map((entry, index) => (
              <div className="timeline-step" key={entry.step}>
                <span className="timeline-badge">{index + 1}</span>
                <div>
                  <h4>{entry.step}</h4>
                  <p>{entry.note}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-title">
            <h3>Layar Front Office</h3>
            <span>Prioritas build paling awal</span>
          </div>
          <div className="list">
            {frontOfficeModules.map((module) => (
              <div className="list-item" key={module.name}>
                <strong>{module.name}</strong>
                <p>{module.description}</p>
                <span>{module.screens.join(" | ")}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-title">
          <h3>Queue yang Harus Didukung</h3>
          <span>Agar antarmuka mengikuti beban kerja nyata</span>
        </div>
        <div className="grid three">
          {frontOfficeQueues.map((lane) => (
            <article className="list-item" key={lane.title}>
              <strong>{lane.title}</strong>
              <p>{lane.description}</p>
              <span>{lane.items.join(" | ")}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h3>Keputusan Data Penting</h3>
          <span>Supaya modul lain tidak pecah di belakang</span>
        </div>
        <div className="matrix">
          <div className="matrix-row">
            <strong>Satu MRN per pasien</strong>
            <p>
              Pencarian pasien harus mencegah duplikasi identitas dan menjadi
              fondasi semua encounter berikutnya.
            </p>
          </div>
          <div className="matrix-row">
            <strong>Encounter dibuka saat registrasi</strong>
            <p>
              Semua pemeriksaan, order, hasil, dan billing menempel ke encounter
              ini, bukan dibuat terpisah per unit.
            </p>
          </div>
          <div className="matrix-row">
            <strong>Penjamin terlihat sejak awal</strong>
            <p>
              Umum, BPJS, atau penjamin lain harus sudah diketahui sejak awal
              agar alur administrasi dan billing tidak terpecah.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
