import { PageShell } from "@/components/page-shell";
import {
  complianceTracks,
  dashboardMetrics,
  designPrinciples,
  journeys,
  mvpModules,
  waveTwoModules,
} from "@/lib/prototype-data";

export default function HomePage() {
  return (
    <PageShell
      currentPath="/"
      kicker="Prototype Strategy"
      title="SIMRS yang selaras dengan SOP, akreditasi, dan ritme kerja rumah sakit."
      intro="Starter app ini dibangun sebagai peta kerja pertama: modul yang masuk MVP, skenario pasien yang paling penting, dan prinsip data yang menjaga semua layanan tetap terhubung."
    >
      <section className="stats">
        {dashboardMetrics.map((metric) => (
          <article className="stat-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
          </article>
        ))}
      </section>

      <section className="grid two">
        <article className="panel panel-strong">
          <div className="section-title">
            <h3>Fokus MVP</h3>
            <span>9 modul inti</span>
          </div>
          <div className="card-stack">
            {mvpModules.slice(0, 5).map((module) => (
              <article key={module.name}>
                <div className="eyebrow">{module.category}</div>
                <h4>{module.name}</h4>
                <p>{module.description}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-title">
            <h3>Prinsip Desain</h3>
            <span>Agar prototipe tidak lepas dari operasional</span>
          </div>
          <div className="list">
            {designPrinciples.map((principle) => (
              <div className="list-item" key={principle}>
                <strong>{principle}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-title">
          <h3>Tiga Skenario Prioritas</h3>
          <span>Jalur yang paling cepat memvalidasi prototipe</span>
        </div>
        <div className="grid three">
          {journeys.map((journey) => (
            <article className="list-item" key={journey.slug}>
              <strong>{journey.title}</strong>
              <span>{journey.owner}</span>
              <p>{journey.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid two">
        <article className="panel">
          <div className="section-title">
            <h3>Roadmap Modul</h3>
            <span>MVP dulu, baru gelombang lanjutan</span>
          </div>
          <div className="card-stack">
            {mvpModules.map((module) => (
              <article key={module.name}>
                <div className="eyebrow">{module.category}</div>
                <h4>{module.name}</h4>
                <p>{module.description}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-title">
            <h3>Wave 2</h3>
            <span>Sesudah clinical core stabil</span>
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
          <h3>Compliance Guardrail</h3>
          <span>Agar prototype-ready juga audit-ready</span>
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
    </PageShell>
  );
}
