/* SIMRS Baru V10 — 12 role-native worklists, data sintetis saja.
 * PRD baseline 6 November 2026. Tidak menambah izin akses.
 */
(function(){
"use strict";
var v4=window.SIMRSRoleUXV4,api=window.SIMRSRoleUXV5;
if(!v4||!api)return;
var templates={
  "DPJP Rawat Inap": {
    "kind": "patient",
    "prefix": "RI-DPJP",
    "rows": [
      [
        "001",
        "Visite ruang Melati A",
        "Bed A-05 · rawat inap"
      ],
      [
        "002",
        "Visite ruang Melati B",
        "Bed B-07 · rawat inap"
      ],
      [
        "003",
        "Evaluasi pasien observasi",
        "Bed B-02 · rawat inap"
      ],
      [
        "004",
        "Persiapan pasien pulang",
        "Bed C-04 · rawat inap"
      ]
    ],
    "steps": [
      [
        "Daftar episode perlu dicocokkan dengan penugasan DPJP",
        "Cocokkan episode, ruang, dan nomor bed",
        "Pastikan DPJP berwenang pada periode visite"
      ],
      [
        "Catatan visite belum lengkap",
        "Baca tanda vital, alergi, dan hasil baru",
        "Dokumentasikan SOAP tanpa sign otomatis"
      ],
      [
        "Rencana kolaborasi belum ditinjau",
        "Tinjau intervensi dan tugas tim",
        "Jangan mengubah instruksi tim lain"
      ],
      [
        "Order memerlukan konfirmasi indikasi",
        "Periksa alasan dan prioritas pemeriksaan",
        "Jangan kirim order ke LIS/RIS dari demo"
      ],
      [
        "Kesiapan pulang perlu rekonsiliasi",
        "Periksa obat dan edukasi pulang",
        "Jangan melakukan discharge nyata"
      ],
      [
        "Resume medis memerlukan telaah",
        "Cek diagnosis, terapi, dan tindak lanjut",
        "Tidak menerbitkan resume signed"
      ],
      [
        "Deviasi pathway perlu klarifikasi",
        "Tinjau fase dan variansi klinis",
        "Tidak mengesahkan pathway pasien"
      ]
    ]
  },
  "ATLM": {
    "kind": "patient",
    "prefix": "LAB",
    "rows": [
      [
        "001",
        "Darah lengkap",
        "Sampel EDTA · pengambilan pagi"
      ],
      [
        "002",
        "Gula darah",
        "Sampel serum · pemeriksaan rutin"
      ],
      [
        "003",
        "Elektrolit",
        "Sampel plasma · prioritas IGD"
      ],
      [
        "004",
        "Kimia darah",
        "Sampel serum · pemeriksaan ulang"
      ]
    ],
    "steps": [
      [
        "Order laboratorium memerlukan peninjauan",
        "Cocokkan order dan encounter",
        "Periksa jenis pemeriksaan dan urgensi"
      ],
      [
        "Barcode spesimen perlu dicocokkan",
        "Verifikasi label dan kualitas spesimen",
        "Tidak melakukan penerimaan nyata"
      ],
      [
        "Hasil analyzer perlu telaah teknis",
        "Cek satuan, rentang, dan QC",
        "Tidak mempublikasikan hasil asli"
      ],
      [
        "Nilai kritis memerlukan eskalasi",
        "Tinjau batas dan konfirmasi hasil",
        "Catat komunikasi hanya secara demo"
      ]
    ]
  },
  "Petugas MCU": {
    "kind": "object",
    "prefix": "MCU",
    "rows": [
      [
        "001",
        "Paket perusahaan A",
        "Standar · daftar peserta demo"
      ],
      [
        "002",
        "Paket perusahaan B",
        "Eksekutif · jadwal hari ini"
      ],
      [
        "003",
        "Komponen MCU tertunda",
        "Pemeriksaan laboratorium"
      ],
      [
        "004",
        "Review laporan MCU",
        "Pemeriksaan radiologi"
      ]
    ],
    "steps": [
      [
        "Jadwal dan paket perlu konfirmasi",
        "Cocokkan paket dan komponen wajib",
        "Jangan gunakan identitas peserta nyata"
      ],
      [
        "Progres pemeriksaan belum lengkap",
        "Bandingkan komponen dan hasil",
        "Cek status layanan penunjang"
      ],
      [
        "Komponen hasil perlu dilengkapi",
        "Review pemeriksaan tertunda",
        "Tidak menerbitkan laporan MCU resmi"
      ]
    ]
  },
  "Radiografer": {
    "kind": "object",
    "prefix": "RAD-EX",
    "rows": [
      [
        "001",
        "Rontgen thoraks",
        "Modalitas CR · rutin"
      ],
      [
        "002",
        "CT kepala",
        "Modalitas CT · IGD"
      ],
      [
        "003",
        "USG abdomen",
        "Modalitas USG · rawat jalan"
      ],
      [
        "004",
        "Foto ekstremitas",
        "Modalitas DR · kontrol"
      ]
    ],
    "steps": [
      [
        "Order radiologi perlu dicocokkan",
        "Verifikasi jenis pemeriksaan dan jadwal",
        "Jangan mengubah order produksi"
      ],
      [
        "Protokol pemeriksaan perlu review",
        "Cek persiapan dan checklist keselamatan",
        "Tidak menandai tindakan telah terlaksana"
      ],
      [
        "Kelengkapan citra belum dikonfirmasi",
        "Review seri dan metadata studi",
        "Tidak mengunggah DICOM ke PACS nyata"
      ]
    ]
  },
  "Radiolog": {
    "kind": "object",
    "prefix": "RAD-REP",
    "rows": [
      [
        "001",
        "Studi CT kepala",
        "Menunggu ekspertise · IGD"
      ],
      [
        "002",
        "Rontgen thoraks",
        "Menunggu laporan · rawat jalan"
      ],
      [
        "003",
        "USG abdomen",
        "Seri citra perlu ditinjau"
      ],
      [
        "004",
        "MRI lutut",
        "Draft laporan menunggu"
      ]
    ],
    "steps": [
      [
        "Studi memerlukan alokasi pembaca",
        "Cocokkan studi, order, dan dokter",
        "Periksa prioritas laporan"
      ],
      [
        "Ketersediaan seri citra perlu verifikasi",
        "Periksa seri dan protokol citra",
        "Viewer bukan PACS terkalibrasi"
      ],
      [
        "Laporan ekspertise memerlukan review",
        "Periksa temuan dan kesimpulan",
        "Tidak melakukan release laporan klinis"
      ]
    ]
  },
  "Casemix": {
    "kind": "object",
    "prefix": "CMX",
    "rows": [
      [
        "001",
        "Episode klaim RI A",
        "Resume dan lampiran"
      ],
      [
        "002",
        "Episode klaim RJ B",
        "Kode diagnosis dan prosedur"
      ],
      [
        "003",
        "Klaim tertunda C",
        "Dokumen penjamin"
      ],
      [
        "004",
        "Rekonsiliasi klaim D",
        "Koreksi coding"
      ]
    ],
    "steps": [
      [
        "Berkas episode perlu verifikasi",
        "Cek resume dan bukti layanan",
        "Pastikan episode bersumber jelas"
      ],
      [
        "Kode dan grouping perlu review",
        "Periksa kode dan versi grouping",
        "Tidak menjalankan submit klaim BPJS"
      ],
      [
        "Dossier klaim perlu dilengkapi",
        "Cek eligibility dan lampiran",
        "Tidak melakukan settlement"
      ]
    ]
  },
  "Koordinator OK": {
    "kind": "object",
    "prefix": "OK",
    "rows": [
      [
        "001",
        "Operasi elektif A",
        "OK-1 · pagi"
      ],
      [
        "002",
        "Operasi elektif B",
        "OK-2 · siang"
      ],
      [
        "003",
        "Operasi prioritas C",
        "Jadwal perlu konfirmasi"
      ],
      [
        "004",
        "Operasi terjadwal D",
        "Kesiapan instrumen"
      ]
    ],
    "steps": [
      [
        "Jadwal operasi menunggu konfirmasi",
        "Periksa tim, ruang, dan instrumen",
        "Tidak melakukan booking riil"
      ],
      [
        "Checklist keselamatan perlu ditinjau",
        "Cocokkan lokasi dan persetujuan",
        "Demo tidak menggantikan time-out klinis"
      ],
      [
        "Status proses dan pemulihan perlu review",
        "Cek ruang dan alur serah terima",
        "Tidak mengubah status operasi nyata"
      ]
    ]
  },
  "Dokter Anestesi": {
    "kind": "object",
    "prefix": "ANS",
    "rows": [
      [
        "001",
        "Asesmen pra-anestesi A",
        "OK-1 · jadwal pagi"
      ],
      [
        "002",
        "Pemantauan tindakan B",
        "OK-2 · jadwal siang"
      ],
      [
        "003",
        "Pemulihan PACU C",
        "Observasi pascatindakan"
      ],
      [
        "004",
        "Konsultasi anestesi D",
        "Rencana teknik"
      ]
    ],
    "steps": [
      [
        "Risiko pra-anestesi menunggu review",
        "Periksa alergi, airway, dan komorbid",
        "Tidak memberi persetujuan riil"
      ],
      [
        "Monitoring hanya data simulasi",
        "Tinjau interval dan parameter",
        "Bukan monitoring fisiologis realtime"
      ],
      [
        "Kriteria pulang PACU perlu ditinjau",
        "Periksa skor pemulihan dan serah terima",
        "Tidak memutuskan pemindahan pasien"
      ]
    ]
  },
  "Tim Mutu": {
    "kind": "object",
    "prefix": "QPS",
    "rows": [
      [
        "001",
        "Indikator waktu tunggu",
        "Validasi numerator/denominator"
      ],
      [
        "002",
        "Insiden keselamatan demo",
        "Review pembelajaran"
      ],
      [
        "003",
        "Register risiko layanan",
        "Bukti mitigasi"
      ],
      [
        "004",
        "Laporan mutu triwulan",
        "Rekonsiliasi indikator"
      ]
    ],
    "steps": [
      [
        "Definisi indikator belum dikonfirmasi",
        "Periksa numerator dan denominator",
        "Cek periode dan unit sumber"
      ],
      [
        "Insiden perlu akses terbatas",
        "Tinjau klasifikasi dan pembelajaran",
        "Jangan tampilkan informasi pasien sensitif"
      ],
      [
        "Mitigasi risiko perlu bukti",
        "Periksa pemilik risiko dan tindak lanjut",
        "Jangan menandai kontrol aktif tanpa bukti"
      ],
      [
        "Laporan indikator perlu review",
        "Rekonsiliasi periode dan sumber",
        "Belum menjadi laporan resmi RS"
      ]
    ]
  },
  "Admin Sistem": {
    "kind": "object",
    "prefix": "ADM",
    "rows": [
      [
        "001",
        "Permintaan akses staf",
        "Unit rawat jalan · role"
      ],
      [
        "002",
        "Perubahan struktur unit",
        "Loket dan poliklinik"
      ],
      [
        "003",
        "Kredensial tenaga medis",
        "Masa berlaku penugasan"
      ],
      [
        "004",
        "Pembaruan master data",
        "Tarif dan terminologi"
      ]
    ],
    "kindBySection": {
      "m5": "patient"
    },
    "rowsBySection": {
      "m5": [
        [
          "001",
          "Review consent A",
          "Cakupan akses pasien"
        ],
        [
          "002",
          "Review consent B",
          "Masa berlaku akses"
        ],
        [
          "003",
          "Review consent C",
          "Kewenangan pemohon"
        ],
        [
          "004",
          "Review consent D",
          "Audit akses sintetis"
        ]
      ]
    },
    "steps": [
      [
        "Permintaan role perlu verifikasi",
        "Periksa unit dan batas akses",
        "Tidak memberi akses produksi"
      ],
      [
        "Struktur unit memerlukan review",
        "Cocokkan organisasi induk",
        "Jangan mengubah struktur tenant"
      ],
      [
        "Kredensial praktisi perlu validasi",
        "Cek izin profesi dan tanggal berlaku",
        "Tidak menerbitkan kewenangan SDMK"
      ],
      [
        "Tarif memerlukan versi efektif",
        "Cocokkan unit dan tanggal tarif",
        "Tidak memposting charge nyata"
      ],
      [
        "Kode terminologi perlu tinjauan",
        "Periksa sistem kode dan versi",
        "Tidak menerbitkan mapping produksi"
      ],
      [
        "Consent pasien memerlukan validasi",
        "Periksa identitas dan periode consent",
        "Tidak membuka rekam medis nyata"
      ],
      [
        "Tenant dan organisasi perlu audit",
        "Periksa isolasi organisasi",
        "Tidak mengubah konfigurasi produksi"
      ],
      [
        "Master bed perlu sinkronisasi",
        "Periksa kode ruang dan bed",
        "Tidak mengubah okupansi operasional"
      ]
    ]
  },
  "Integrasi": {
    "kind": "object",
    "prefix": "INT",
    "rows": [
      [
        "001",
        "Batch interoperabilitas A",
        "Job pengiriman sintetis"
      ],
      [
        "002",
        "ACK partner B",
        "Respons contoh"
      ],
      [
        "003",
        "Kegagalan payload C",
        "Mapping kode"
      ],
      [
        "004",
        "Rekonsiliasi pesan D",
        "Ledger pengiriman"
      ]
    ],
    "steps": [
      [
        "Job pengiriman perlu verifikasi",
        "Periksa sumber tujuan dan correlation ID",
        "Tidak mengirim request ke endpoint eksternal"
      ],
      [
        "ACK partner perlu ditelaah",
        "Bandingkan status dan response",
        "Tidak menjalankan retry nyata"
      ],
      [
        "Delivery ledger perlu rekonsiliasi",
        "Cek idempotensi dan urutan event",
        "Tidak melakukan replay produksi"
      ]
    ]
  },
  "Gudang": {
    "kind": "object",
    "prefix": "STK",
    "rows": [
      [
        "001",
        "Saldo stok farmasi A",
        "Lot 24A · apotek"
      ],
      [
        "002",
        "Permintaan unit B",
        "Distribusi belum disetujui"
      ],
      [
        "003",
        "Penerimaan supplier C",
        "Lot dan dokumen batch"
      ],
      [
        "004",
        "Selisih stocktake D",
        "Bukti investigasi"
      ]
    ],
    "steps": [
      [
        "Saldo dan lot perlu dicocokkan",
        "Cek satuan, lokasi dan expiry",
        "Saldo mockup bukan ledger nyata"
      ],
      [
        "Permintaan unit perlu verifikasi",
        "Periksa kuantitas dan tujuan",
        "Tidak menjalankan distribusi stok"
      ],
      [
        "Dokumen penerimaan perlu ditinjau",
        "Cek lot dan tanggal kadaluarsa",
        "Tidak memposting penerimaan"
      ],
      [
        "Selisih membutuhkan investigasi",
        "Tinjau sebab dan dokumen bukti",
        "Tidak menjalankan koreksi ledger"
      ]
    ]
  }
};
var installed=[];
Object.keys(templates).forEach(function(role){
 var d=templates[role],profile=v4.getProfile(role);
 if(!profile||profile.features.length!==d.steps.length||d.rows.length!==4)return;
 var stages=profile.features.map(function(f,i){
  var item=d.steps[i],reason=item[0];
  return [f.label,[reason,"Konfirmasi belum lengkap: "+reason,
   "Perlu klarifikasi: "+reason,"Review lanjutan: "+reason],
   ["Periksa tugas sesuai unit dan kewenangan "+role,item[1],item[2]]];
 });
 var convert=function(rows){return rows.map(function(r){return [d.prefix+"-"+r[0],r[1],r[2]];});};
 var spec={kind:d.kind,rows:convert(d.rows),stages:stages};
 if(d.kindBySection)spec.kindBySection=d.kindBySection;
 if(d.rowsBySection){
  spec.rowsBySection={};
  Object.keys(d.rowsBySection).forEach(function(key){spec.rowsBySection[key]=convert(d.rowsBySection[key]);});
 }
 api.specs[role]=spec;installed.push(role);
});
window.SIMRSRoleUXV10={roles:installed.slice(),templates:templates};
})();
