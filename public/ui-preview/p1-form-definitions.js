/* 17 P1 UI prototypes — local demo data only; field concepts subject to PRD/DTO/DB review. */
(function(){
 "use strict";
 var catalog=window.SIMRS_FORM_CATALOG;
 if(!Array.isArray(catalog))throw new Error("Load p0-form-catalog.js before p1-form-definitions.js");
 var updates=[
  {
    "code": "CORE-11",
    "fields": [
      {
        "key": "queue_number",
        "label": "Nomor antrean demo",
        "type": "text",
        "required": true
      },
      {
        "key": "queue_type",
        "label": "Jenis antrean",
        "type": "select",
        "required": true,
        "options": [
          "Poli",
          "IGD",
          "Farmasi",
          "Laboratorium"
        ]
      },
      {
        "key": "patient_ref",
        "label": "No. RM demo",
        "type": "text",
        "required": true
      },
      {
        "key": "service_unit",
        "label": "Unit layanan",
        "type": "select",
        "required": true,
        "options": [
          "Poli Umum",
          "Penyakit Dalam",
          "Jantung",
          "IGD",
          "Farmasi",
          "Laboratorium"
        ]
      },
      {
        "key": "called_at",
        "label": "Waktu pemanggilan",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "queue_state",
        "label": "Status antrean",
        "type": "select",
        "required": true,
        "options": [
          "Menunggu",
          "Dipanggil",
          "Ditunda",
          "Selesai (simulasi)"
        ]
      },
      {
        "key": "queue_reason",
        "label": "Catatan petugas",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Pendaftaran"
    ],
    "wf": [
      "WF-01"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "RME-09",
    "fields": [
      {
        "key": "care_plan_code",
        "label": "ID care plan demo",
        "type": "text",
        "required": true
      },
      {
        "key": "responsible_clinician",
        "label": "DPJP",
        "type": "text",
        "required": true
      },
      {
        "key": "goal_category",
        "label": "Tujuan asuhan",
        "type": "select",
        "required": true,
        "options": [
          "Stabilisasi",
          "Pemulihan",
          "Pencegahan komplikasi",
          "Rehabilitasi"
        ]
      },
      {
        "key": "clinical_goal",
        "label": "Tujuan dan target klinis",
        "type": "textarea",
        "required": true
      },
      {
        "key": "intervention_plan",
        "label": "Rencana intervensi",
        "type": "textarea",
        "required": true
      },
      {
        "key": "care_team",
        "label": "Anggota tim asuhan",
        "type": "text",
        "required": true
      },
      {
        "key": "review_date",
        "label": "Jadwal evaluasi",
        "type": "date",
        "required": true
      }
    ],
    "roles": [
      "DPJP Rawat Inap",
      "Dokter RJ"
    ],
    "wf": [
      "WF-02"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "RME-10",
    "fields": [
      {
        "key": "referral_type",
        "label": "Jenis rujukan",
        "type": "select",
        "required": true,
        "options": [
          "Internal",
          "Eksternal"
        ]
      },
      {
        "key": "destination",
        "label": "Unit / fasyankes tujuan",
        "type": "text",
        "required": true
      },
      {
        "key": "referral_reason_code",
        "label": "Kode alasan rujukan",
        "type": "text",
        "required": true
      },
      {
        "key": "clinical_summary",
        "label": "Ringkasan klinis",
        "type": "textarea",
        "required": true
      },
      {
        "key": "priority",
        "label": "Prioritas",
        "type": "select",
        "required": true,
        "options": [
          "Rutin",
          "Segera",
          "Darurat"
        ]
      },
      {
        "key": "handover_state",
        "label": "Status handover demo",
        "type": "select",
        "required": true,
        "options": [
          "Draft",
          "Menunggu tanggapan",
          "Perlu tindak lanjut"
        ]
      },
      {
        "key": "requested_at",
        "label": "Waktu permintaan",
        "type": "datetime-local",
        "required": true
      }
    ],
    "roles": [
      "Dokter RJ",
      "DPJP Rawat Inap"
    ],
    "wf": [
      "WF-02"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "MED-06",
    "fields": [
      {
        "key": "surgery_case",
        "label": "ID kasus operasi demo",
        "type": "text",
        "required": true
      },
      {
        "key": "procedure_code",
        "label": "Kode tindakan demo",
        "type": "text",
        "required": true
      },
      {
        "key": "surgeon",
        "label": "Operator utama",
        "type": "text",
        "required": true
      },
      {
        "key": "scheduled_start",
        "label": "Mulai jadwal",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "scheduled_end",
        "label": "Selesai jadwal",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "operating_room",
        "label": "Ruang operasi",
        "type": "text",
        "required": true
      },
      {
        "key": "checklist_state",
        "label": "Checklist keselamatan",
        "type": "select",
        "required": true,
        "options": [
          "Belum dilakukan",
          "Pra-operasi ditinjau (demo)"
        ]
      },
      {
        "key": "surgical_plan",
        "label": "Rencana operasi",
        "type": "textarea",
        "required": true
      }
    ],
    "roles": [
      "Koordinator OK",
      "DPJP Rawat Inap"
    ],
    "wf": [
      "WF-10"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "MED-07",
    "fields": [
      {
        "key": "surgery_case_ref",
        "label": "Referensi kasus operasi demo",
        "type": "text",
        "required": true
      },
      {
        "key": "anesthesiologist",
        "label": "Dokter anestesi",
        "type": "text",
        "required": true
      },
      {
        "key": "asa_class",
        "label": "Klasifikasi ASA",
        "type": "select",
        "required": true,
        "options": [
          "I",
          "II",
          "III",
          "IV",
          "V"
        ]
      },
      {
        "key": "anesthesia_type",
        "label": "Jenis anestesi",
        "type": "select",
        "required": true,
        "options": [
          "Umum",
          "Regional",
          "Lokal",
          "Sedasi"
        ]
      },
      {
        "key": "induction_at",
        "label": "Waktu induksi",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "monitoring_summary",
        "label": "Monitoring anestesi",
        "type": "textarea",
        "required": true
      },
      {
        "key": "recovery_state",
        "label": "Status recovery",
        "type": "select",
        "required": true,
        "options": [
          "Monitoring",
          "Perlu observasi lanjutan",
          "Siap review (demo)"
        ]
      }
    ],
    "roles": [
      "Dokter Anestesi"
    ],
    "wf": [
      "WF-10"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "ENT-04",
    "fields": [
      {
        "key": "pathway_code",
        "label": "Kode clinical pathway",
        "type": "text",
        "required": true
      },
      {
        "key": "enrollment_ref",
        "label": "Nomor enrollment demo",
        "type": "text",
        "required": true
      },
      {
        "key": "diagnosis_code",
        "label": "Diagnosis terkait",
        "type": "text",
        "required": true
      },
      {
        "key": "pathway_start",
        "label": "Mulai pathway",
        "type": "date",
        "required": true
      },
      {
        "key": "step_state",
        "label": "Status langkah",
        "type": "select",
        "required": true,
        "options": [
          "Belum dimulai",
          "Dalam proses",
          "Bukti lengkap (demo)"
        ]
      },
      {
        "key": "step_evidence",
        "label": "Bukti pelaksanaan langkah",
        "type": "textarea",
        "required": true
      },
      {
        "key": "variance_reason",
        "label": "Alasan deviasi",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "DPJP Rawat Inap",
      "Manajemen RS"
    ],
    "wf": [
      "WF-02"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "MED-02",
    "fields": [
      {
        "key": "order_reference",
        "label": "ID order layanan demo",
        "type": "text",
        "required": true
      },
      {
        "key": "exam_code",
        "label": "Jenis pemeriksaan",
        "type": "select",
        "required": true,
        "options": [
          "XR-CHEST — Foto thorax",
          "CT-HEAD — CT kepala",
          "US-ABD — USG abdomen",
          "MRI-BRAIN — MRI otak"
        ]
      },
      {
        "key": "priority",
        "label": "Prioritas",
        "type": "select",
        "required": true,
        "options": [
          "Rutin",
          "Segera",
          "CITO"
        ]
      },
      {
        "key": "radiographer",
        "label": "Petugas radiografer",
        "type": "text",
        "required": true
      },
      {
        "key": "exam_at",
        "label": "Waktu pemeriksaan",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "study_state",
        "label": "Status pemeriksaan",
        "type": "select",
        "required": true,
        "options": [
          "Terjadwal",
          "Akuisisi (demo)",
          "Menunggu ekspertise"
        ]
      },
      {
        "key": "finding_note",
        "label": "Catatan temuan",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Radiografer",
      "Radiolog"
    ],
    "wf": [
      "WF-06"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "MED-03",
    "fields": [
      {
        "key": "study_uid_demo",
        "label": "Study UID sintetis",
        "type": "text",
        "required": true
      },
      {
        "key": "order_reference",
        "label": "Referensi order RIS",
        "type": "text",
        "required": true
      },
      {
        "key": "modality",
        "label": "Modalitas",
        "type": "select",
        "required": true,
        "options": [
          "DX",
          "CT",
          "MR",
          "US",
          "CR"
        ]
      },
      {
        "key": "instance_count",
        "label": "Jumlah instance",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "acquired_at",
        "label": "Waktu akuisisi",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "access_state",
        "label": "Hak akses viewer demo",
        "type": "select",
        "required": true,
        "options": [
          "Perlu verifikasi",
          "Viewer demo berizin"
        ]
      },
      {
        "key": "study_note",
        "label": "Catatan pemeriksaan",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Radiolog",
      "Dokter RJ"
    ],
    "wf": [
      "WF-06"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "MED-11",
    "fields": [
      {
        "key": "nutrition_assessor",
        "label": "Ahli gizi",
        "type": "text",
        "required": true
      },
      {
        "key": "assessed_at",
        "label": "Waktu asesmen",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "nutrition_risk",
        "label": "Risiko malnutrisi",
        "type": "select",
        "required": true,
        "options": [
          "Rendah",
          "Sedang",
          "Tinggi"
        ]
      },
      {
        "key": "diet_type",
        "label": "Jenis diet",
        "type": "select",
        "required": true,
        "options": [
          "Biasa",
          "Lunak",
          "Rendah garam",
          "Diabetes",
          "Enteral"
        ]
      },
      {
        "key": "calorie_target",
        "label": "Target energi (kkal/hari)",
        "type": "number",
        "required": true,
        "min": 200,
        "max": 7000
      },
      {
        "key": "allergy_diet_review",
        "label": "Alergi / pantangan",
        "type": "select",
        "required": true,
        "options": [
          "Belum ditinjau",
          "Sudah ditinjau"
        ]
      },
      {
        "key": "diet_instruction",
        "label": "Instruksi diet",
        "type": "textarea",
        "required": true
      }
    ],
    "roles": [
      "Ahli Gizi"
    ],
    "wf": [
      "WF-11"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "OPS-03",
    "fields": [
      {
        "key": "instrument_set",
        "label": "Kode set instrumen",
        "type": "text",
        "required": true
      },
      {
        "key": "cycle_number",
        "label": "Nomor siklus demo",
        "type": "text",
        "required": true
      },
      {
        "key": "sterilization_method",
        "label": "Metode sterilisasi",
        "type": "select",
        "required": true,
        "options": [
          "Autoklaf",
          "Plasma",
          "Etilen oksida"
        ]
      },
      {
        "key": "cycle_started",
        "label": "Mulai siklus",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "cycle_finished",
        "label": "Akhir siklus",
        "type": "datetime-local",
        "required": false
      },
      {
        "key": "cycle_result",
        "label": "Indikator hasil",
        "type": "select",
        "required": true,
        "options": [
          "Belum dinilai",
          "Lulus simulasi",
          "Tidak lulus simulasi"
        ]
      },
      {
        "key": "operator",
        "label": "Operator CSSD",
        "type": "text",
        "required": true
      },
      {
        "key": "quality_notes",
        "label": "Catatan indikator biologis/kimia",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Petugas CSSD"
    ],
    "wf": [
      "WF-10"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "OPS-05",
    "fields": [
      {
        "key": "kitchen_batch",
        "label": "ID batch dapur demo",
        "type": "text",
        "required": true
      },
      {
        "key": "diet_order_reference",
        "label": "Referensi diet order demo",
        "type": "text",
        "required": true
      },
      {
        "key": "meal_time",
        "label": "Waktu makan",
        "type": "select",
        "required": true,
        "options": [
          "Pagi",
          "Siang",
          "Malam",
          "Snack"
        ]
      },
      {
        "key": "diet_type",
        "label": "Menu diet",
        "type": "select",
        "required": true,
        "options": [
          "Biasa",
          "Lunak",
          "Rendah garam",
          "Diabetes",
          "Enteral"
        ]
      },
      {
        "key": "tray_count",
        "label": "Jumlah tray rencana",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "key": "production_date",
        "label": "Tanggal produksi",
        "type": "date",
        "required": true
      },
      {
        "key": "kitchen_state",
        "label": "Status proses",
        "type": "select",
        "required": true,
        "options": [
          "Direncanakan",
          "Persiapan (demo)",
          "Tertunda"
        ]
      },
      {
        "key": "handover_note",
        "label": "Catatan distribusi",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Petugas Dapur"
    ],
    "wf": [
      "WF-11"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "FIN-05",
    "fields": [
      {
        "key": "patient_ref",
        "label": "No. RM demo",
        "type": "text",
        "required": true
      },
      {
        "key": "policy_no",
        "label": "No. kepesertaan sintetis",
        "type": "text",
        "required": true
      },
      {
        "key": "referral_reference",
        "label": "No. rujukan sintetis",
        "type": "text",
        "required": false
      },
      {
        "key": "control_date",
        "label": "Tanggal kontrol",
        "type": "date",
        "required": true
      },
      {
        "key": "request_type",
        "label": "Jenis permintaan",
        "type": "select",
        "required": true,
        "options": [
          "SEP (rencana)",
          "Surat kontrol (rencana)",
          "Sinkronisasi (simulasi)"
        ]
      },
      {
        "key": "bpjs_state",
        "label": "Status partner (demo)",
        "type": "select",
        "required": true,
        "options": [
          "Belum dikirim",
          "Pending (simulasi)",
          "Ditolak (simulasi)"
        ]
      },
      {
        "key": "partner_message",
        "label": "Pesan partner sintetis",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Petugas BPJS"
    ],
    "wf": [
      "WF-08"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "FIN-06",
    "fields": [
      {
        "key": "episode_ref",
        "label": "Encounter demo",
        "type": "text",
        "required": true
      },
      {
        "key": "primary_diagnosis",
        "label": "Kode diagnosis utama",
        "type": "text",
        "required": true
      },
      {
        "key": "secondary_diagnoses",
        "label": "Kode diagnosis penyerta",
        "type": "text",
        "required": false
      },
      {
        "key": "procedure_codes",
        "label": "Kode prosedur",
        "type": "text",
        "required": false
      },
      {
        "key": "clinical_documents_state",
        "label": "Dokumen klinis",
        "type": "select",
        "required": true,
        "options": [
          "Belum ditinjau",
          "Butuh tanda tangan",
          "Lengkap untuk simulasi"
        ]
      },
      {
        "key": "grouping_state",
        "label": "Status grouping",
        "type": "select",
        "required": true,
        "options": [
          "Belum dilakukan",
          "Draft simulasi",
          "Perlu koreksi"
        ]
      },
      {
        "key": "coder_note",
        "label": "Catatan coder",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Coder",
      "Casemix"
    ],
    "wf": [
      "WF-08"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "FIN-07",
    "fields": [
      {
        "key": "claim_reference",
        "label": "ID klaim sintetis",
        "type": "text",
        "required": true
      },
      {
        "key": "invoice_reference",
        "label": "No. invoice demo",
        "type": "text",
        "required": true
      },
      {
        "key": "claim_payer",
        "label": "Penjamin",
        "type": "select",
        "required": true,
        "options": [
          "BPJS (demo)",
          "Asuransi (demo)"
        ]
      },
      {
        "key": "claim_amount",
        "label": "Jumlah klaim rencana (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "dossier_check",
        "label": "Status kelengkapan berkas",
        "type": "select",
        "required": true,
        "options": [
          "Belum lengkap",
          "Lengkap untuk simulasi"
        ]
      },
      {
        "key": "claim_state",
        "label": "Status klaim",
        "type": "select",
        "required": true,
        "options": [
          "Draft",
          "Butuh review",
          "Menunggu dokumen"
        ]
      },
      {
        "key": "rejection_note",
        "label": "Koreksi / alasan penolakan",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Casemix"
    ],
    "wf": [
      "WF-08"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "ENT-06",
    "fields": [
      {
        "key": "incident_id",
        "label": "ID insiden demo",
        "type": "text",
        "required": true
      },
      {
        "key": "incident_date",
        "label": "Tanggal insiden",
        "type": "date",
        "required": true
      },
      {
        "key": "incident_type",
        "label": "Jenis kejadian",
        "type": "select",
        "required": true,
        "options": [
          "Near miss",
          "Kejadian tidak diharapkan",
          "Kejadian sentinel (demo)",
          "Lainnya"
        ]
      },
      {
        "key": "severity",
        "label": "Tingkat dampak",
        "type": "select",
        "required": true,
        "options": [
          "Tanpa cedera",
          "Ringan",
          "Sedang",
          "Berat"
        ]
      },
      {
        "key": "unit",
        "label": "Unit kejadian",
        "type": "text",
        "required": true
      },
      {
        "key": "incident_description",
        "label": "Kronologi tanpa identitas pasien asli",
        "type": "textarea",
        "required": true
      },
      {
        "key": "immediate_action",
        "label": "Tindakan awal",
        "type": "textarea",
        "required": true
      },
      {
        "key": "review_state",
        "label": "Status RCA",
        "type": "select",
        "required": true,
        "options": [
          "Belum ditinjau",
          "Dalam review (demo)",
          "Tindak lanjut (demo)"
        ]
      }
    ],
    "roles": [
      "Tim Mutu"
    ],
    "wf": [
      "WF-12"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "ENT-08",
    "fields": [
      {
        "key": "indicator_code",
        "label": "Kode indikator",
        "type": "text",
        "required": true
      },
      {
        "key": "indicator_version",
        "label": "Versi definisi",
        "type": "text",
        "required": true
      },
      {
        "key": "period_start",
        "label": "Periode mulai",
        "type": "date",
        "required": true
      },
      {
        "key": "period_end",
        "label": "Periode selesai",
        "type": "date",
        "required": true
      },
      {
        "key": "numerator",
        "label": "Pembilang",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "denominator",
        "label": "Penyebut",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "key": "data_quality",
        "label": "Kualitas data",
        "type": "select",
        "required": true,
        "options": [
          "Perlu verifikasi",
          "Terperiksa (demo)"
        ]
      },
      {
        "key": "indicator_note",
        "label": "Catatan sumber data",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Tim Mutu"
    ],
    "wf": [
      "WF-12"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "ENT-09",
    "fields": [
      {
        "key": "report_code",
        "label": "Kode laporan",
        "type": "text",
        "required": true
      },
      {
        "key": "report_name",
        "label": "Nama laporan",
        "type": "text",
        "required": true
      },
      {
        "key": "report_type",
        "label": "Jenis laporan",
        "type": "select",
        "required": true,
        "options": [
          "Internal operasional",
          "RL (draft)",
          "Indikator manajemen"
        ]
      },
      {
        "key": "period_start",
        "label": "Periode mulai",
        "type": "date",
        "required": true
      },
      {
        "key": "period_end",
        "label": "Periode selesai",
        "type": "date",
        "required": true
      },
      {
        "key": "definition_version",
        "label": "Versi definisi",
        "type": "text",
        "required": true
      },
      {
        "key": "validation_state",
        "label": "Status validasi",
        "type": "select",
        "required": true,
        "options": [
          "Draft",
          "Perlu review",
          "Tervalidasi secara simulasi"
        ]
      },
      {
        "key": "report_notes",
        "label": "Catatan kelengkapan data",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Manajemen RS",
      "Tim Mutu"
    ],
    "wf": [
      "WF-12"
    ],
    "patient_context": false,
    "safety_gate": true
  }
];
 updates.forEach(function(u){var m=catalog.find(function(x){return x.code===u.code;});if(!m)throw new Error("Unknown P1 module "+u.code);Object.assign(m,u);});
})();
