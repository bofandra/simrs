import { PageShell } from "@/components/page-shell";
import { supportQueues, waveTwoModules } from "@/lib/prototype-data";

export default function OperationsPage() {
  return (
    <PageShell
      currentPath="/operations"
      kicker="Support Operations"
      title="Lab, radiologi, farmasi, dan bed board perlu punya ritme layar yang tajam."
      intro="Support operations adalah tempat prototipe sering gagal terasa realistis. Karena itu, halaman ini menyorot work queue, status order, serta koordinasi antar unit yang harus terlihat jelas di antarmuka."
    >
      <section className="panel">
        <div className="section-title">
          <h3>Work Queue per Unit</h3>
          <span>Prioritas, status, dan konteks pasien harus selalu terbaca</span>
        </div>
        <div className="grid three">
          {supportQueues.map((lane) => (
            <article className="list-item" key={lane.title}>
              <strong>{lane.title}</strong>
              <p>{lane.description}</p>
              <span>{lane.items.join(" | ")}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="grid two">
        <article className="panel panel-strong">
          <div className="section-title">
            <h3>Bed & Room Logic</h3>
            <span>Rawat inap tidak bisa jalan tanpa ini</span>
          </div>
          <div className="card-stack">
            <article>
              <h4>Room placement</h4>
              <p>
                Admission perlu melihat kelas perawatan, unit, dan ketersediaan
                bed secara langsung agar handover UGD berjalan cepat.
              </p>
            </article>
            <article>
              <h4>Mutasi ruang</h4>
              <p>
                Perpindahan pasien antar ruang harus tersimpan sebagai histori,
                bukan sekadar mengganti room saat ini.
              </p>
            </article>
            <article>
              <h4>Status pasien ranap</h4>
              <p>
                Aktif, menunggu pulang, transit ICU, atau selesai discharge perlu
                terlihat supaya unit klinis dan administrasi membaca konteks yang sama.
              </p>
            </article>
          </div>
        </article>

        <article className="panel">
          <div className="section-title">
            <h3>Wave 2 Operational Modules</h3>
            <span>Setelah core flow mapan</span>
          </div>
          <div className="card-stack">
            {waveTwoModules.map((module) => (
              <article key={module.name}>
                <div className="eyebrow">{module.category}</div>
                <h4>{module.name}</h4>
                <p>{module.description}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-title">
          <h3>Checklist Desain Support Unit</h3>
          <span>Supaya tidak jatuh menjadi daftar tabel biasa</span>
        </div>
        <div className="matrix">
          <div className="matrix-row">
            <strong>Queue first</strong>
            <p>
              Layar utama unit penunjang sebaiknya langsung berupa antrean kerja
              dengan prioritas, SLA, dan status pemrosesan.
            </p>
          </div>
          <div className="matrix-row">
            <strong>One-click status</strong>
            <p>
              Status seperti diterima, diproses, menunggu validasi, dan selesai
              harus mudah diubah tanpa membuka form panjang.
            </p>
          </div>
          <div className="matrix-row">
            <strong>Trace back ke encounter</strong>
            <p>
              Tiap hasil, resep, atau mutasi bed harus selalu bisa ditelusuri
              balik ke encounter dan pasien induknya.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
