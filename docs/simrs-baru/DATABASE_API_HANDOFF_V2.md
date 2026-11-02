# SIMRS Baru — Database & API Handoff v0.2

**Tanggal:** 2 November 2026  
**Status:** DRAF UNTUK REVIEW 7 PIC + 1 KOORDINATOR. **Belum disetujui PIC/RS.**  
**Scope:** memperdalam kontrak registrasi–pelayanan RJ/IGD/RI dan episode spesialistik HD, rehabilitasi, MCU, bank darah. Peta fitur 68 modul dan blueprint 23 schema/271 tabel adalah baseline, **bukan DDL siap migrasi**.

## A. Arsitektur yang dituju

React + TypeScript → Go modular monolith → PostgreSQL; event/outbox → mapper + validator HL7 FHIR R4 → SATUSEHAT. Dedicated FHIR server tidak digunakan. Hak akses, tenant/organization isolation, audit actor, idempotency, transaction boundaries dan versioning wajib ditentukan sebelum implementasi nyata.

GitHub Pages tetap **HTML/CSS/JavaScript + localStorage**. Layar baru hanya simulasi urutan administratif. **Tidak mengubah Encounter utama, tidak membuat tindakan klinis, tidak mengeluarkan darah, tidak menagih biaya, tidak melakukan grouping/bridging BPJS dan tidak mengirim FHIR.**

## B. Bounded contexts dan canonical entities kandidat

| Context / PIC | Canonical tabel kandidat pada blueprint | Contract utama | FK / integritas yang harus difinalkan |
| --- | --- | --- | --- |
| Patient / PIC 2 | patient.patients, patient.patient_identifiers | patient_id, MRN, NIK/IHS mapping | unique identifier per tenant & identifier system; controlled merge |
| Registration / PIC 2 | scheduling.appointments, scheduling.queue_tickets, encounter.registrations, encounter.encounters | episode/encounter identity | appointment → registration → encounter; no double check-in |
| RME / PIC 3 | clinical.clinical_notes, clinical.diagnoses, clinical.observations, clinical.document_signatures | encounter-scoped documentation | versioned notes; addenda, not overwrite signed notes |
| IGD / PIC 3 | encounter.emergency_triages, encounter.encounters, encounter.admissions, encounter.discharges | triage and disposition | triage encounter FK; dispositions linked to resulting admission/transfer/discharge/referral |
| RI & bed / PIC 2+3 | encounter.admissions, encounter.bed_assignments, encounter.bed_movements, encounter.discharges, master.beds | occupancy timeline | non-overlapping bed occupancy; one current assigned bed per active patient stay |
| Rujukan / PIC 3 | clinical.referrals, clinical.referral_responses, clinical.care_plans | accepted/rejected state | no terminal reversal; Task/ServiceRequest/CarePlan mapping only after validation |
| Hemodialisis / PIC 4 | operations.dialysis_sessions, orders.service_orders, clinical.procedures | request/session record | encounter and service order FK; session chronology and clinical sign-off |
| Rehabilitasi / PIC 4 | operations.rehabilitation_sessions, clinical.care_plans, clinical.procedures | plan/session progress | versioned plan, session and progress evidence |
| MCU / PIC 4 | operations.mcu_packages, operations.mcu_package_items, orders.service_orders, clinical.clinical_documents | package → order → report | package version and report sign-off; source result lineage |
| Bank darah / PIC 4 | operations.blood_units, operations.blood_crossmatches, operations.transfusions | request / compatibility evidence | serial/lot traceability, dual-actor verification, recipient identity, audit; clinical UAT mandatory |
| Charge/claims / PIC 6 | billing.charges, billing.invoices, billing.claims | billable events; claim state | finance posting separate from care state; never infer INA-CBG from charge |
| Platform & audit / PIC 1+7 | identity.tenants, identity.users, audit.change_logs, integration.outbox_events | tenant context & immutable audit | scope + FK + version + idempotency + event delivery guarantees |

**Proposed new tables only if missing in the blueprint:** operations.specialty_episode_events, encounter.care_flow_state_events, operations.specialty_episode_cancellations. These are **candidates**, not part of the 271 canonical-table count until approved. Prefer reusing existing event/activity tables to avoid duplicating records.

## C. State machines and guardrails (target contracts, not clinical SOP)

| Setting | Proposed sequence | Guard at transition | Terminal invariant |
| --- | --- | --- | --- |
| RJ | registration → assessment → documentation review → encounter closure | encounter active; diagnosis + signed note where appropriate | closure only with documented discharge/visit disposition, actor, timestamp |
| IGD | arrival → triage → reassessment → disposition | valid triage provenance; clinical safety rules decided by RS | exactly one current terminal disposition; admit/referral links subsequent episode |
| RI | admission → bed assigned → daily documentation → discharge preparation → discharge | active admission; bed conflict detection; nursing + DPJP sign-off policy | no double-discharge, bed occupancy interval closed once |
| HD | request → schedule → pre-session documentation → session → review | orders, competent actor and treatment evidence | does not imply eligibility or medical clearance |
| Rehab | request → assessment → plan → session → evaluation | plan approval, visit documentation and practitioner scope | no undocumented session completion |
| MCU | registration → package order → results → draft report → approval | result provenance and sign-off | cannot issue official certificate without authorized signature |
| Bank darah | request → sample → compatibility evidence → verification → completion | recipient/unit traceability, independent verification, compatibility validation | no unit release/transfusion without clinically approved SOP and UAT |

**Safety note:** JavaScript demo does **not** implement most production guards in this table. In particular, blood-bank stages are **documentation labels only**, not blood product compatibility or release.

## D. Draft API contract (not implemented)

The machine-readable candidate is [OPENAPI_CARE_SPECIALTY_DRAFT.yaml](./OPENAPI_CARE_SPECIALTY_DRAFT.yaml).

- Use organization/tenant scope from verified identity context, **never** blindly trust client-supplied tenant ID.
- All mutation requests require authenticated actor, role/ABAC, audit metadata, If-Match/version and idempotency key for retries.
- Responses must distinguish 400 malformed, 401 unauthenticated, 403 forbidden, 404 not found or scoped out, 409 state conflict/duplicate/bed conflict, 412 stale version, 422 failed business validation.
- Consistent success envelopes return immutable IDs, version, status and audit references. API writes should use transactional event/outbox where needed.
- GET is safe/idempotent; POST create & transition needs replay protection. Avoid front-end calculating authoritative completion.
- Clinical/legal actions require explicit actor and attestation records, never a bare boolean signed flag.

## E. PIC decision/approval register

| PIC | Required decision before database/API freeze | Draft status |
| --- | --- | --- |
| PIC 1 Core/master | identifiers, tenant scope, bed/unit ownership, auth/roles and audit policy | Pending |
| PIC 2 Patient & Front Office | appointment–registration–encounter relationships, bed assignment semantics, correction/merge | Pending |
| PIC 3 Clinical | RJ/IGD/RI state transitions, triage source, discharge signing, referral/consent | Pending |
| PIC 4 Penunjang | HD, rehab, MCU, blood-bank clinical SOP gates, specimen and result lineage | Pending |
| PIC 5 Farmasi/ops | shared stock/asset movements and links to existing surgical/CSSD/gizi records | Pending |
| PIC 6 Billing/claims | charge event ownership, admission/discharge tariff triggers, BPJS/casemix requirements | Pending |
| PIC 7 Enterprise/integration | audit/outbox, terminology mapping, SATUSEHAT delivery, reporting and alerting | Pending |
| Koordinator | naming conventions, canonical FK, ownership matrix, duplicate table review, migration freeze | Pending |

## F. Acceptance matrix for next implementation

1. **Positive:** RJ assessment/signing, IGD triage/disposition, RI bed assignment/movement/discharge, HD/Rehab/MCU/Blood documentation paths (authorized users only in production).
2. **Negative:** duplicate registration; unsigned closure; missing triage; inactive Encounter; concurrent bed assignment; repeated discharge/disposition; stale version; cross-tenant request; unauthorized operator; aborted specialist episodes; invalid blood-unit/recipient linkage.
3. **Data quality:** FK integrity, timestamps, version history, no duplicated charges, no orphan orders, no missing episode actor/event provenance, no leaking patient data in logs.
4. **Interoperability:** FHIR mapping/profile validation for resources actually sent, outbox retries, dead-letter replay governance, local↔external ID correlation.
5. **UAT:** approval with clinical owner, billing owner, security and RS administrators before any operational activation.

## G. Definition of Done

One module is not "complete" when a navigation card exists. DoD: approved process and SOP, UI forms, OpenAPI, database migration, constraints, tenant/RBAC enforcement, audit/event, tests pos-neg + integration, observability, FHIR mapping if applicable, user acceptance evidence, and named PIC sign-off.

## H. Action plan

- **P0:** PIC 1–3 confirm Encounter core, document signing, patient/bed state and tenant isolation.
- **P1:** PIC 4–6 confirm specialty workflows, order/charge and BPJS dependencies, plus clinical safety gates.
- **P2:** PIC 7 + coordinator finalize outbox, telemetry, release gates, naming freeze and contract versioning.

This document is a reviewed **starting draft**, not a claim that seven PICs have already approved the schema or API.