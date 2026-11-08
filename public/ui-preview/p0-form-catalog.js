/* Generated design contract from PRD 2026-11-08; prototype metadata, not backend schema. */
window.SIMRS_FORM_CATALOG = [
  {
    "code": "CORE-01",
    "name": "Tenant & Multi-RS",
    "priority": "P0",
    "pic": 1,
    "workspace": "management",
    "fr": [
      "FR-001"
    ],
    "us": "US-CORE-01",
    "wf": [],
    "entity": "identity.tenants",
    "description": "Admin mengatur tenant dan organisasi untuk memisahkan data tiap RS.",
    "roles": [
      "Admin Sistem"
    ],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-01-AC-01",
      "US-CORE-01-AC-02",
      "US-CORE-01-AC-03",
      "US-CORE-01-AC-04",
      "US-CORE-01-AC-05",
      "US-CORE-01-AC-06"
    ],
    "fields": [
      {
        "key": "tenant_code",
        "label": "Kode tenant",
        "type": "text",
        "required": true
      },
      {
        "key": "tenant_name",
        "label": "Nama tenant",
        "type": "text",
        "required": true
      },
      {
        "key": "organization_code",
        "label": "Kode RS induk",
        "type": "text",
        "required": true
      },
      {
        "key": "data_isolation",
        "label": "Pemisahan data",
        "type": "select",
        "required": true,
        "options": [
          "Per RS",
          "Grup RS"
        ]
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": true,
        "options": [
          "Aktif",
          "Nonaktif"
        ]
      },
      {
        "key": "effective_from",
        "label": "Berlaku mulai",
        "type": "date",
        "required": true
      }
    ]
  },
  {
    "code": "CORE-02",
    "name": "Identity & Access",
    "priority": "P0",
    "pic": 1,
    "workspace": "management",
    "fr": [
      "FR-002"
    ],
    "us": "US-CORE-02",
    "wf": [],
    "entity": "identity.users",
    "description": "Admin menetapkan role, izin dan cakupan unit bagi pengguna.",
    "roles": [
      "Admin Sistem"
    ],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-02-AC-01",
      "US-CORE-02-AC-02",
      "US-CORE-02-AC-03",
      "US-CORE-02-AC-04",
      "US-CORE-02-AC-05",
      "US-CORE-02-AC-06"
    ],
    "fields": [
      {
        "key": "username",
        "label": "ID pengguna",
        "type": "text",
        "required": true
      },
      {
        "key": "display_name",
        "label": "Nama petugas",
        "type": "text",
        "required": true
      },
      {
        "key": "email",
        "label": "Email",
        "type": "email",
        "required": true
      },
      {
        "key": "role",
        "label": "Peran",
        "type": "select",
        "required": true,
        "options": [
          "Pendaftaran",
          "Dokter RJ",
          "Dokter IGD",
          "DPJP Rawat Inap",
          "Perawat",
          "ATLM",
          "Farmasis",
          "Gudang",
          "Kasir",
          "Manajemen RS",
          "Admin Sistem"
        ]
      },
      {
        "key": "unit",
        "label": "Unit layanan",
        "type": "select",
        "required": true,
        "options": [
          "Poli Umum",
          "Penyakit Dalam",
          "Jantung",
          "IGD",
          "Rawat Inap",
          "Laboratorium",
          "Farmasi"
        ]
      },
      {
        "key": "account_state",
        "label": "Status akun",
        "type": "select",
        "required": true,
        "options": [
          "Aktif",
          "Ditangguhkan",
          "Nonaktif"
        ]
      }
    ]
  },
  {
    "code": "CORE-03",
    "name": "Master Organization",
    "priority": "P0",
    "pic": 1,
    "workspace": "management",
    "fr": [
      "FR-001"
    ],
    "us": "US-CORE-03",
    "wf": [],
    "entity": "master.organizations",
    "description": "Admin mengelola RS, unit, dan profil organisasi yang berlaku.",
    "roles": [
      "Admin Sistem"
    ],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-03-AC-01",
      "US-CORE-03-AC-02",
      "US-CORE-03-AC-03",
      "US-CORE-03-AC-04",
      "US-CORE-03-AC-05",
      "US-CORE-03-AC-06"
    ],
    "fields": [
      {
        "key": "organization_code",
        "label": "Kode organisasi",
        "type": "text",
        "required": true
      },
      {
        "key": "organization_name",
        "label": "Nama organisasi",
        "type": "text",
        "required": true
      },
      {
        "key": "organization_type",
        "label": "Jenis organisasi",
        "type": "select",
        "required": true,
        "options": [
          "Rumah Sakit",
          "Instalasi",
          "Unit",
          "Poliklinik"
        ]
      },
      {
        "key": "parent_code",
        "label": "Kode induk",
        "type": "text",
        "required": false
      },
      {
        "key": "license_no",
        "label": "Nomor izin",
        "type": "text",
        "required": false
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": true,
        "options": [
          "Aktif",
          "Nonaktif"
        ]
      }
    ]
  },
  {
    "code": "CORE-04",
    "name": "Master Practitioner",
    "priority": "P0",
    "pic": 1,
    "workspace": "management",
    "fr": [
      "FR-002"
    ],
    "us": "US-CORE-04",
    "wf": [],
    "entity": "master.practitioners",
    "description": "Admin SDM medis mengelola praktisi, STR/SIP serta penugasan.",
    "roles": [
      "Admin Sistem"
    ],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-04-AC-01",
      "US-CORE-04-AC-02",
      "US-CORE-04-AC-03",
      "US-CORE-04-AC-04",
      "US-CORE-04-AC-05",
      "US-CORE-04-AC-06"
    ],
    "fields": [
      {
        "key": "practitioner_name",
        "label": "Nama praktisi",
        "type": "text",
        "required": true
      },
      {
        "key": "nik_demo",
        "label": "NIK sintetis (16 digit)",
        "type": "text",
        "required": true,
        "pattern": "^[0-9]{16}$",
        "help": "Gunakan data simulasi, jangan NIK sebenarnya."
      },
      {
        "key": "str_no",
        "label": "Nomor STR",
        "type": "text",
        "required": true
      },
      {
        "key": "sip_no",
        "label": "Nomor SIP",
        "type": "text",
        "required": true
      },
      {
        "key": "unit",
        "label": "Unit layanan",
        "type": "select",
        "required": true,
        "options": [
          "Poli Umum",
          "Penyakit Dalam",
          "Jantung",
          "IGD",
          "Rawat Inap",
          "Laboratorium",
          "Farmasi"
        ]
      },
      {
        "key": "profession",
        "label": "Profesi",
        "type": "select",
        "required": true,
        "options": [
          "Dokter",
          "Perawat",
          "Bidan",
          "Apoteker",
          "ATLM",
          "Tenaga kesehatan lainnya"
        ]
      }
    ]
  },
  {
    "code": "CORE-05",
    "name": "Master Location & Bed",
    "priority": "P0",
    "pic": 1,
    "workspace": "management",
    "fr": [
      "FR-011"
    ],
    "us": "US-CORE-05",
    "wf": [],
    "entity": "master.beds",
    "description": "Pengelola ruang mengelola unit, kamar, bed, kelas dan status.",
    "roles": [
      "Admin Sistem",
      "DPJP Rawat Inap"
    ],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-05-AC-01",
      "US-CORE-05-AC-02",
      "US-CORE-05-AC-03",
      "US-CORE-05-AC-04",
      "US-CORE-05-AC-05",
      "US-CORE-05-AC-06"
    ],
    "fields": [
      {
        "key": "location_code",
        "label": "Kode lokasi",
        "type": "text",
        "required": true
      },
      {
        "key": "ward",
        "label": "Nama bangsal/ruang",
        "type": "text",
        "required": true
      },
      {
        "key": "room_number",
        "label": "Nomor kamar",
        "type": "text",
        "required": true
      },
      {
        "key": "bed_number",
        "label": "Kode bed",
        "type": "text",
        "required": true
      },
      {
        "key": "care_class",
        "label": "Kelas perawatan",
        "type": "select",
        "required": true,
        "options": [
          "Kelas 1",
          "Kelas 2",
          "Kelas 3",
          "VIP",
          "Isolasi",
          "ICU"
        ]
      },
      {
        "key": "bed_state",
        "label": "Status bed",
        "type": "select",
        "required": true,
        "options": [
          "Tersedia",
          "Terisi",
          "Dibersihkan",
          "Perbaikan"
        ]
      }
    ]
  },
  {
    "code": "CORE-06",
    "name": "Master Layanan & Tarif",
    "priority": "P0",
    "pic": 1,
    "workspace": "management",
    "fr": [
      "FR-003",
      "FR-035"
    ],
    "us": "US-CORE-06",
    "wf": [],
    "entity": "master.services",
    "description": "Admin menyusun katalog layanan, tindakan, paket dan tarif.",
    "roles": [
      "Admin Sistem",
      "Manajemen RS"
    ],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-06-AC-01",
      "US-CORE-06-AC-02",
      "US-CORE-06-AC-03",
      "US-CORE-06-AC-04",
      "US-CORE-06-AC-05",
      "US-CORE-06-AC-06"
    ],
    "fields": [
      {
        "key": "service_code",
        "label": "Kode layanan",
        "type": "text",
        "required": true
      },
      {
        "key": "service_name",
        "label": "Nama layanan",
        "type": "text",
        "required": true
      },
      {
        "key": "service_group",
        "label": "Kelompok layanan",
        "type": "select",
        "required": true,
        "options": [
          "Konsultasi",
          "Laboratorium",
          "Radiologi",
          "Tindakan",
          "Kamar",
          "Farmasi"
        ]
      },
      {
        "key": "tariff",
        "label": "Tarif dasar (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "effective_from",
        "label": "Mulai berlaku",
        "type": "date",
        "required": true
      },
      {
        "key": "effective_until",
        "label": "Sampai",
        "type": "date",
        "required": false
      },
      {
        "key": "tariff_status",
        "label": "Status tarif",
        "type": "select",
        "required": true,
        "options": [
          "Draft",
          "Aktif",
          "Nonaktif"
        ]
      }
    ]
  },
  {
    "code": "CORE-07",
    "name": "Terminology Service",
    "priority": "P0",
    "pic": 1,
    "workspace": "management",
    "fr": [
      "FR-037"
    ],
    "us": "US-CORE-07",
    "wf": [],
    "entity": "terminology.code_mappings",
    "description": "Terminologist memetakan kode lokal ke ICD, LOINC, SNOMED CT, KFA.",
    "roles": [
      "Admin Sistem",
      "Integrasi"
    ],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-07-AC-01",
      "US-CORE-07-AC-02",
      "US-CORE-07-AC-03",
      "US-CORE-07-AC-04",
      "US-CORE-07-AC-05",
      "US-CORE-07-AC-06"
    ],
    "fields": [
      {
        "key": "terminology_system",
        "label": "Sistem kode",
        "type": "select",
        "required": true,
        "options": [
          "ICD-10",
          "ICD-9-CM",
          "LOINC",
          "SNOMED CT",
          "KFA"
        ]
      },
      {
        "key": "local_code",
        "label": "Kode lokal",
        "type": "text",
        "required": true
      },
      {
        "key": "standard_code",
        "label": "Kode standar",
        "type": "text",
        "required": true
      },
      {
        "key": "display",
        "label": "Deskripsi terminologi",
        "type": "text",
        "required": true
      },
      {
        "key": "mapping_version",
        "label": "Versi mapping",
        "type": "text",
        "required": true
      },
      {
        "key": "effective_from",
        "label": "Mulai berlaku",
        "type": "date",
        "required": true
      }
    ]
  },
  {
    "code": "CORE-08",
    "name": "MPI & Rekonsiliasi Pasien",
    "priority": "P0",
    "pic": 1,
    "workspace": "front",
    "fr": [
      "FR-004"
    ],
    "us": "US-CORE-08",
    "wf": [
      "WF-01"
    ],
    "entity": "patient.patients",
    "description": "Pendaftaran mencari pasien dan meninjau possible-match.",
    "roles": [
      "Pendaftaran"
    ],
    "patient_context": true,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-08-AC-01",
      "US-CORE-08-AC-02",
      "US-CORE-08-AC-03",
      "US-CORE-08-AC-04",
      "US-CORE-08-AC-05",
      "US-CORE-08-AC-06"
    ],
    "fields": [
      {
        "key": "patient_name",
        "label": "Nama pasien (demo)",
        "type": "text",
        "required": true
      },
      {
        "key": "nik_demo",
        "label": "NIK sintetis (16 digit)",
        "type": "text",
        "required": true,
        "pattern": "^[0-9]{16}$",
        "help": "Jangan masukkan identitas pasien sebenarnya."
      },
      {
        "key": "dob",
        "label": "Tanggal lahir",
        "type": "date",
        "required": true
      },
      {
        "key": "gender",
        "label": "Jenis kelamin",
        "type": "select",
        "required": true,
        "options": [
          "Laki-laki",
          "Perempuan"
        ]
      },
      {
        "key": "phone_demo",
        "label": "Telepon sintetis",
        "type": "tel",
        "required": false
      },
      {
        "key": "match_state",
        "label": "Hasil pemeriksaan possible-match",
        "type": "select",
        "required": true,
        "options": [
          "Tidak ada kandidat",
          "Perlu review",
          "Identitas ditinjau"
        ]
      }
    ]
  },
  {
    "code": "CORE-12",
    "name": "Consent & Disclosure",
    "priority": "P0",
    "pic": 1,
    "workspace": "management",
    "fr": [
      "FR-008",
      "FR-039"
    ],
    "us": "US-CORE-12",
    "wf": [],
    "entity": "consent.consents",
    "description": "Petugas privasi mencatat grant, revoke dan disclosure data.",
    "roles": [
      "Admin Sistem"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-CORE-12-AC-01",
      "US-CORE-12-AC-02",
      "US-CORE-12-AC-03",
      "US-CORE-12-AC-04",
      "US-CORE-12-AC-05",
      "US-CORE-12-AC-06"
    ],
    "fields": [
      {
        "key": "patient_ref",
        "label": "No RM / ID pasien demo",
        "type": "text",
        "required": true
      },
      {
        "key": "consent_scope",
        "label": "Cakupan",
        "type": "select",
        "required": true,
        "options": [
          "Perawatan",
          "Akses dokumen",
          "Disclosure eksternal"
        ]
      },
      {
        "key": "consent_state",
        "label": "Keputusan",
        "type": "select",
        "required": true,
        "options": [
          "Grant",
          "Revoke"
        ]
      },
      {
        "key": "valid_from",
        "label": "Periode mulai",
        "type": "date",
        "required": true
      },
      {
        "key": "valid_until",
        "label": "Periode berakhir",
        "type": "date",
        "required": true
      },
      {
        "key": "reason",
        "label": "Dasar persetujuan / alasan",
        "type": "textarea",
        "required": true
      }
    ]
  },
  {
    "code": "CORE-09",
    "name": "Registrasi & Front Office",
    "priority": "P0",
    "pic": 2,
    "workspace": "front",
    "fr": [
      "FR-006"
    ],
    "us": "US-CORE-09",
    "wf": [
      "WF-01"
    ],
    "entity": "encounter.registrations",
    "description": "Pendaftaran membuat registrasi dan episode kunjungan.",
    "roles": [
      "Pendaftaran"
    ],
    "patient_context": true,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-09-AC-01",
      "US-CORE-09-AC-02",
      "US-CORE-09-AC-03",
      "US-CORE-09-AC-04",
      "US-CORE-09-AC-05",
      "US-CORE-09-AC-06"
    ],
    "fields": [
      {
        "key": "visit_type",
        "label": "Jenis kunjungan",
        "type": "select",
        "required": true,
        "options": [
          "Rawat Jalan",
          "IGD",
          "Rawat Inap"
        ]
      },
      {
        "key": "unit",
        "label": "Unit layanan",
        "type": "select",
        "required": true,
        "options": [
          "Poli Umum",
          "Penyakit Dalam",
          "Jantung",
          "IGD",
          "Rawat Inap",
          "Laboratorium",
          "Farmasi"
        ]
      },
      {
        "key": "payer",
        "label": "Penjamin",
        "type": "select",
        "required": true,
        "options": [
          "Umum",
          "BPJS (demo)",
          "Asuransi (demo)"
        ]
      },
      {
        "key": "visit_date",
        "label": "Tanggal kunjungan",
        "type": "date",
        "required": true
      },
      {
        "key": "referral_reference",
        "label": "Nomor rujukan demo",
        "type": "text",
        "required": false
      },
      {
        "key": "checkin_state",
        "label": "Status kunjungan",
        "type": "select",
        "required": true,
        "options": [
          "Terdaftar",
          "Check-in",
          "Menunggu layanan"
        ]
      }
    ]
  },
  {
    "code": "CORE-10",
    "name": "Appointment & Scheduling",
    "priority": "P0",
    "pic": 2,
    "workspace": "front",
    "fr": [
      "FR-005"
    ],
    "us": "US-CORE-10",
    "wf": [
      "WF-01"
    ],
    "entity": "scheduling.appointments",
    "description": "Admin jadwal mengelola slot, booking dan reschedule.",
    "roles": [
      "Pendaftaran"
    ],
    "patient_context": true,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-10-AC-01",
      "US-CORE-10-AC-02",
      "US-CORE-10-AC-03",
      "US-CORE-10-AC-04",
      "US-CORE-10-AC-05",
      "US-CORE-10-AC-06"
    ],
    "fields": [
      {
        "key": "unit",
        "label": "Unit layanan",
        "type": "select",
        "required": true,
        "options": [
          "Poli Umum",
          "Penyakit Dalam",
          "Jantung",
          "IGD",
          "Rawat Inap",
          "Laboratorium",
          "Farmasi"
        ]
      },
      {
        "key": "practitioner",
        "label": "Dokter / petugas",
        "type": "text",
        "required": true
      },
      {
        "key": "start_at",
        "label": "Mulai jadwal",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "end_at",
        "label": "Selesai jadwal",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "appointment_state",
        "label": "Status booking",
        "type": "select",
        "required": true,
        "options": [
          "Dipesan",
          "Konfirmasi",
          "Batal"
        ]
      },
      {
        "key": "visit_reason",
        "label": "Alasan kunjungan",
        "type": "textarea",
        "required": false
      }
    ]
  },
  {
    "code": "CORE-11",
    "name": "Antrean & Kiosk",
    "priority": "P1",
    "pic": 2,
    "workspace": "front",
    "fr": [
      "FR-007"
    ],
    "us": "US-CORE-11",
    "wf": [],
    "entity": "scheduling.queue_tickets",
    "description": "Petugas loket memanggil/menunda/menyelesaikan antrean.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-CORE-11-AC-01",
      "US-CORE-11-AC-02",
      "US-CORE-11-AC-03",
      "US-CORE-11-AC-04",
      "US-CORE-11-AC-05",
      "US-CORE-11-AC-06"
    ],
    "fields": []
  },
  {
    "code": "RME-12",
    "name": "Portal Pasien",
    "priority": "P2",
    "pic": 2,
    "workspace": "front",
    "fr": [
      "FR-039"
    ],
    "us": "US-RME-12",
    "wf": [],
    "entity": "consent.proxy_access_grants",
    "description": "Pasien/wali berizin melihat jadwal, hasil dan dokumen dirilis.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-RME-12-AC-01",
      "US-RME-12-AC-02",
      "US-RME-12-AC-03",
      "US-RME-12-AC-04",
      "US-RME-12-AC-05",
      "US-RME-12-AC-06"
    ],
    "fields": []
  },
  {
    "code": "RME-01",
    "name": "Rawat Jalan",
    "priority": "P0",
    "pic": 3,
    "workspace": "clinical",
    "fr": [
      "FR-006",
      "FR-009"
    ],
    "us": "US-RME-01",
    "wf": [
      "WF-02"
    ],
    "entity": "encounter.encounters",
    "description": "Dokter RJ mencatat pemeriksaan sampai ringkasan dan penutupan.",
    "roles": [
      "Dokter RJ"
    ],
    "patient_context": true,
    "safety_gate": false,
    "ac_ids": [
      "US-RME-01-AC-01",
      "US-RME-01-AC-02",
      "US-RME-01-AC-03",
      "US-RME-01-AC-04",
      "US-RME-01-AC-05",
      "US-RME-01-AC-06"
    ],
    "fields": [
      {
        "key": "recorded_at",
        "label": "Waktu pencatatan",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "unit",
        "label": "Unit layanan",
        "type": "select",
        "required": true,
        "options": [
          "Poli Umum",
          "Penyakit Dalam",
          "Jantung",
          "IGD",
          "Rawat Inap",
          "Laboratorium",
          "Farmasi"
        ]
      },
      {
        "key": "practitioner",
        "label": "Dokter pemeriksa",
        "type": "text",
        "required": true
      },
      {
        "key": "chief_complaint",
        "label": "Keluhan utama",
        "type": "textarea",
        "required": true
      },
      {
        "key": "encounter_state",
        "label": "Status episode",
        "type": "select",
        "required": true,
        "options": [
          "In-progress",
          "On hold",
          "Finished (demo)"
        ]
      },
      {
        "key": "follow_up",
        "label": "Rencana tindak lanjut",
        "type": "textarea",
        "required": false
      }
    ]
  },
  {
    "code": "RME-02",
    "name": "IGD & Triase",
    "priority": "P0",
    "pic": 3,
    "workspace": "acute",
    "fr": [
      "FR-010"
    ],
    "us": "US-RME-02",
    "wf": [
      "WF-03"
    ],
    "entity": "clinical.emergency_triages",
    "description": "Dokter/perawat IGD merekam acuity, tindakan dan disposisi.",
    "roles": [
      "Dokter IGD"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-RME-02-AC-01",
      "US-RME-02-AC-02",
      "US-RME-02-AC-03",
      "US-RME-02-AC-04",
      "US-RME-02-AC-05",
      "US-RME-02-AC-06"
    ],
    "fields": [
      {
        "key": "triage_at",
        "label": "Waktu triase",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "acuity",
        "label": "Kategori triase",
        "type": "select",
        "required": true,
        "options": [
          "Merah",
          "Kuning",
          "Hijau",
          "Hitam"
        ]
      },
      {
        "key": "systolic",
        "label": "Sistolik (mmHg)",
        "type": "number",
        "required": true,
        "min": 40,
        "max": 300
      },
      {
        "key": "diastolic",
        "label": "Diastolik (mmHg)",
        "type": "number",
        "required": true,
        "min": 20,
        "max": 200
      },
      {
        "key": "respiratory_rate",
        "label": "Frekuensi napas / menit",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 100
      },
      {
        "key": "triage_note",
        "label": "Keluhan dan tindakan awal",
        "type": "textarea",
        "required": true
      }
    ]
  },
  {
    "code": "RME-03",
    "name": "Rawat Inap & Discharge",
    "priority": "P0",
    "pic": 3,
    "workspace": "acute",
    "fr": [
      "FR-006",
      "FR-011"
    ],
    "us": "US-RME-03",
    "wf": [
      "WF-04"
    ],
    "entity": "encounter.admissions",
    "description": "DPJP mengelola admisi, perpindahan dan pulang.",
    "roles": [
      "DPJP Rawat Inap",
      "Dokter IGD"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-RME-03-AC-01",
      "US-RME-03-AC-02",
      "US-RME-03-AC-03",
      "US-RME-03-AC-04",
      "US-RME-03-AC-05",
      "US-RME-03-AC-06"
    ],
    "fields": [
      {
        "key": "admission_at",
        "label": "Waktu masuk",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "ward",
        "label": "Bangsal tujuan",
        "type": "text",
        "required": true
      },
      {
        "key": "bed_code",
        "label": "Kode bed",
        "type": "text",
        "required": true
      },
      {
        "key": "admission_state",
        "label": "Tahap kunjungan",
        "type": "select",
        "required": true,
        "options": [
          "Masuk",
          "Perawatan",
          "Rencana pulang",
          "Pulang (simulasi)"
        ]
      },
      {
        "key": "discharge_at",
        "label": "Waktu pulang",
        "type": "datetime-local",
        "required": false
      },
      {
        "key": "discharge_plan",
        "label": "Rencana pemulangan",
        "type": "textarea",
        "required": false
      }
    ]
  },
  {
    "code": "RME-04",
    "name": "CPPT / SOAP",
    "priority": "P0",
    "pic": 3,
    "workspace": "clinical",
    "fr": [
      "FR-009",
      "FR-034",
      "FR-040",
      "FR-042"
    ],
    "us": "US-RME-04",
    "wf": [
      "WF-02"
    ],
    "entity": "clinical.clinical_notes",
    "description": "Dokter/perawat menulis dan menandatangani catatan longitudinal.",
    "roles": [
      "Dokter RJ",
      "DPJP Rawat Inap",
      "Perawat"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-RME-04-AC-01",
      "US-RME-04-AC-02",
      "US-RME-04-AC-03",
      "US-RME-04-AC-04",
      "US-RME-04-AC-05",
      "US-RME-04-AC-06"
    ],
    "fields": [
      {
        "key": "note_at",
        "label": "Waktu catatan",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "note_type",
        "label": "Jenis catatan",
        "type": "select",
        "required": true,
        "options": [
          "SOAP Dokter",
          "CPPT Perawat"
        ]
      },
      {
        "key": "subjective",
        "label": "S - Subjektif",
        "type": "textarea",
        "required": true
      },
      {
        "key": "objective",
        "label": "O - Objektif",
        "type": "textarea",
        "required": true
      },
      {
        "key": "assessment",
        "label": "A - Assessment",
        "type": "textarea",
        "required": true
      },
      {
        "key": "plan",
        "label": "P - Plan",
        "type": "textarea",
        "required": true
      },
      {
        "key": "author",
        "label": "Penulis catatan",
        "type": "text",
        "required": true
      }
    ]
  },
  {
    "code": "RME-05",
    "name": "Asesmen & TTV",
    "priority": "P0",
    "pic": 3,
    "workspace": "clinical",
    "fr": [
      "FR-034"
    ],
    "us": "US-RME-05",
    "wf": [
      "WF-02"
    ],
    "entity": "clinical.observations",
    "description": "Tenaga klinis merekam asesmen dan observasi berkode.",
    "roles": [
      "Perawat",
      "Dokter RJ"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-RME-05-AC-01",
      "US-RME-05-AC-02",
      "US-RME-05-AC-03",
      "US-RME-05-AC-04",
      "US-RME-05-AC-05",
      "US-RME-05-AC-06"
    ],
    "fields": [
      {
        "key": "measured_at",
        "label": "Waktu pengukuran",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "systolic",
        "label": "Tekanan sistolik (mmHg)",
        "type": "number",
        "required": true,
        "min": 40,
        "max": 300
      },
      {
        "key": "diastolic",
        "label": "Tekanan diastolik (mmHg)",
        "type": "number",
        "required": true,
        "min": 20,
        "max": 200
      },
      {
        "key": "heart_rate",
        "label": "Nadi / menit",
        "type": "number",
        "required": true,
        "min": 20,
        "max": 250
      },
      {
        "key": "temperature",
        "label": "Suhu (°C)",
        "type": "number",
        "required": true,
        "min": 25,
        "max": 45,
        "step": 0.1
      },
      {
        "key": "weight",
        "label": "Berat badan (kg)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 600,
        "step": 0.1
      },
      {
        "key": "height",
        "label": "Tinggi badan (cm)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 250,
        "step": 0.1
      }
    ]
  },
  {
    "code": "RME-06",
    "name": "Diagnosis & Prosedur",
    "priority": "P0",
    "pic": 3,
    "workspace": "clinical",
    "fr": [
      "FR-009"
    ],
    "us": "US-RME-06",
    "wf": [
      "WF-02"
    ],
    "entity": "clinical.diagnoses",
    "description": "Dokter mengisi diagnosis, certainty, prosedur dan bukti.",
    "roles": [
      "Dokter RJ",
      "DPJP Rawat Inap"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-RME-06-AC-01",
      "US-RME-06-AC-02",
      "US-RME-06-AC-03",
      "US-RME-06-AC-04",
      "US-RME-06-AC-05",
      "US-RME-06-AC-06"
    ],
    "fields": [
      {
        "key": "diagnosis_system",
        "label": "Sistem klasifikasi",
        "type": "select",
        "required": true,
        "options": [
          "ICD-10 (contoh)",
          "SNOMED CT (contoh)"
        ]
      },
      {
        "key": "diagnosis_code",
        "label": "Kode diagnosis demo",
        "type": "select",
        "required": true,
        "options": [
          "I10 — Hipertensi esensial",
          "E11 — Diabetes melitus tipe 2",
          "J06.9 — ISPA tidak spesifik",
          "A09 — Gastroenteritis"
        ]
      },
      {
        "key": "certainty",
        "label": "Tingkat kepastian",
        "type": "select",
        "required": true,
        "options": [
          "Confirmed",
          "Provisional"
        ]
      },
      {
        "key": "procedure_code",
        "label": "Kode prosedur demo",
        "type": "text",
        "required": false
      },
      {
        "key": "clinical_note",
        "label": "Alasan klinis",
        "type": "textarea",
        "required": true
      }
    ]
  },
  {
    "code": "RME-07",
    "name": "Keperawatan",
    "priority": "P0",
    "pic": 3,
    "workspace": "clinical",
    "fr": [
      "FR-012"
    ],
    "us": "US-RME-07",
    "wf": [
      "WF-02"
    ],
    "entity": "clinical.nursing_assessments",
    "description": "Perawat mencatat asesmen, intervensi, evaluasi dan handover.",
    "roles": [
      "Perawat"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-RME-07-AC-01",
      "US-RME-07-AC-02",
      "US-RME-07-AC-03",
      "US-RME-07-AC-04",
      "US-RME-07-AC-05",
      "US-RME-07-AC-06"
    ],
    "fields": [
      {
        "key": "nurse",
        "label": "Perawat pelaksana",
        "type": "text",
        "required": true
      },
      {
        "key": "shift",
        "label": "Shift",
        "type": "select",
        "required": true,
        "options": [
          "Pagi",
          "Sore",
          "Malam"
        ]
      },
      {
        "key": "nursing_problem",
        "label": "Masalah keperawatan",
        "type": "textarea",
        "required": true
      },
      {
        "key": "nursing_intervention",
        "label": "Intervensi",
        "type": "textarea",
        "required": true
      },
      {
        "key": "response",
        "label": "Evaluasi respons",
        "type": "textarea",
        "required": true
      },
      {
        "key": "observed_at",
        "label": "Waktu tindakan",
        "type": "datetime-local",
        "required": true
      }
    ]
  },
  {
    "code": "RME-09",
    "name": "Care Plan & Care Team",
    "priority": "P1",
    "pic": 3,
    "workspace": "clinical",
    "fr": [
      "FR-012"
    ],
    "us": "US-RME-09",
    "wf": [],
    "entity": "clinical.care_plans",
    "description": "DPJP mengelola rencana asuhan, anggota dan peran care team.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-RME-09-AC-01",
      "US-RME-09-AC-02",
      "US-RME-09-AC-03",
      "US-RME-09-AC-04",
      "US-RME-09-AC-05",
      "US-RME-09-AC-06"
    ],
    "fields": []
  },
  {
    "code": "RME-10",
    "name": "Rujukan Internal/Eksternal",
    "priority": "P1",
    "pic": 3,
    "workspace": "clinical",
    "fr": [
      "FR-014",
      "FR-035"
    ],
    "us": "US-RME-10",
    "wf": [],
    "entity": "clinical.referrals",
    "description": "Dokter meminta rujukan serta memantau handover.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-RME-10-AC-01",
      "US-RME-10-AC-02",
      "US-RME-10-AC-03",
      "US-RME-10-AC-04",
      "US-RME-10-AC-05",
      "US-RME-10-AC-06"
    ],
    "fields": []
  },
  {
    "code": "RME-11",
    "name": "Dokumen & Tanda Tangan",
    "priority": "P0",
    "pic": 3,
    "workspace": "clinical",
    "fr": [
      "FR-013"
    ],
    "us": "US-RME-11",
    "wf": [
      "WF-02"
    ],
    "entity": "clinical.documents",
    "description": "Klinisi menerbitkan surat, resume dan dokumen medis.",
    "roles": [
      "Dokter RJ",
      "DPJP Rawat Inap"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-RME-11-AC-01",
      "US-RME-11-AC-02",
      "US-RME-11-AC-03",
      "US-RME-11-AC-04",
      "US-RME-11-AC-05",
      "US-RME-11-AC-06"
    ],
    "fields": [
      {
        "key": "document_type",
        "label": "Jenis dokumen",
        "type": "select",
        "required": true,
        "options": [
          "Resume medis",
          "Surat keterangan",
          "Persetujuan tindakan",
          "Ringkasan pulang"
        ]
      },
      {
        "key": "document_date",
        "label": "Tanggal dokumen",
        "type": "date",
        "required": true
      },
      {
        "key": "author",
        "label": "Penanggung jawab",
        "type": "text",
        "required": true
      },
      {
        "key": "reference",
        "label": "Nomor dokumen demo",
        "type": "text",
        "required": true
      },
      {
        "key": "content_summary",
        "label": "Ringkasan dokumen",
        "type": "textarea",
        "required": true
      },
      {
        "key": "signature_state",
        "label": "Status tanda tangan",
        "type": "select",
        "required": true,
        "options": [
          "Belum ditandatangani",
          "Menunggu review"
        ]
      }
    ]
  },
  {
    "code": "MED-06",
    "name": "Operasi & Kamar Bedah",
    "priority": "P1",
    "pic": 3,
    "workspace": "acute",
    "fr": [
      "FR-012"
    ],
    "us": "US-MED-06",
    "wf": [],
    "entity": "operations.surgery_cases",
    "description": "Koordinator OK mengatur case, jadwal, tim dan checklist.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-MED-06-AC-01",
      "US-MED-06-AC-02",
      "US-MED-06-AC-03",
      "US-MED-06-AC-04",
      "US-MED-06-AC-05",
      "US-MED-06-AC-06"
    ],
    "fields": []
  },
  {
    "code": "MED-07",
    "name": "Anestesi & Recovery",
    "priority": "P1",
    "pic": 3,
    "workspace": "acute",
    "fr": [
      "FR-012"
    ],
    "us": "US-MED-07",
    "wf": [],
    "entity": "operations.anesthesia_records",
    "description": "Anestesiolog mencatat induksi, monitoring dan PACU.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-MED-07-AC-01",
      "US-MED-07-AC-02",
      "US-MED-07-AC-03",
      "US-MED-07-AC-04",
      "US-MED-07-AC-05",
      "US-MED-07-AC-06"
    ],
    "fields": []
  },
  {
    "code": "OPS-10",
    "name": "Manajemen Bed Operasional",
    "priority": "P0",
    "pic": 3,
    "workspace": "acute",
    "fr": [
      "FR-011"
    ],
    "us": "US-OPS-10",
    "wf": [
      "WF-04"
    ],
    "entity": "encounter.bed_assignments",
    "description": "Bed manager mengelola occupancy dan transfer bed.",
    "roles": [
      "DPJP Rawat Inap",
      "Admin Sistem"
    ],
    "patient_context": false,
    "safety_gate": true,
    "ac_ids": [
      "US-OPS-10-AC-01",
      "US-OPS-10-AC-02",
      "US-OPS-10-AC-03",
      "US-OPS-10-AC-04",
      "US-OPS-10-AC-05",
      "US-OPS-10-AC-06"
    ],
    "fields": [
      {
        "key": "ward",
        "label": "Bangsal / unit",
        "type": "text",
        "required": true
      },
      {
        "key": "room_code",
        "label": "Kode kamar",
        "type": "text",
        "required": true
      },
      {
        "key": "bed_code",
        "label": "Kode bed",
        "type": "text",
        "required": true
      },
      {
        "key": "availability",
        "label": "Status ketersediaan",
        "type": "select",
        "required": true,
        "options": [
          "Kosong",
          "Terisi",
          "Dibersihkan",
          "Diblokir"
        ]
      },
      {
        "key": "checked_at",
        "label": "Waktu pemeriksaan",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "reason",
        "label": "Catatan perubahan status",
        "type": "textarea",
        "required": true
      }
    ]
  },
  {
    "code": "ENT-04",
    "name": "Clinical Pathway",
    "priority": "P1",
    "pic": 3,
    "workspace": "management",
    "fr": [
      "FR-015",
      "FR-033"
    ],
    "us": "US-ENT-04",
    "wf": [],
    "entity": "clinical.pathway_enrollments",
    "description": "DPJP menggunakan pathway dengan evidence tiap step.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-04-AC-01",
      "US-ENT-04-AC-02",
      "US-ENT-04-AC-03",
      "US-ENT-04-AC-04",
      "US-ENT-04-AC-05",
      "US-ENT-04-AC-06"
    ],
    "fields": []
  },
  {
    "code": "RME-08",
    "name": "CPOE & Order",
    "priority": "P0",
    "pic": 4,
    "workspace": "lab",
    "fr": [
      "FR-016"
    ],
    "us": "US-RME-08",
    "wf": [
      "WF-02",
      "WF-05"
    ],
    "entity": "orders.service_orders",
    "description": "Dokter membuat dan memantau order penunjang terpadu.",
    "roles": [
      "Dokter RJ",
      "Dokter IGD",
      "DPJP Rawat Inap"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-RME-08-AC-01",
      "US-RME-08-AC-02",
      "US-RME-08-AC-03",
      "US-RME-08-AC-04",
      "US-RME-08-AC-05",
      "US-RME-08-AC-06"
    ],
    "fields": [
      {
        "key": "order_type",
        "label": "Jenis order",
        "type": "select",
        "required": true,
        "options": [
          "Laboratorium",
          "Radiologi",
          "Tindakan",
          "Obat"
        ]
      },
      {
        "key": "service_code",
        "label": "Katalog layanan demo",
        "type": "select",
        "required": true,
        "options": [
          "CBC — Darah lengkap",
          "GLU — Glukosa",
          "XR-CHEST — Foto thorax",
          "ECG — EKG"
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
        "key": "ordered_at",
        "label": "Waktu order",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "indication",
        "label": "Indikasi klinis",
        "type": "textarea",
        "required": true
      },
      {
        "key": "orderer",
        "label": "Dokter pemesan",
        "type": "text",
        "required": true
      }
    ]
  },
  {
    "code": "MED-01",
    "name": "Laboratorium LIS",
    "priority": "P0",
    "pic": 4,
    "workspace": "lab",
    "fr": [
      "FR-017",
      "FR-034"
    ],
    "us": "US-MED-01",
    "wf": [
      "WF-05",
      "WF-14"
    ],
    "entity": "laboratory.lab_results",
    "description": "ATLM menelusuri order, spesimen, hasil sampai validasi.",
    "roles": [
      "ATLM"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-MED-01-AC-01",
      "US-MED-01-AC-02",
      "US-MED-01-AC-03",
      "US-MED-01-AC-04",
      "US-MED-01-AC-05",
      "US-MED-01-AC-06"
    ],
    "fields": [
      {
        "key": "accession",
        "label": "Accession ID sintetis",
        "type": "text",
        "required": true
      },
      {
        "key": "specimen_type",
        "label": "Jenis spesimen",
        "type": "select",
        "required": true,
        "options": [
          "Darah EDTA",
          "Serum",
          "Urine",
          "Swab"
        ]
      },
      {
        "key": "collected_at",
        "label": "Waktu pengambilan",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "test_code",
        "label": "Kode tes demo",
        "type": "text",
        "required": true
      },
      {
        "key": "result_value",
        "label": "Nilai hasil",
        "type": "text",
        "required": true
      },
      {
        "key": "unit_symbol",
        "label": "Satuan",
        "type": "text",
        "required": true
      },
      {
        "key": "lab_state",
        "label": "Status proses",
        "type": "select",
        "required": true,
        "options": [
          "Diterima",
          "Diproses",
          "Menunggu verifikasi"
        ]
      }
    ]
  },
  {
    "code": "MED-02",
    "name": "Radiologi RIS",
    "priority": "P1",
    "pic": 4,
    "workspace": "lab",
    "fr": [
      "FR-018"
    ],
    "us": "US-MED-02",
    "wf": [],
    "entity": "radiology.rad_orders",
    "description": "Radiografer/radiolog mengatur pemeriksaan sampai ekspertise.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-MED-02-AC-01",
      "US-MED-02-AC-02",
      "US-MED-02-AC-03",
      "US-MED-02-AC-04",
      "US-MED-02-AC-05",
      "US-MED-02-AC-06"
    ],
    "fields": []
  },
  {
    "code": "MED-03",
    "name": "PACS / DICOM",
    "priority": "P1",
    "pic": 4,
    "workspace": "lab",
    "fr": [
      "FR-018"
    ],
    "us": "US-MED-03",
    "wf": [],
    "entity": "radiology.study_references",
    "description": "Dokter berizin melihat studi gambar berkaitan encounter.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-MED-03-AC-01",
      "US-MED-03-AC-02",
      "US-MED-03-AC-03",
      "US-MED-03-AC-04",
      "US-MED-03-AC-05",
      "US-MED-03-AC-06"
    ],
    "fields": []
  },
  {
    "code": "MED-08",
    "name": "Hemodialisis",
    "priority": "P2",
    "pic": 4,
    "workspace": "lab",
    "fr": [
      "FR-019"
    ],
    "us": "US-MED-08",
    "wf": [],
    "entity": "operations.dialysis_sessions",
    "description": "Perawat HD memantau sesi, parameter, mesin, komplikasi.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-MED-08-AC-01",
      "US-MED-08-AC-02",
      "US-MED-08-AC-03",
      "US-MED-08-AC-04",
      "US-MED-08-AC-05",
      "US-MED-08-AC-06"
    ],
    "fields": []
  },
  {
    "code": "MED-09",
    "name": "Rehabilitasi Medik",
    "priority": "P2",
    "pic": 4,
    "workspace": "lab",
    "fr": [
      "FR-019"
    ],
    "us": "US-MED-09",
    "wf": [],
    "entity": "clinical.rehabilitation_sessions",
    "description": "Terapis merekam rencana, sesi, capaian fungsional.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-MED-09-AC-01",
      "US-MED-09-AC-02",
      "US-MED-09-AC-03",
      "US-MED-09-AC-04",
      "US-MED-09-AC-05",
      "US-MED-09-AC-06"
    ],
    "fields": []
  },
  {
    "code": "MED-10",
    "name": "Medical Check Up",
    "priority": "P2",
    "pic": 4,
    "workspace": "lab",
    "fr": [
      "FR-019"
    ],
    "us": "US-MED-10",
    "wf": [],
    "entity": "clinical.mcu_packages",
    "description": "Koordinator MCU mengelola paket, peserta, pemeriksaan dan buku MCU.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-MED-10-AC-01",
      "US-MED-10-AC-02",
      "US-MED-10-AC-03",
      "US-MED-10-AC-04",
      "US-MED-10-AC-05",
      "US-MED-10-AC-06"
    ],
    "fields": []
  },
  {
    "code": "MED-12",
    "name": "Bank Darah & Transfusi",
    "priority": "P2",
    "pic": 4,
    "workspace": "lab",
    "fr": [
      "FR-019",
      "FR-056"
    ],
    "us": "US-MED-12",
    "wf": [],
    "entity": "clinical.transfusion_administrations",
    "description": "Dokter/petugas darah mengelola request hingga pemberian.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-MED-12-AC-01",
      "US-MED-12-AC-02",
      "US-MED-12-AC-03",
      "US-MED-12-AC-04",
      "US-MED-12-AC-05",
      "US-MED-12-AC-06"
    ],
    "fields": []
  },
  {
    "code": "MED-04",
    "name": "Farmasi & E-Resep",
    "priority": "P0",
    "pic": 5,
    "workspace": "pharmacy",
    "fr": [
      "FR-020",
      "FR-037",
      "FR-038"
    ],
    "us": "US-MED-04",
    "wf": [
      "WF-07"
    ],
    "entity": "pharmacy.prescriptions",
    "description": "Dokter/farmasis membuat dan memverifikasi resep.",
    "roles": [
      "Dokter RJ",
      "Dokter IGD"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-MED-04-AC-01",
      "US-MED-04-AC-02",
      "US-MED-04-AC-03",
      "US-MED-04-AC-04",
      "US-MED-04-AC-05",
      "US-MED-04-AC-06"
    ],
    "fields": [
      {
        "key": "medication_code",
        "label": "Obat dari katalog demo",
        "type": "select",
        "required": true,
        "options": [
          "PARA-500 — Parasetamol 500 mg",
          "AMOX-500 — Amoksisilin 500 mg",
          "OMEP-20 — Omeprazol 20 mg"
        ]
      },
      {
        "key": "dose",
        "label": "Dosis per pemberian",
        "type": "text",
        "required": true
      },
      {
        "key": "route",
        "label": "Rute",
        "type": "select",
        "required": true,
        "options": [
          "Oral",
          "Intravena",
          "Topikal",
          "Inhalasi"
        ]
      },
      {
        "key": "frequency",
        "label": "Frekuensi",
        "type": "text",
        "required": true
      },
      {
        "key": "quantity",
        "label": "Jumlah",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "key": "allergy_checked",
        "label": "Status review alergi",
        "type": "select",
        "required": true,
        "options": [
          "Belum ditinjau",
          "Sudah ditinjau"
        ]
      },
      {
        "key": "prescriber",
        "label": "Penulis resep",
        "type": "text",
        "required": true
      }
    ]
  },
  {
    "code": "MED-05",
    "name": "Dispensing & BCMA",
    "priority": "P0",
    "pic": 5,
    "workspace": "pharmacy",
    "fr": [
      "FR-021",
      "FR-036"
    ],
    "us": "US-MED-05",
    "wf": [
      "WF-07"
    ],
    "entity": "pharmacy.dispenses",
    "description": "Farmasis menyerahkan obat berbasis lot FEFO dan scan.",
    "roles": [
      "Farmasis"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-MED-05-AC-01",
      "US-MED-05-AC-02",
      "US-MED-05-AC-03",
      "US-MED-05-AC-04",
      "US-MED-05-AC-05",
      "US-MED-05-AC-06"
    ],
    "fields": [
      {
        "key": "prescription_ref",
        "label": "ID resep demo",
        "type": "text",
        "required": true
      },
      {
        "key": "medication_code",
        "label": "Kode obat demo",
        "type": "text",
        "required": true
      },
      {
        "key": "lot_number",
        "label": "Nomor batch",
        "type": "text",
        "required": true
      },
      {
        "key": "expiry_date",
        "label": "Tanggal kedaluwarsa",
        "type": "date",
        "required": true
      },
      {
        "key": "quantity",
        "label": "Jumlah rencana dispense",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "key": "identity_check",
        "label": "Konfirmasi identitas",
        "type": "select",
        "required": true,
        "options": [
          "Belum ditinjau",
          "Sudah ditinjau"
        ]
      },
      {
        "key": "pharmacist",
        "label": "Farmasis reviewer",
        "type": "text",
        "required": true
      }
    ]
  },
  {
    "code": "MED-11",
    "name": "Gizi Klinis",
    "priority": "P1",
    "pic": 5,
    "workspace": "pharmacy",
    "fr": [
      "FR-024"
    ],
    "us": "US-MED-11",
    "wf": [],
    "entity": "nutrition.diet_orders",
    "description": "Ahli gizi menulis diet order berdasar asesmen.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-MED-11-AC-01",
      "US-MED-11-AC-02",
      "US-MED-11-AC-03",
      "US-MED-11-AC-04",
      "US-MED-11-AC-05",
      "US-MED-11-AC-06"
    ],
    "fields": []
  },
  {
    "code": "OPS-01",
    "name": "Gudang & Inventory",
    "priority": "P0",
    "pic": 5,
    "workspace": "pharmacy",
    "fr": [
      "FR-022",
      "FR-036"
    ],
    "us": "US-OPS-01",
    "wf": [
      "WF-15"
    ],
    "entity": "inventory.stock_movements",
    "description": "Gudang memproses lot dan mutasi antar lokasi.",
    "roles": [
      "Gudang"
    ],
    "patient_context": false,
    "safety_gate": true,
    "ac_ids": [
      "US-OPS-01-AC-01",
      "US-OPS-01-AC-02",
      "US-OPS-01-AC-03",
      "US-OPS-01-AC-04",
      "US-OPS-01-AC-05",
      "US-OPS-01-AC-06"
    ],
    "fields": [
      {
        "key": "item_code",
        "label": "Kode item",
        "type": "text",
        "required": true
      },
      {
        "key": "warehouse",
        "label": "Gudang / depo",
        "type": "text",
        "required": true
      },
      {
        "key": "lot_number",
        "label": "No. batch",
        "type": "text",
        "required": true
      },
      {
        "key": "quantity",
        "label": "Jumlah rencana",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "key": "inventory_action",
        "label": "Jenis tindakan",
        "type": "select",
        "required": true,
        "options": [
          "Opname (draft)",
          "Permintaan (draft)",
          "Transfer (draft)"
        ]
      },
      {
        "key": "reason",
        "label": "Alasan",
        "type": "textarea",
        "required": true
      }
    ]
  },
  {
    "code": "OPS-02",
    "name": "Purchase & Procurement",
    "priority": "P2",
    "pic": 5,
    "workspace": "pharmacy",
    "fr": [
      "FR-045"
    ],
    "us": "US-OPS-02",
    "wf": [],
    "entity": "procurement.purchase_orders",
    "description": "Pengadaan mengelola PR, RFQ, PO dan penerimaan.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-OPS-02-AC-01",
      "US-OPS-02-AC-02",
      "US-OPS-02-AC-03",
      "US-OPS-02-AC-04",
      "US-OPS-02-AC-05",
      "US-OPS-02-AC-06"
    ],
    "fields": []
  },
  {
    "code": "OPS-03",
    "name": "CSSD & Sterilisasi",
    "priority": "P1",
    "pic": 5,
    "workspace": "pharmacy",
    "fr": [
      "FR-023"
    ],
    "us": "US-OPS-03",
    "wf": [],
    "entity": "operations.cssd_cycles",
    "description": "CSSD melacak instrumen dan siklus steril sampai release.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-OPS-03-AC-01",
      "US-OPS-03-AC-02",
      "US-OPS-03-AC-03",
      "US-OPS-03-AC-04",
      "US-OPS-03-AC-05",
      "US-OPS-03-AC-06"
    ],
    "fields": []
  },
  {
    "code": "OPS-04",
    "name": "Laundry & Linen",
    "priority": "P2",
    "pic": 5,
    "workspace": "pharmacy",
    "fr": [
      "FR-023"
    ],
    "us": "US-OPS-04",
    "wf": [],
    "entity": "operations.linen_cycles",
    "description": "Laundry memantau batch, selisih dan distribusi linen.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-OPS-04-AC-01",
      "US-OPS-04-AC-02",
      "US-OPS-04-AC-03",
      "US-OPS-04-AC-04",
      "US-OPS-04-AC-05",
      "US-OPS-04-AC-06"
    ],
    "fields": []
  },
  {
    "code": "OPS-05",
    "name": "Produksi & Distribusi Gizi",
    "priority": "P1",
    "pic": 5,
    "workspace": "pharmacy",
    "fr": [
      "FR-024"
    ],
    "us": "US-OPS-05",
    "wf": [],
    "entity": "nutrition.kitchen_batches",
    "description": "Dapur memproduksi dan menyerahkan tray diet pasien.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-OPS-05-AC-01",
      "US-OPS-05-AC-02",
      "US-OPS-05-AC-03",
      "US-OPS-05-AC-04",
      "US-OPS-05-AC-05",
      "US-OPS-05-AC-06"
    ],
    "fields": []
  },
  {
    "code": "FIN-01",
    "name": "Charge Capture",
    "priority": "P0",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-025"
    ],
    "us": "US-FIN-01",
    "wf": [
      "WF-08"
    ],
    "entity": "billing.charges",
    "description": "Billing menghasilkan charge dari tindakan/penjualan sah.",
    "roles": [
      "Kasir"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-FIN-01-AC-01",
      "US-FIN-01-AC-02",
      "US-FIN-01-AC-03",
      "US-FIN-01-AC-04",
      "US-FIN-01-AC-05",
      "US-FIN-01-AC-06"
    ],
    "fields": [
      {
        "key": "service_ref",
        "label": "Kode layanan",
        "type": "text",
        "required": true
      },
      {
        "key": "performed_at",
        "label": "Waktu pelayanan",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "quantity",
        "label": "Jumlah layanan",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "key": "unit_price",
        "label": "Harga satuan (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "charge_category",
        "label": "Kategori charge",
        "type": "select",
        "required": true,
        "options": [
          "Layanan",
          "Tindakan",
          "Penunjang",
          "Obat"
        ]
      },
      {
        "key": "source_order",
        "label": "No. order demo",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "code": "FIN-02",
    "name": "Billing & Invoice",
    "priority": "P0",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-026"
    ],
    "us": "US-FIN-02",
    "wf": [
      "WF-08"
    ],
    "entity": "billing.invoices",
    "description": "Kasir menyusun invoice, koreksi dan saldo.",
    "roles": [
      "Kasir",
      "Casemix"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-FIN-02-AC-01",
      "US-FIN-02-AC-02",
      "US-FIN-02-AC-03",
      "US-FIN-02-AC-04",
      "US-FIN-02-AC-05",
      "US-FIN-02-AC-06"
    ],
    "fields": [
      {
        "key": "invoice_no",
        "label": "Nomor invoice demo",
        "type": "text",
        "required": true
      },
      {
        "key": "payer",
        "label": "Penjamin",
        "type": "select",
        "required": true,
        "options": [
          "Umum",
          "BPJS (demo)",
          "Asuransi (demo)"
        ]
      },
      {
        "key": "subtotal",
        "label": "Subtotal (Rp)",
        "type": "number",
        "required": true,
        "min": 0
      },
      {
        "key": "discount",
        "label": "Diskon (Rp)",
        "type": "number",
        "required": false,
        "min": 0
      },
      {
        "key": "due_date",
        "label": "Jatuh tempo",
        "type": "date",
        "required": true
      },
      {
        "key": "invoice_state",
        "label": "Status invoice",
        "type": "select",
        "required": true,
        "options": [
          "Draft",
          "Menunggu review"
        ]
      }
    ]
  },
  {
    "code": "FIN-03",
    "name": "Kasir & Pembayaran",
    "priority": "P0",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-026"
    ],
    "us": "US-FIN-03",
    "wf": [
      "WF-08"
    ],
    "entity": "billing.payments",
    "description": "Kasir menerima uang dan mengalokasikan invoice.",
    "roles": [
      "Kasir"
    ],
    "patient_context": true,
    "safety_gate": true,
    "ac_ids": [
      "US-FIN-03-AC-01",
      "US-FIN-03-AC-02",
      "US-FIN-03-AC-03",
      "US-FIN-03-AC-04",
      "US-FIN-03-AC-05",
      "US-FIN-03-AC-06"
    ],
    "fields": [
      {
        "key": "invoice_ref",
        "label": "No. invoice demo",
        "type": "text",
        "required": true
      },
      {
        "key": "payment_method",
        "label": "Metode pembayaran",
        "type": "select",
        "required": true,
        "options": [
          "Tunai (demo)",
          "Transfer (demo)",
          "EDC (demo)"
        ]
      },
      {
        "key": "amount",
        "label": "Jumlah (Rp)",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "key": "payment_at",
        "label": "Waktu bayar",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "payment_reference",
        "label": "Referensi transaksi demo",
        "type": "text",
        "required": false
      },
      {
        "key": "verification",
        "label": "Pemeriksaan transaksi",
        "type": "select",
        "required": true,
        "options": [
          "Belum diverifikasi",
          "Draft diverifikasi"
        ]
      }
    ]
  },
  {
    "code": "FIN-04",
    "name": "Coverage & Penjamin",
    "priority": "P0",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-027"
    ],
    "us": "US-FIN-04",
    "wf": [
      "WF-08"
    ],
    "entity": "billing.coverages",
    "description": "Verifikator memeriksa penjamin serta eligibility.",
    "roles": [
      "Pendaftaran",
      "Casemix"
    ],
    "patient_context": true,
    "safety_gate": false,
    "ac_ids": [
      "US-FIN-04-AC-01",
      "US-FIN-04-AC-02",
      "US-FIN-04-AC-03",
      "US-FIN-04-AC-04",
      "US-FIN-04-AC-05",
      "US-FIN-04-AC-06"
    ],
    "fields": [
      {
        "key": "payer_type",
        "label": "Penjamin",
        "type": "select",
        "required": true,
        "options": [
          "BPJS (demo)",
          "Asuransi perusahaan (demo)",
          "Umum"
        ]
      },
      {
        "key": "policy_no",
        "label": "No. kepesertaan demo",
        "type": "text",
        "required": true
      },
      {
        "key": "valid_from",
        "label": "Mulai berlaku",
        "type": "date",
        "required": true
      },
      {
        "key": "valid_until",
        "label": "Sampai berlaku",
        "type": "date",
        "required": true
      },
      {
        "key": "eligibility_state",
        "label": "Eligibility (demo)",
        "type": "select",
        "required": true,
        "options": [
          "Belum diverifikasi",
          "Layak (simulasi)",
          "Perlu tindak lanjut"
        ]
      },
      {
        "key": "notes",
        "label": "Catatan penjamin",
        "type": "textarea",
        "required": false
      }
    ]
  },
  {
    "code": "FIN-05",
    "name": "Bridging BPJS",
    "priority": "P1",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-027",
      "FR-064"
    ],
    "us": "US-FIN-05",
    "wf": [],
    "entity": "billing.bpjs_control_plans",
    "description": "Petugas BPJS meminta SEP, kontrol dan sinkronisasi.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-FIN-05-AC-01",
      "US-FIN-05-AC-02",
      "US-FIN-05-AC-03",
      "US-FIN-05-AC-04",
      "US-FIN-05-AC-05",
      "US-FIN-05-AC-06"
    ],
    "fields": []
  },
  {
    "code": "FIN-06",
    "name": "Casemix & INA-CBG",
    "priority": "P1",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-027"
    ],
    "us": "US-FIN-06",
    "wf": [],
    "entity": "billing.case_mix_episodes",
    "description": "Coder membuat grouping dari data klinis signed.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-FIN-06-AC-01",
      "US-FIN-06-AC-02",
      "US-FIN-06-AC-03",
      "US-FIN-06-AC-04",
      "US-FIN-06-AC-05",
      "US-FIN-06-AC-06"
    ],
    "fields": []
  },
  {
    "code": "FIN-07",
    "name": "Klaim BPJS & Swasta",
    "priority": "P1",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-040",
      "FR-041"
    ],
    "us": "US-FIN-07",
    "wf": [],
    "entity": "billing.claims",
    "description": "Casemix mengompilasi dossier dan submit klaim.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-FIN-07-AC-01",
      "US-FIN-07-AC-02",
      "US-FIN-07-AC-03",
      "US-FIN-07-AC-04",
      "US-FIN-07-AC-05",
      "US-FIN-07-AC-06"
    ],
    "fields": []
  },
  {
    "code": "FIN-08",
    "name": "Accounting & General Ledger",
    "priority": "P2",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-028"
    ],
    "us": "US-FIN-08",
    "wf": [],
    "entity": "finance.journal_entries",
    "description": "Akuntan memposting jurnal berimbang dan laporan.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-FIN-08-AC-01",
      "US-FIN-08-AC-02",
      "US-FIN-08-AC-03",
      "US-FIN-08-AC-04",
      "US-FIN-08-AC-05",
      "US-FIN-08-AC-06"
    ],
    "fields": []
  },
  {
    "code": "FIN-09",
    "name": "AP / AR",
    "priority": "P2",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-038",
      "FR-045"
    ],
    "us": "US-FIN-09",
    "wf": [],
    "entity": "finance.ap_bills",
    "description": "Finance mengelola utang-piutang dan rekonsiliasi.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-FIN-09-AC-01",
      "US-FIN-09-AC-02",
      "US-FIN-09-AC-03",
      "US-FIN-09-AC-04",
      "US-FIN-09-AC-05",
      "US-FIN-09-AC-06"
    ],
    "fields": []
  },
  {
    "code": "FIN-10",
    "name": "Budgeting",
    "priority": "P3",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-028"
    ],
    "us": "US-FIN-10",
    "wf": [],
    "entity": "finance.budgets",
    "description": "Budget owner mengelola versi anggaran pusat biaya.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-FIN-10-AC-01",
      "US-FIN-10-AC-02",
      "US-FIN-10-AC-03",
      "US-FIN-10-AC-04",
      "US-FIN-10-AC-05",
      "US-FIN-10-AC-06"
    ],
    "fields": []
  },
  {
    "code": "FIN-11",
    "name": "Unit Costing",
    "priority": "P3",
    "pic": 6,
    "workspace": "finance",
    "fr": [
      "FR-033",
      "FR-044"
    ],
    "us": "US-FIN-11",
    "wf": [],
    "entity": "finance.cost_profiles",
    "description": "Analis menghitung biaya unit berdasarkan driver.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-FIN-11-AC-01",
      "US-FIN-11-AC-02",
      "US-FIN-11-AC-03",
      "US-FIN-11-AC-04",
      "US-FIN-11-AC-05",
      "US-FIN-11-AC-06"
    ],
    "fields": []
  },
  {
    "code": "OPS-06",
    "name": "Manajemen Aset",
    "priority": "P2",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-044"
    ],
    "us": "US-OPS-06",
    "wf": [],
    "entity": "operations.assets",
    "description": "Petugas aset mengelola mesin, lokasi dan penggunaannya.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-OPS-06-AC-01",
      "US-OPS-06-AC-02",
      "US-OPS-06-AC-03",
      "US-OPS-06-AC-04",
      "US-OPS-06-AC-05",
      "US-OPS-06-AC-06"
    ],
    "fields": []
  },
  {
    "code": "OPS-07",
    "name": "Maintenance & Kalibrasi",
    "priority": "P2",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-044"
    ],
    "us": "US-OPS-07",
    "wf": [],
    "entity": "operations.maintenance_orders",
    "description": "Teknisi memelihara dan mengkalibrasi alat.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-OPS-07-AC-01",
      "US-OPS-07-AC-02",
      "US-OPS-07-AC-03",
      "US-OPS-07-AC-04",
      "US-OPS-07-AC-05",
      "US-OPS-07-AC-06"
    ],
    "fields": []
  },
  {
    "code": "OPS-08",
    "name": "Housekeeping & Fasilitas",
    "priority": "P3",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-023"
    ],
    "us": "US-OPS-08",
    "wf": [],
    "entity": "operations.facility_tasks",
    "description": "Fasilitas memantau task kebersihan/ruangan.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-OPS-08-AC-01",
      "US-OPS-08-AC-02",
      "US-OPS-08-AC-03",
      "US-OPS-08-AC-04",
      "US-OPS-08-AC-05",
      "US-OPS-08-AC-06"
    ],
    "fields": []
  },
  {
    "code": "OPS-09",
    "name": "Ambulans & Transportasi",
    "priority": "P3",
    "pic": 7,
    "workspace": "acute",
    "fr": [
      "FR-014"
    ],
    "us": "US-OPS-09",
    "wf": [],
    "entity": "operations.ambulance_trips",
    "description": "Koordinator mengelola transportasi pasien.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-OPS-09-AC-01",
      "US-OPS-09-AC-02",
      "US-OPS-09-AC-03",
      "US-OPS-09-AC-04",
      "US-OPS-09-AC-05",
      "US-OPS-09-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-01",
    "name": "HRIS & Personnel",
    "priority": "P2",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-029",
      "FR-046"
    ],
    "us": "US-ENT-01",
    "wf": [],
    "entity": "hr.employees",
    "description": "SDM mengelola jabatan, kompetensi dan riwayat pegawai.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-01-AC-01",
      "US-ENT-01-AC-02",
      "US-ENT-01-AC-03",
      "US-ENT-01-AC-04",
      "US-ENT-01-AC-05",
      "US-ENT-01-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-02",
    "name": "Attendance & Payroll",
    "priority": "P3",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-029"
    ],
    "us": "US-ENT-02",
    "wf": [],
    "entity": "hr.payroll_runs",
    "description": "Payroll admin mengunci periode gaji dan kehadiran.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-02-AC-01",
      "US-ENT-02-AC-02",
      "US-ENT-02-AC-03",
      "US-ENT-02-AC-04",
      "US-ENT-02-AC-05",
      "US-ENT-02-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-03",
    "name": "Rekrutmen & Talent",
    "priority": "P3",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-029"
    ],
    "us": "US-ENT-03",
    "wf": [],
    "entity": "hr.recruitment_applications",
    "description": "Rekruter memproses lamaran, stage dan talent review.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-03-AC-01",
      "US-ENT-03-AC-02",
      "US-ENT-03-AC-03",
      "US-ENT-03-AC-04",
      "US-ENT-03-AC-05",
      "US-ENT-03-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-05",
    "name": "HAIs & PPI",
    "priority": "P2",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-030"
    ],
    "us": "US-ENT-05",
    "wf": [],
    "entity": "quality.hai_episodes",
    "description": "Tim PPI mengelola kasus infeksi dan surveilans.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-05-AC-01",
      "US-ENT-05-AC-02",
      "US-ENT-05-AC-03",
      "US-ENT-05-AC-04",
      "US-ENT-05-AC-05",
      "US-ENT-05-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-06",
    "name": "Patient Safety",
    "priority": "P1",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-030"
    ],
    "us": "US-ENT-06",
    "wf": [],
    "entity": "quality.safety_incidents",
    "description": "Petugas keselamatan merekam insiden dan RCA.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-06-AC-01",
      "US-ENT-06-AC-02",
      "US-ENT-06-AC-03",
      "US-ENT-06-AC-04",
      "US-ENT-06-AC-05",
      "US-ENT-06-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-07",
    "name": "Risk Management",
    "priority": "P2",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-030"
    ],
    "us": "US-ENT-07",
    "wf": [],
    "entity": "quality.risk_registers",
    "description": "Manajer risiko mengelola penilaian dan mitigasi.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-07-AC-01",
      "US-ENT-07-AC-02",
      "US-ENT-07-AC-03",
      "US-ENT-07-AC-04",
      "US-ENT-07-AC-05",
      "US-ENT-07-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-08",
    "name": "Indikator Mutu",
    "priority": "P1",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-043"
    ],
    "us": "US-ENT-08",
    "wf": [],
    "entity": "quality.indicator_results",
    "description": "Tim mutu menghitung indikator berversi.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-08-AC-01",
      "US-ENT-08-AC-02",
      "US-ENT-08-AC-03",
      "US-ENT-08-AC-04",
      "US-ENT-08-AC-05",
      "US-ENT-08-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-09",
    "name": "Dynamic Reporting & RL",
    "priority": "P1",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-031"
    ],
    "us": "US-ENT-09",
    "wf": [],
    "entity": "analytics.report_definitions",
    "description": "Petugas membuat laporan terverifikasi untuk internal/resmi.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-09-AC-01",
      "US-ENT-09-AC-02",
      "US-ENT-09-AC-03",
      "US-ENT-09-AC-04",
      "US-ENT-09-AC-05",
      "US-ENT-09-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-10",
    "name": "Multi-Hospital Analytics",
    "priority": "P3",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-031"
    ],
    "us": "US-ENT-10",
    "wf": [],
    "entity": "analytics.read_model_watermarks",
    "description": "Direksi memantau indikator lintas unit dan organisasi.",
    "roles": [],
    "patient_context": false,
    "safety_gate": false,
    "ac_ids": [
      "US-ENT-10-AC-01",
      "US-ENT-10-AC-02",
      "US-ENT-10-AC-03",
      "US-ENT-10-AC-04",
      "US-ENT-10-AC-05",
      "US-ENT-10-AC-06"
    ],
    "fields": []
  },
  {
    "code": "ENT-11",
    "name": "SATUSEHAT & API Integration",
    "priority": "P0",
    "pic": 7,
    "workspace": "management",
    "fr": [
      "FR-032"
    ],
    "us": "US-ENT-11",
    "wf": [],
    "entity": "integration.outbox_events",
    "description": "Integrator mengirim payload FHIR melalui adapter berversi.",
    "roles": [
      "Integrasi",
      "Admin Sistem"
    ],
    "patient_context": false,
    "safety_gate": true,
    "ac_ids": [
      "US-ENT-11-AC-01",
      "US-ENT-11-AC-02",
      "US-ENT-11-AC-03",
      "US-ENT-11-AC-04",
      "US-ENT-11-AC-05",
      "US-ENT-11-AC-06"
    ],
    "fields": [
      {
        "key": "resource_type",
        "label": "Jenis sumber daya",
        "type": "select",
        "required": true,
        "options": [
          "Encounter",
          "Patient",
          "ServiceRequest",
          "Observation",
          "MedicationRequest"
        ]
      },
      {
        "key": "http_action",
        "label": "Tindakan API",
        "type": "select",
        "required": true,
        "options": [
          "POST",
          "PUT",
          "GET"
        ]
      },
      {
        "key": "correlation_id",
        "label": "Correlation ID demo",
        "type": "text",
        "required": true
      },
      {
        "key": "attempt_at",
        "label": "Waktu percobaan",
        "type": "datetime-local",
        "required": true
      },
      {
        "key": "ack_status",
        "label": "Status pengiriman simulasi",
        "type": "select",
        "required": true,
        "options": [
          "Pending",
          "ACK Sukses (simulasi)",
          "Ditolak (simulasi)"
        ]
      },
      {
        "key": "error_reason",
        "label": "Alasan / pesan mitra demo",
        "type": "textarea",
        "required": false
      }
    ]
  }
];
