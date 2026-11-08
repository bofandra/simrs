/* P2/P3 exploratory UI mockup forms. Zero backend actions. */
(function(){
"use strict";
var catalog=window.SIMRS_FORM_CATALOG;
if(!Array.isArray(catalog))throw new Error("Base form catalog not initialized");
var specs=[
  {
    "code": "RME-12",
    "fields": [
      {
        "key": "patient_ref",
        "label": "Pasien demo",
        "type": "text",
        "required": true
      },
      {
        "key": "proxy_type",
        "label": "Jenis akses",
        "type": "select",
        "required": true,
        "options": [
          "Pasien sendiri (demo)",
          "Wali / pendamping (demo)"
        ]
      },
      {
        "key": "document_type",
        "label": "Informasi yang diminta",
        "type": "select",
        "required": true,
        "options": [
          "Jadwal",
          "Dokumen hasil",
          "Resume kunjungan"
        ]
      },
      {
        "key": "release_check",
        "label": "Status release/consent",
        "type": "select",
        "required": true,
        "options": [
          "Belum diverifikasi",
          "Memerlukan verifikasi petugas"
        ]
      },
      {
        "key": "request_date",
        "label": "Tanggal permintaan",
        "type": "date",
        "required": true
      },
      {
        "key": "access_reason",
        "label": "Tujuan akses",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Pasien Demo"
    ],
    "wf": [
      "WF-01"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "MED-08",
    "fields": [
      {
        "key": "session_code",
        "label": "ID sesi dialisis demo",
        "type": "text",
        "required": true
      },
      {
        "key": "machine_code",
        "label": "Kode mesin",
        "type": "text",
        "required": true
      },
      {
        "key": "nurse",
        "label": "Perawat",
        "type": "text",
        "required": true
      },
      {
        "key": "session_start",
        "label": "Mulai sesi",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "session_end",
        "label": "Selesai sesi",
        "type": "datetime-local",
        "required": false
      },
      {
        "key": "flow_rate",
        "label": "Laju aliran contoh (mL/menit)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "session_state",
        "label": "Status sesi",
        "type": "select",
        "required": true,
        "options": [
          "Perencanaan",
          "Monitoring (simulasi)",
          "Perlu review"
        ]
      },
      {
        "key": "complication_note",
        "label": "Catatan kejadian",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Perawat HD"
    ],
    "wf": [
      "WF-02"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "MED-09",
    "fields": [
      {
        "key": "therapy_plan",
        "label": "Kode rencana rehabilitasi",
        "type": "text",
        "required": true
      },
      {
        "key": "therapist",
        "label": "Terapis",
        "type": "text",
        "required": true
      },
      {
        "key": "session_date",
        "label": "Tanggal sesi",
        "type": "date",
        "required": true
      },
      {
        "key": "therapy_type",
        "label": "Jenis layanan",
        "type": "select",
        "required": true,
        "options": [
          "Fisioterapi",
          "Terapi okupasi",
          "Terapi wicara",
          "Rehabilitasi lainnya"
        ]
      },
      {
        "key": "functional_goal",
        "label": "Target fungsional",
        "type": "textarea",
        "required": true
      },
      {
        "key": "intervention",
        "label": "Program sesi",
        "type": "textarea",
        "required": true
      },
      {
        "key": "session_state",
        "label": "Status sesi",
        "type": "select",
        "required": true,
        "options": [
          "Rencana",
          "Selesai simulasi",
          "Butuh evaluasi"
        ]
      }
    ],
    "roles": [
      "Terapis Rehabilitasi"
    ],
    "wf": [
      "WF-02"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "MED-10",
    "fields": [
      {
        "key": "package_code",
        "label": "Kode paket MCU",
        "type": "text",
        "required": true
      },
      {
        "key": "participant_ref",
        "label": "ID peserta sintetis",
        "type": "text",
        "required": true
      },
      {
        "key": "checkup_group",
        "label": "Kelompok MCU",
        "type": "select",
        "required": true,
        "options": [
          "Individu",
          "Perusahaan",
          "Pre-employment"
        ]
      },
      {
        "key": "mcu_date",
        "label": "Tanggal MCU",
        "type": "date",
        "required": true
      },
      {
        "key": "exam_catalog",
        "label": "Katalog pemeriksaan demo",
        "type": "text",
        "required": true
      },
      {
        "key": "completion_state",
        "label": "Kelengkapan",
        "type": "select",
        "required": true,
        "options": [
          "Dalam proses",
          "Perlu pemeriksaan",
          "Lengkap untuk simulasi"
        ]
      },
      {
        "key": "conclusion_note",
        "label": "Catatan kesimpulan",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Koordinator MCU",
      "Petugas MCU"
    ],
    "wf": [
      "WF-13"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "MED-12",
    "fields": [
      {
        "key": "request_reference",
        "label": "Nomor permintaan darah demo",
        "type": "text",
        "required": true
      },
      {
        "key": "blood_group",
        "label": "Golongan darah",
        "type": "select",
        "required": true,
        "options": [
          "A",
          "B",
          "AB",
          "O"
        ]
      },
      {
        "key": "rhesus",
        "label": "Rhesus",
        "type": "select",
        "required": true,
        "options": [
          "Positif",
          "Negatif"
        ]
      },
      {
        "key": "unit_code",
        "label": "Kode kantong darah sintetis",
        "type": "text",
        "required": true
      },
      {
        "key": "crossmatch_state",
        "label": "Status crossmatch",
        "type": "select",
        "required": true,
        "options": [
          "Belum dilakukan",
          "Hasil dicatat (demo)",
          "Perlu peninjauan"
        ]
      },
      {
        "key": "planned_at",
        "label": "Waktu pemberian terencana",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "double_check",
        "label": "Double-check identitas",
        "type": "select",
        "required": true,
        "options": [
          "Belum diperiksa",
          "Diperiksa secara simulasi"
        ]
      },
      {
        "key": "transfusion_note",
        "label": "Catatan tindakan",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Petugas Bank Darah",
      "Dokter RJ"
    ],
    "wf": [
      "WF-02"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "OPS-02",
    "fields": [
      {
        "key": "purchase_req",
        "label": "Nomor PR sintetis",
        "type": "text",
        "required": true
      },
      {
        "key": "supplier_code",
        "label": "Kode pemasok demo",
        "type": "text",
        "required": true
      },
      {
        "key": "procurement_stage",
        "label": "Tahap pengadaan",
        "type": "select",
        "required": true,
        "options": [
          "Permintaan (draft)",
          "RFQ (draft)",
          "PO (draft)",
          "Penerimaan (draft)"
        ]
      },
      {
        "key": "item_code",
        "label": "Kode barang",
        "type": "text",
        "required": true
      },
      {
        "key": "quantity",
        "label": "Jumlah permintaan",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "key": "unit_price",
        "label": "Harga satuan rencana (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "needed_by",
        "label": "Dibutuhkan pada",
        "type": "date",
        "required": true
      },
      {
        "key": "justification",
        "label": "Dasar kebutuhan",
        "type": "textarea",
        "required": true
      }
    ],
    "roles": [
      "Pengadaan"
    ],
    "wf": [
      "WF-09"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "OPS-04",
    "fields": [
      {
        "key": "linen_batch",
        "label": "Kode batch linen",
        "type": "text",
        "required": true
      },
      {
        "key": "unit_from",
        "label": "Unit asal",
        "type": "text",
        "required": true
      },
      {
        "key": "linen_type",
        "label": "Jenis linen",
        "type": "select",
        "required": true,
        "options": [
          "Sprei",
          "Sarung bantal",
          "Handuk",
          "Selimut",
          "Lainnya"
        ]
      },
      {
        "key": "received_count",
        "label": "Jumlah diterima",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "processed_count",
        "label": "Jumlah diproses",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "difference_count",
        "label": "Selisih (draft)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "cycle_state",
        "label": "Status siklus",
        "type": "select",
        "required": true,
        "options": [
          "Diterima",
          "Cuci (demo)",
          "Inspeksi (demo)",
          "Investigasi selisih"
        ]
      },
      {
        "key": "difference_reason",
        "label": "Alasan selisih",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Petugas Laundry"
    ],
    "wf": [
      "WF-09"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "FIN-08",
    "fields": [
      {
        "key": "journal_reference",
        "label": "No. jurnal draft",
        "type": "text",
        "required": true
      },
      {
        "key": "journal_date",
        "label": "Tanggal jurnal",
        "type": "date",
        "required": true
      },
      {
        "key": "account_debit",
        "label": "Akun debit",
        "type": "text",
        "required": true
      },
      {
        "key": "account_credit",
        "label": "Akun kredit",
        "type": "text",
        "required": true
      },
      {
        "key": "debit_total",
        "label": "Total debit (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "credit_total",
        "label": "Total kredit (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "journal_state",
        "label": "Status jurnal",
        "type": "select",
        "required": true,
        "options": [
          "Draft",
          "Perlu review"
        ]
      },
      {
        "key": "journal_description",
        "label": "Keterangan",
        "type": "textarea",
        "required": true
      }
    ],
    "roles": [
      "Akuntan"
    ],
    "wf": [
      "WF-08"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "FIN-09",
    "fields": [
      {
        "key": "document_ref",
        "label": "Referensi AP/AR",
        "type": "text",
        "required": true
      },
      {
        "key": "ledger_type",
        "label": "Jenis buku",
        "type": "select",
        "required": true,
        "options": [
          "Utang (AP)",
          "Piutang (AR)"
        ]
      },
      {
        "key": "counterparty",
        "label": "Kode pihak lawan",
        "type": "text",
        "required": true
      },
      {
        "key": "document_amount",
        "label": "Jumlah (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "document_date",
        "label": "Tanggal dokumen",
        "type": "date",
        "required": true
      },
      {
        "key": "due_date",
        "label": "Jatuh tempo",
        "type": "date",
        "required": true
      },
      {
        "key": "reconcile_state",
        "label": "Status rekonsiliasi",
        "type": "select",
        "required": true,
        "options": [
          "Belum dicocokkan",
          "Perlu review",
          "Cocok simulasi"
        ]
      }
    ],
    "roles": [
      "Akuntan"
    ],
    "wf": [
      "WF-08"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "FIN-10",
    "fields": [
      {
        "key": "budget_version",
        "label": "Versi anggaran",
        "type": "text",
        "required": true
      },
      {
        "key": "cost_center",
        "label": "Pusat biaya",
        "type": "text",
        "required": true
      },
      {
        "key": "account_code",
        "label": "Kode akun",
        "type": "text",
        "required": true
      },
      {
        "key": "allocated_amount",
        "label": "Alokasi (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "effective_from",
        "label": "Awal periode",
        "type": "date",
        "required": true
      },
      {
        "key": "effective_until",
        "label": "Akhir periode",
        "type": "date",
        "required": true
      },
      {
        "key": "budget_state",
        "label": "Status anggaran",
        "type": "select",
        "required": true,
        "options": [
          "Rancangan",
          "Dalam review",
          "Disetujui simulasi"
        ]
      },
      {
        "key": "budget_assumptions",
        "label": "Asumsi anggaran",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Budget Owner"
    ],
    "wf": [
      "WF-08"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "FIN-11",
    "fields": [
      {
        "key": "cost_profile_code",
        "label": "Kode profil biaya",
        "type": "text",
        "required": true
      },
      {
        "key": "service_code",
        "label": "Kode layanan",
        "type": "text",
        "required": true
      },
      {
        "key": "costing_method",
        "label": "Metode costing",
        "type": "select",
        "required": true,
        "options": [
          "Direct cost",
          "Activity-based costing",
          "Alokasi biaya"
        ]
      },
      {
        "key": "total_cost",
        "label": "Total biaya (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "volume",
        "label": "Volume driver",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "key": "unit_cost",
        "label": "Biaya per unit (Rp)",
        "type": "number",
        "required": false,
        "min": 0
      },
      {
        "key": "calculation_date",
        "label": "Tanggal perhitungan",
        "type": "date",
        "required": true
      },
      {
        "key": "assumptions",
        "label": "Asumsi driver",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Analis Biaya"
    ],
    "wf": [
      "WF-08"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "OPS-06",
    "fields": [
      {
        "key": "asset_code",
        "label": "Kode aset",
        "type": "text",
        "required": true
      },
      {
        "key": "asset_name",
        "label": "Nama aset",
        "type": "text",
        "required": true
      },
      {
        "key": "asset_group",
        "label": "Kelompok aset",
        "type": "select",
        "required": true,
        "options": [
          "Alat medis",
          "IT",
          "Bangunan",
          "Transportasi",
          "Fasilitas"
        ]
      },
      {
        "key": "location",
        "label": "Lokasi aset",
        "type": "text",
        "required": true
      },
      {
        "key": "acquired_date",
        "label": "Tanggal perolehan",
        "type": "date",
        "required": true
      },
      {
        "key": "asset_state",
        "label": "Status aset",
        "type": "select",
        "required": true,
        "options": [
          "Aktif",
          "Perbaikan",
          "Tidak aktif"
        ]
      },
      {
        "key": "asset_note",
        "label": "Catatan aset",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Petugas Aset"
    ],
    "wf": [
      "WF-10"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "OPS-07",
    "fields": [
      {
        "key": "work_order",
        "label": "No. work order",
        "type": "text",
        "required": true
      },
      {
        "key": "asset_code",
        "label": "Kode alat",
        "type": "text",
        "required": true
      },
      {
        "key": "maintenance_type",
        "label": "Jenis pekerjaan",
        "type": "select",
        "required": true,
        "options": [
          "Preventif",
          "Korektif",
          "Kalibrasi"
        ]
      },
      {
        "key": "scheduled_date",
        "label": "Tanggal pekerjaan",
        "type": "date",
        "required": true
      },
      {
        "key": "technician",
        "label": "Teknisi",
        "type": "text",
        "required": true
      },
      {
        "key": "calibration_state",
        "label": "Status pekerjaan",
        "type": "select",
        "required": true,
        "options": [
          "Dijadwalkan",
          "Dalam proses",
          "Menunggu verifikasi"
        ]
      },
      {
        "key": "maintenance_result",
        "label": "Hasil pemeriksaan",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Teknisi"
    ],
    "wf": [
      "WF-10"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "OPS-08",
    "fields": [
      {
        "key": "facility_task",
        "label": "ID tugas fasilitas",
        "type": "text",
        "required": true
      },
      {
        "key": "area",
        "label": "Area/unit",
        "type": "text",
        "required": true
      },
      {
        "key": "task_type",
        "label": "Jenis pekerjaan",
        "type": "select",
        "required": true,
        "options": [
          "Kebersihan rutin",
          "Disinfeksi",
          "Perbaikan ringan",
          "Inspeksi ruang"
        ]
      },
      {
        "key": "due_date",
        "label": "Tenggat",
        "type": "date",
        "required": true
      },
      {
        "key": "assigned_to",
        "label": "Penanggung jawab",
        "type": "text",
        "required": true
      },
      {
        "key": "task_state",
        "label": "Status tugas",
        "type": "select",
        "required": true,
        "options": [
          "Terjadwal",
          "Dalam proses",
          "Selesai simulasi"
        ]
      },
      {
        "key": "work_note",
        "label": "Catatan hasil",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Petugas Fasilitas"
    ],
    "wf": [
      "WF-10"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "OPS-09",
    "fields": [
      {
        "key": "transport_reference",
        "label": "Nomor perjalanan demo",
        "type": "text",
        "required": true
      },
      {
        "key": "patient_ref",
        "label": "Pasien demo",
        "type": "text",
        "required": true
      },
      {
        "key": "transport_type",
        "label": "Jenis transport",
        "type": "select",
        "required": true,
        "options": [
          "Antar unit",
          "Antar RS",
          "Ambulans rujukan"
        ]
      },
      {
        "key": "vehicle_code",
        "label": "Kode kendaraan",
        "type": "text",
        "required": true
      },
      {
        "key": "crew",
        "label": "Petugas transportasi",
        "type": "text",
        "required": true
      },
      {
        "key": "departure_at",
        "label": "Perkiraan berangkat",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "arrival_at",
        "label": "Perkiraan tiba",
        "type": "datetime-local",
        "required": false
      },
      {
        "key": "dispatch_state",
        "label": "Status dispatch",
        "type": "select",
        "required": true,
        "options": [
          "Perencanaan",
          "Menunggu konfirmasi",
          "Dalam perjalanan simulasi"
        ]
      }
    ],
    "roles": [
      "Koordinator Transport"
    ],
    "wf": [
      "WF-03"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "ENT-01",
    "fields": [
      {
        "key": "employee_code",
        "label": "Kode pegawai",
        "type": "text",
        "required": true
      },
      {
        "key": "employee_name",
        "label": "Nama pegawai demo",
        "type": "text",
        "required": true
      },
      {
        "key": "employment_type",
        "label": "Kepegawaian",
        "type": "select",
        "required": true,
        "options": [
          "Tetap",
          "Kontrak",
          "Paruh waktu"
        ]
      },
      {
        "key": "job_title",
        "label": "Jabatan",
        "type": "text",
        "required": true
      },
      {
        "key": "unit",
        "label": "Unit kerja",
        "type": "text",
        "required": true
      },
      {
        "key": "start_date",
        "label": "Tanggal mulai",
        "type": "date",
        "required": true
      },
      {
        "key": "employment_state",
        "label": "Status pegawai",
        "type": "select",
        "required": true,
        "options": [
          "Aktif",
          "Cuti",
          "Tidak aktif"
        ]
      },
      {
        "key": "competency",
        "label": "Kompetensi",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "HR Admin"
    ],
    "wf": [
      "WF-12"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "ENT-02",
    "fields": [
      {
        "key": "payroll_cycle",
        "label": "Kode payroll demo",
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
        "label": "Periode akhir",
        "type": "date",
        "required": true
      },
      {
        "key": "employee_ref",
        "label": "Referensi pegawai sintetis",
        "type": "text",
        "required": true
      },
      {
        "key": "gross_pay",
        "label": "Gaji bruto contoh (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "deduction",
        "label": "Potongan contoh (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "run_state",
        "label": "Status pemrosesan",
        "type": "select",
        "required": true,
        "options": [
          "Draft",
          "Perlu verifikasi",
          "Penguncian simulasi"
        ]
      },
      {
        "key": "calculation_note",
        "label": "Catatan perhitungan",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Payroll Admin"
    ],
    "wf": [
      "WF-12"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "ENT-03",
    "fields": [
      {
        "key": "application_ref",
        "label": "Kode lamaran",
        "type": "text",
        "required": true
      },
      {
        "key": "candidate_demo",
        "label": "Nama kandidat sintetis",
        "type": "text",
        "required": true
      },
      {
        "key": "position",
        "label": "Posisi",
        "type": "text",
        "required": true
      },
      {
        "key": "applied_on",
        "label": "Tanggal masuk",
        "type": "date",
        "required": true
      },
      {
        "key": "recruitment_stage",
        "label": "Tahap rekrutmen",
        "type": "select",
        "required": true,
        "options": [
          "Screening",
          "Interview",
          "Assessment",
          "Offer (draft)",
          "Selesai"
        ]
      },
      {
        "key": "recruiter",
        "label": "PIC rekrutmen",
        "type": "text",
        "required": true
      },
      {
        "key": "talent_note",
        "label": "Evaluasi",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Rekruter"
    ],
    "wf": [
      "WF-12"
    ],
    "patient_context": false,
    "safety_gate": true
  },
  {
    "code": "ENT-05",
    "fields": [
      {
        "key": "surveillance_ref",
        "label": "ID episode infeksi demo",
        "type": "text",
        "required": true
      },
      {
        "key": "event_date",
        "label": "Tanggal teridentifikasi",
        "type": "date",
        "required": true
      },
      {
        "key": "infection_type",
        "label": "Jenis infeksi",
        "type": "select",
        "required": true,
        "options": [
          "HAI terkait tindakan",
          "Infeksi aliran darah",
          "Infeksi area operasi",
          "Infeksi lainnya"
        ]
      },
      {
        "key": "unit",
        "label": "Unit pelapor",
        "type": "text",
        "required": true
      },
      {
        "key": "case_state",
        "label": "Status surveilans",
        "type": "select",
        "required": true,
        "options": [
          "Suspek (simulasi)",
          "Perlu verifikasi",
          "Ditinjau simulasi"
        ]
      },
      {
        "key": "surveillance_evidence",
        "label": "Bukti surveilans",
        "type": "textarea",
        "required": true
      },
      {
        "key": "prevention_note",
        "label": "Tindak lanjut PPI",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Tim PPI"
    ],
    "wf": [
      "WF-12"
    ],
    "patient_context": true,
    "safety_gate": true
  },
  {
    "code": "ENT-07",
    "fields": [
      {
        "key": "risk_code",
        "label": "ID risiko",
        "type": "text",
        "required": true
      },
      {
        "key": "risk_owner",
        "label": "Pemilik risiko",
        "type": "text",
        "required": true
      },
      {
        "key": "risk_category",
        "label": "Kategori risiko",
        "type": "select",
        "required": true,
        "options": [
          "Klinis",
          "Operasional",
          "Data",
          "Finansial",
          "Keselamatan"
        ]
      },
      {
        "key": "likelihood",
        "label": "Kemungkinan",
        "type": "select",
        "required": true,
        "options": [
          "1 - Jarang",
          "2 - Rendah",
          "3 - Sedang",
          "4 - Tinggi",
          "5 - Sangat tinggi"
        ]
      },
      {
        "key": "impact",
        "label": "Dampak",
        "type": "select",
        "required": true,
        "options": [
          "1 - Minimal",
          "2 - Rendah",
          "3 - Sedang",
          "4 - Tinggi",
          "5 - Kritis"
        ]
      },
      {
        "key": "risk_description",
        "label": "Deskripsi risiko",
        "type": "textarea",
        "required": true
      },
      {
        "key": "mitigation",
        "label": "Rencana mitigasi",
        "type": "textarea",
        "required": true
      },
      {
        "key": "review_due",
        "label": "Jadwal review",
        "type": "date",
        "required": true
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
  },
  {
    "code": "ENT-10",
    "fields": [
      {
        "key": "dashboard_code",
        "label": "Kode dashboard",
        "type": "text",
        "required": true
      },
      {
        "key": "hospital_group",
        "label": "Grup RS demo",
        "type": "text",
        "required": true
      },
      {
        "key": "metric_set",
        "label": "Paket metrik",
        "type": "select",
        "required": true,
        "options": [
          "Kunjungan",
          "BOR dan kapasitas",
          "Keuangan ringkas",
          "Mutu layanan"
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
        "key": "data_freshness",
        "label": "Kesegaran data",
        "type": "select",
        "required": true,
        "options": [
          "Belum dicek",
          "Data demo tersedia",
          "Terlambat simulasi"
        ]
      },
      {
        "key": "access_scope",
        "label": "Cakupan akses",
        "type": "select",
        "required": true,
        "options": [
          "Grup RS demo",
          "Per RS demo"
        ]
      },
      {
        "key": "dashboard_note",
        "label": "Catatan analitik",
        "type": "textarea",
        "required": false
      }
    ],
    "roles": [
      "Manajemen RS"
    ],
    "wf": [
      "WF-12"
    ],
    "patient_context": false,
    "safety_gate": true
  }
];
specs.forEach(function(u){var m=catalog.find(function(x){return x.code===u.code;});if(!m)throw new Error("Missing module: "+u.code);Object.assign(m,u);});
})();
