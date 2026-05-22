import { PageShell } from "@/components/page-shell";
import { journeys, mvpModules } from "@/lib/prototype-data";

export default function ClinicalPage() {
  const clinicalJourneys = journeys.filter((journey) =>
    ["rajal", "ugd-ranap"].includes(journey.slug),
  );
  const clinicalModules = mvpModules.filter((module) =>
    ["Clinical", "Records"].includes(module.category),
  );

  return (
    <PageShell
      currentPath="/clinical"
      kicker="Clinical Core"
      title="Rawat jalan, UGD, rawat inap, dan rekam medik harus terasa seperti satu cerita klinis."
      intro="Di prototipe ini, clinical core tidak dipisah menjadi pulau-pulau kecil. Pasien, encounter, order, catatan perawatan, dan discharge harus bergerak sebagai satu alur yang utuh."
    >
      <section className="grid two">
        {clinicalJourneys.map((journey) => (
          <article className="panel" key={journey.slug}>
            <div className="section-title">
              <h3>{journey.title}</h3>
              <span>{journey.owner}</span>
            </div>
            <p className="footnote">{journey.summary}</p>
            <div className="timeline">
              {journey.steps.map((entry, index) => (
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
        ))}
      </section>

      <section className="panel panel-strong">
        <div className="section-title">
          <h3>Layar Clinical Core</h3>
          <span>Build order yang paling masuk akal</span>
        </div>
        <div className="grid two">
          {clinicalModules.map((module) => (
            <article className="list-item" key={module.name}>
              <strong>{module.name}</strong>
              <p>{module.description}</p>
              <span>{module.screens.join(" | ")}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h3>Klinis yang Perlu Terlihat di UI</h3>
          <span>Bukan cuma form, tapi konteks kerja</span>
        </div>
        <div className="matrix">
          <div className="matrix-row">
            <strong>Context pasien</strong>
            <p>
              Header layar harus selalu menampilkan identitas pasien, nomor
              encounter, unit layanan, penjamin, dan status aktif.
            </p>
          </div>
          <div className="matrix-row">
            <strong>Status perjalanan klinis</strong>
            <p>
              Dokter dan perawat perlu melihat apakah pasien masih triase,
              menunggu hasil, sudah admission, atau siap discharge.
            </p>
          </div>
          <div className="matrix-row">
            <strong>Linked documentation</strong>
            <p>
              Diagnosa, tindakan, order, dan resume medis tidak boleh dibuat
              terpisah tanpa keterkaitan yang jelas.
            </p>
          </div>
          <div className="matrix-row">
            <strong>Hand-off antar unit</strong>
            <p>
              UGD ke ICU, poli ke lab, atau rawat inap ke farmasi harus
              menampilkan status serah terima dan bukti aksi.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
