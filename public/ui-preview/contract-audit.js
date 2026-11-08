/* Extracted manually from 2026-11-08 OpenAPI and model.json, for UI traceability only.
 * No API called; fields and mappings DO NOT constitute a valid request payload.
 * Sources: Google Drive files simrs_baru_openapi_3_1.yaml and model.json.
 */
(function(){
'use strict';
window.SIMRS_CONTRACT_AUDIT = {
  "CORE-08": {
    "path": "/api/v1/patients",
    "op": "createCORE08",
    "schema": "CORE08Create",
    "required": [
      "sex_code",
      "full_name"
    ],
    "columns": [
      "medical_record_no",
      "full_name_ciphertext",
      "birth_date",
      "sex_code",
      "status"
    ],
    "fields": {
      "full_name": [
        "patient_name",
        "Transformasi label → full_name"
      ],
      "sex_code": [
        "gender",
        "Perlu pemetaan kode jenis kelamin"
      ],
      "birth_date": [
        "dob",
        "Ubah DOB → birth_date"
      ],
      "identifier_value": [
        "nik_demo",
        "NIK sintetis saja; kontrak bukan bukti identitas"
      ],
      "medical_record_no": [
        "(konteks pasien)",
        "Bukan input form saat ini"
      ]
    },
    "gaps": [
      "Tidak ada lookup dan verifikasi identitas server; patient ID demo bukan UUID backend.",
      "Data identitas klinis tidak boleh dikirim dari browser demo."
    ]
  },
  "CORE-09": {
    "path": "/api/v1/registrations",
    "op": "createCORE09",
    "schema": "CORE09Create",
    "required": [
      "patient_id",
      "care_setting",
      "registered_at",
      "unit_id"
    ],
    "columns": [
      "patient_id",
      "registration_no",
      "care_setting",
      "registered_at",
      "status"
    ],
    "fields": {
      "patient_id": [
        "(konteks pasien)",
        "ID demo, bukan UUID patient backend"
      ],
      "care_setting": [
        "visit_type",
        "Butuh enum care-setting terkonfirmasi"
      ],
      "registered_at": [
        "visit_date",
        "Perlu datetime lengkap beserta zona waktu"
      ],
      "unit_id": [
        "unit",
        "Pilihan nama unit bukan UUID master unit"
      ],
      "registration_no": [
        "(otomatis oleh server)",
        "Belum ada server"
      ]
    },
    "gaps": [
      "Wajib ada ID pasien dan unit referensial dari master data yang sah.",
      "Tanggal form masih date-only, API mensyaratkan date-time."
    ]
  },
  "CORE-10": {
    "path": "/api/v1/appointments",
    "op": "createCORE10",
    "schema": "CORE10Create",
    "required": [
      "patient_id",
      "slot_id"
    ],
    "columns": [
      "patient_id",
      "slot_id",
      "appointment_no",
      "status",
      "reason"
    ],
    "fields": {
      "patient_id": [
        "(konteks pasien)",
        "ID pasien sintetis"
      ],
      "slot_id": [
        "(belum tersedia)",
        "Jadwal masih free-text, bukan slot ID"
      ],
      "reason": [
        "visit_reason",
        "Padanan sementara"
      ],
      "appointment_no": [
        "(otomatis oleh server)",
        "Belum ada server"
      ]
    },
    "gaps": [
      "Belum ada slot scheduling referensial dengan capacity dan conflict checks."
    ]
  },
  "RME-01": {
    "path": "/api/v1/clinical/outpatient",
    "op": "createRME01",
    "schema": "RME01Create",
    "required": [
      "registration_id",
      "patient_id",
      "encounter_type",
      "starts_at"
    ],
    "columns": [
      "registration_id",
      "patient_id",
      "encounter_type",
      "starts_at",
      "ends_at",
      "status"
    ],
    "fields": {
      "registration_id": [
        "(belum tersedia)",
        "Harus refer ke Registration yang sudah dibuat"
      ],
      "patient_id": [
        "(konteks pasien)",
        "ID sintetis, bukan UUID pasien"
      ],
      "encounter_type": [
        "(belum tersedia)",
        "Perlu kode encounter_type"
      ],
      "starts_at": [
        "recorded_at",
        "Datetime lokal memerlukan zona waktu"
      ],
      "ends_at": [
        "(belum tersedia)",
        "Opsional di API"
      ]
    },
    "gaps": [
      "Encounter dan registration masih belum memiliki relasi ID backend yang tervalidasi."
    ]
  },
  "RME-04": {
    "path": "/api/v1/clinical/notes",
    "op": "createRME04",
    "schema": "RME04Create",
    "required": [
      "encounter_id",
      "author_id",
      "note_type",
      "content_ref"
    ],
    "columns": [
      "encounter_id",
      "author_id",
      "note_type",
      "content_ref",
      "status",
      "signed_at",
      "sha256"
    ],
    "fields": {
      "encounter_id": [
        "(konteks encounter)",
        "ID demo, bukan UUID server"
      ],
      "author_id": [
        "author",
        "Nama penulis bukan practitioner ID"
      ],
      "note_type": [
        "note_type",
        "Padanan label masih harus dicek ke terminologi"
      ],
      "content_ref": [
        "subjective/objective/assessment/plan",
        "Memerlukan penyimpanan catatan dan content_ref, bukan teks langsung"
      ],
      "signed_at": [
        "(nonaktif)",
        "Signature nyata tidak tersedia"
      ]
    },
    "gaps": [
      "SOAP belum menghasilkan content_ref aman dan versioned.",
      "Sign/approval tetap nonaktif sampai kontrol server dan UAT."
    ]
  },
  "RME-08": {
    "path": "/api/v1/orders",
    "op": "createRME08",
    "schema": "RME08Create",
    "required": [
      "encounter_id",
      "order_type",
      "ordered_by",
      "priority",
      "clinical_indication",
      "items"
    ],
    "columns": [
      "encounter_id",
      "order_no",
      "order_type",
      "ordered_by",
      "priority",
      "clinical_indication",
      "status"
    ],
    "fields": {
      "encounter_id": [
        "(konteks encounter)",
        "ID sintetis"
      ],
      "order_type": [
        "order_type",
        "Butuh validasi enum"
      ],
      "ordered_by": [
        "orderer",
        "Nama pemesan bukan practitioner UUID"
      ],
      "priority": [
        "priority",
        "Butuh kode prioritas terstandardisasi"
      ],
      "clinical_indication": [
        "indication",
        "Padanan label"
      ],
      "items": [
        "service_code",
        "Belum berupa array item order dengan referensi layanan"
      ]
    },
    "gaps": [
      "Belum ada item-level CPOE (array dengan minimal 1 item).",
      "Catalog service_code belum lookup master berbasis ID."
    ]
  },
  "MED-01": {
    "path": "/api/v1/laboratory/results",
    "op": "createMED01",
    "schema": "MED01Create",
    "required": [
      "specimen_id",
      "concept_code"
    ],
    "columns": [
      "specimen_id",
      "test_id",
      "concept_code",
      "result_value",
      "result_numeric",
      "unit_code",
      "abnormal_flag",
      "status",
      "verified_at"
    ],
    "fields": {
      "specimen_id": [
        "accession",
        "Accession text bukan UUID specimen"
      ],
      "concept_code": [
        "test_code",
        "Kode tes butuh terminology mapping"
      ],
      "result_value": [
        "result_value",
        "Padanan langsung bila tipe sesuai"
      ],
      "unit_code": [
        "unit_symbol",
        "Harus kode UCUM yang valid"
      ],
      "test_id": [
        "(belum tersedia)",
        "Opsional, perlu master tes"
      ],
      "verified_at": [
        "(nonaktif)",
        "Verifikasi hasil riil belum tersedia"
      ]
    },
    "gaps": [
      "Tidak ada specimen ID resmi dan test catalog lookup.",
      "Release hasil tetap nonaktif."
    ]
  },
  "MED-04": {
    "path": "/api/v1/pharmacy/prescriptions",
    "op": "createMED04",
    "schema": "MED04Create",
    "required": [
      "encounter_id",
      "author_id",
      "items"
    ],
    "columns": [
      "encounter_id",
      "order_id",
      "author_id",
      "signed_at",
      "status"
    ],
    "fields": {
      "encounter_id": [
        "(konteks encounter)",
        "ID sintetis"
      ],
      "author_id": [
        "prescriber",
        "Nama penulis bukan UUID praktisi"
      ],
      "items": [
        "medication_code/dose/route/frequency/quantity",
        "Perlu array medication_id, dose_unit, route_code, dst."
      ],
      "order_id": [
        "(relasi order)",
        "Belum ID order server"
      ],
      "signed_at": [
        "(nonaktif)",
        "Penandatanganan riil tidak tersedia"
      ]
    },
    "gaps": [
      "Obat adalah string demo, belum medication_id versi katalog KFA.",
      "Alergi hanya diperiksa secara UI; otorisasi klinis tidak berlaku."
    ]
  },
  "MED-05": {
    "path": "/api/v1/pharmacy/dispenses",
    "op": "createMED05",
    "schema": "MED05Create",
    "required": [
      "prescription_item_id",
      "lot_id",
      "quantity"
    ],
    "columns": [
      "prescription_item_id",
      "lot_id",
      "quantity",
      "dispensed_at",
      "pharmacist_id",
      "status"
    ],
    "fields": {
      "prescription_item_id": [
        "prescription_ref",
        "Ref resep draft, bukan item resep UUID"
      ],
      "lot_id": [
        "lot_number",
        "Nomor lot string, bukan ID lot"
      ],
      "quantity": [
        "quantity",
        "Padanan langsung bila valid"
      ],
      "dispensed_at": [
        "(nonaktif)",
        "Peristiwa dispense belum tersedia"
      ],
      "pharmacist_id": [
        "pharmacist",
        "Nama farmasis bukan UUID"
      ]
    },
    "gaps": [
      "Tidak boleh mengubah stock ledger atau menandai dispense nyata.",
      "Lot harus divalidasi terhadap stock lot dan kedaluwarsa."
    ]
  },
  "FIN-01": {
    "path": "/api/v1/billing/charges",
    "op": "createFIN01",
    "schema": "FIN01Create",
    "required": [
      "encounter_id",
      "source_type",
      "source_id",
      "charge_type",
      "amount"
    ],
    "columns": [
      "encounter_id",
      "source_type",
      "source_id",
      "charge_type",
      "amount",
      "status"
    ],
    "fields": {
      "encounter_id": [
        "(konteks encounter)",
        "ID sintetis"
      ],
      "source_type": [
        "charge_category",
        "Kategori charge belum sama dengan source_type"
      ],
      "source_id": [
        "source_order",
        "ID order sintetis, bukan UUID source"
      ],
      "charge_type": [
        "charge_category",
        "Perlu kode charge_type master"
      ],
      "amount": [
        "quantity × unit_price",
        "Perhitungan rencana; API butuh amount"
      ]
    },
    "gaps": [
      "Sumber charge harus objek layanan tervalidasi.",
      "Nominal hasil simulasi belum terikat tarif berversi."
    ]
  },
  "FIN-02": {
    "path": "/api/v1/billing/invoices",
    "op": "createFIN02",
    "schema": "FIN02Create",
    "required": [
      "encounter_id",
      "total",
      "balance",
      "charge_ids"
    ],
    "columns": [
      "encounter_id",
      "invoice_no",
      "total",
      "balance",
      "status"
    ],
    "fields": {
      "encounter_id": [
        "(konteks encounter)",
        "ID sintetis"
      ],
      "total": [
        "subtotal – discount",
        "Rencana kalkulasi lokal"
      ],
      "balance": [
        "subtotal – discount",
        "Belum terkait pembayaran/adjustment"
      ],
      "charge_ids": [
        "charge_lines[].charge_ref → charge_ids[] (demo)",
        "ID lokal sintetis; perlu UUID charge aktif, ledger, dan DTO"
      ],
      "invoice_no": [
        "invoice_no",
        "Nomor sintetis"
      ]
    },
    "gaps": [
      "Komposer charge_ids[] ada di mockup; UUID dan invoice ledger belum tervalidasi.",
      "Settlement dan posting finansial tetap nonaktif."
    ]
  },
  "FIN-03": {
    "path": "/api/v1/payments",
    "op": "createFIN03",
    "schema": "FIN03Create",
    "required": [
      "payer_type",
      "amount",
      "method_code",
      "allocations"
    ],
    "columns": [
      "payment_no",
      "payer_type",
      "amount",
      "method_code",
      "payment_status",
      "settled_at"
    ],
    "fields": {
      "payer_type": [
        "(penjamin visit)",
        "Belum pilihan payer_type yang sesuai enum"
      ],
      "amount": [
        "amount",
        "Padanan jumlah"
      ],
      "method_code": [
        "payment_method",
        "Label metode demo perlu kode metode"
      ],
      "allocations": [
        "allocations[].invoice_ref/amount (demo)",
        "ID referensi lokal; belum memenuhi UUID dan schema API"
      ],
      "payment_no": [
        "payment_reference",
        "Nomor transaksi sintetis"
      ],
      "settled_at": [
        "(nonaktif)",
        "Settlement riil tidak tersedia"
      ]
    },
    "gaps": [
      "Komposer allocations[] sudah ada dalam mockup, tetapi belum menghasilkan payload DTO valid.",
      "Pengakuan kas/settlement riil tetap nonaktif."
    ]
  }
};
})();
