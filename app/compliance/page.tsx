import { PageShell } from "@/components/page-shell";
import { complianceTracks, coreEntities } from "@/lib/prototype-data";

export default function CompliancePage() {
  return (
    <PageShell
      currentPath="/compliance"
      kicker="Compliance Map"
      title="Arah teknis prototipe harus tetap bisa ditarik ke akreditasi dan regulasi."
      intro="Halaman ini merangkum guardrail compliance yang diambil dari dokumen akreditasi KARS dan regulasi Menkes. Fokusnya adalah menerjemahkan kewajiban itu menjadi keputusan desain data dan keputusan antarmuka."
    >
      <section className="panel">
        <div className="section-title">
          <h3>Compliance Tracks</h3>
          <span>Dari dokumen ke keputusan produk</span>
        </div>
        <div className="grid two">
          {complianceTracks.map((track) => (
            <article className="list-item" key={track.title}>
              <strong>{track.title}</strong>
              <p>{track.description}</p>
              <span>{track.impacts.join(" | ")}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel panel-strong">
        <div className="section-title">
          <h3>Entitas Data Inti</h3>
          <span>Pondasi database sebelum modul lain membesar</span>
        </div>
        <div className="grid two">
          {coreEntities.map((entity) => (
            <article className="list-item" key={entity.name}>
              <strong>{entity.name}</strong>
              <p>{entity.purpose}</p>
              <span>{entity.fields.join(" | ")}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h3>Aturan yang Sebaiknya Dijaga Sejak Awal</h3>
          <span>Kalau ini longgar, prototype akan cepat berantakan</span>
        </div>
        <div className="matrix">
          <div className="matrix-row">
            <strong>Encounter-centric</strong>
            <p>
              Semua transaksi layanan, hasil, obat, billing, dan checklist harus
              kembali ke encounter yang sama.
            </p>
          </div>
          <div className="matrix-row">
            <strong>Actor and timestamp</strong>
            <p>
              Setiap aksi penting wajib menyimpan siapa yang mengubah dan kapan
              perubahan itu terjadi.
            </p>
          </div>
          <div className="matrix-row">
            <strong>Status as data</strong>
            <p>
              Menunggu, diproses, selesai, batal, atau perlu verifikasi bukan
              catatan bebas, tetapi status resmi yang bisa dipakai laporan.
            </p>
          </div>
          <div className="matrix-row">
            <strong>Checklist-ready</strong>
            <p>
              Rekam medis, dokumen pendukung, dan elemen audit perlu punya model
              data yang bisa diperiksa ulang per episode pelayanan.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
