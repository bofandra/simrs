import { PageShell } from "@/components/page-shell";
import { financeSnapshots } from "@/lib/prototype-data";

const reportExamples = [
  "Kunjungan rawat jalan harian per poli",
  "Volume pasien UGD dan keputusan akhirnya",
  "Admission rawat inap dan mutasi ruang",
  "Order lab, radiologi, dan farmasi per unit",
  "Pasien pulang dan status billing",
  "Pendapatan dasar per unit layanan",
];

export default function FinancePage() {
  return (
    <PageShell
      currentPath="/finance"
      kicker="Finance & Reports"
      title="Billing yang sederhana dulu, tapi harus konsisten dengan layanan klinis."
      intro="Tujuan fase awal bukan membuat sistem tarif paling kompleks. Yang lebih penting adalah memastikan setiap tindakan, order, dan layanan bisa membentuk komponen billing yang jelas dan bisa dibaca kembali lewat laporan."
    >
      <section className="grid two">
        {financeSnapshots.map((snapshot) => (
          <article className="panel" key={snapshot.title}>
            <div className="section-title">
              <h3>{snapshot.title}</h3>
              <span>Finance architecture</span>
            </div>
            <p className="footnote">{snapshot.text}</p>
          </article>
        ))}
      </section>

      <section className="panel panel-strong">
        <div className="section-title">
          <h3>Alur Billing Minimum</h3>
          <span>Yang penting dulu untuk prototipe</span>
        </div>
        <div className="timeline">
          {[
            "Encounter aktif dibuka dari registrasi atau admission",
            "Tindakan, order, resep, dan kamar memunculkan billing item otomatis",
            "Billing header menghitung total, covered amount, dan patient pay amount",
            "Kasir menutup pembayaran pasien umum atau menandai penjamin",
            "Status billing masuk ke laporan harian dan ringkasan unit",
          ].map((item, index) => (
            <div className="timeline-step" key={item}>
              <span className="timeline-badge">{index + 1}</span>
              <div>
                <h4>{item}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h3>Laporan Dasar yang Sudah Layak Ditampilkan</h3>
          <span>Supaya manajemen bisa ikut menguji prototipe</span>
        </div>
        <div className="grid two">
          {reportExamples.map((report) => (
            <article className="list-item" key={report}>
              <strong>{report}</strong>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
