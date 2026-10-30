(function(){
"use strict";
const moduleGroups=[
{name:"Core Platform & Administration",code:"CORE",color:"blue",icon:"▦",modules:["Tenant & Multi-RS","Identity & Access","Master Organization","Master Practitioner","Master Location & Bed","Master Layanan & Tarif","Terminology Service","MPI & Rekonsiliasi Pasien","Registrasi & Front Office","Appointment & Scheduling","Antrean & Kiosk","Consent & Disclosure"]},
{name:"Clinical / Frontoffice",code:"RME",color:"teal",icon:"✚",modules:["Rawat Jalan","IGD & Triase","Rawat Inap & Discharge","CPPT / SOAP","Asesmen & TTV","Diagnosis & Prosedur","Keperawatan","CPOE & Order","Care Plan & Care Team","Rujukan Internal/Eksternal","Dokumen & Tanda Tangan","Portal Pasien"]},
{name:"Penunjang Medis",code:"MED",color:"purple",icon:"⚗",modules:["Laboratorium LIS","Radiologi RIS","PACS / DICOM","Farmasi & E-Resep","Dispensing & BCMA","Operasi & Kamar Bedah","Anestesi & Recovery","Hemodialisis","Rehabilitasi Medik","Medical Check Up","Gizi Klinis","Bank Darah & Transfusi"]},
{name:"Operasional Rumah Sakit",code:"OPS",color:"orange",icon:"▤",modules:["Gudang & Inventory","Purchase & Procurement","CSSD & Sterilisasi","Laundry & Linen","Produksi & Distribusi Gizi","Manajemen Aset","Maintenance & Kalibrasi","Housekeeping & Fasilitas","Ambulans & Transportasi","Manajemen Bed Operasional"]},
{name:"Finance, Billing & Claims",code:"FIN",color:"blue",icon:"▣",modules:["Charge Capture","Billing & Invoice","Kasir & Pembayaran","Coverage & Penjamin","Bridging BPJS","Casemix & INA-CBG","Klaim BPJS & Swasta","Accounting & General Ledger","AP / AR","Budgeting","Unit Costing"]},
{name:"HR, Quality & Enterprise",code:"ENT",color:"teal",icon:"◈",modules:["HRIS & Personnel","Attendance & Payroll","Rekrutmen & Talent","Clinical Pathway","HAIs & PPI","Patient Safety","Risk Management","Indikator Mutu","Dynamic Reporting & RL","Multi-Hospital Analytics","SATUSEHAT & API Integration",]}
];
const db={
identity:{label:"Identity & Tenant",tables:{
users:["id|uuid|PK","username|varchar|Unique","email|varchar|","status|varchar|"],
roles:["id|uuid|PK","role_code|varchar|Unique","display_name|varchar|"],
user_roles:["id|uuid|PK","user_id|uuid|FK → identity.users","role_id|uuid|FK → identity.roles"],
tenants:["id|uuid|PK","tenant_code|varchar|Unique","legal_name|varchar|"]}},
master:{label:"Master Data",tables:{
organizations:["id|uuid|PK","parent_organization_id|uuid|FK → master.organizations","name|varchar|","satusehat_org_id|varchar|"],
locations:["id|uuid|PK","organization_id|uuid|FK → master.organizations","location_code|varchar|","name|varchar|"],
practitioners:["id|uuid|PK","full_name|varchar|","ihs_practitioner_id|varchar|"],
practitioner_assignments:["id|uuid|PK","practitioner_id|uuid|FK → master.practitioners","organization_id|uuid|FK → master.organizations","unit_id|uuid|FK → master.organization_units"],
service_catalog:["id|uuid|PK","service_code|varchar|","service_name|varchar|","service_type|varchar|"],
beds:["id|uuid|PK","room_id|uuid|FK → master.rooms","location_id|uuid|FK → master.locations","bed_code|varchar|"]}},
terminology:{label:"Terminology",tables:{
code_systems:["id|uuid|PK","canonical_uri|varchar|Unique","version_label|varchar|"],
concepts:["id|uuid|PK","code_system_id|uuid|FK → terminology.code_systems","code|varchar|","display|varchar|"],
code_mappings:["id|uuid|PK","source_code|varchar|","target_code|varchar|","map_quality|varchar|"]}},
patient:{label:"Patient Registry",tables:{
patients:["id|uuid|PK","mrn|varchar|","full_name|varchar|","birth_date|date|","administrative_sex|varchar|"],
patient_identifiers:["id|uuid|PK","patient_id|uuid|FK → patient.patients","identifier_system|varchar|","identifier_value|varchar|"],
patient_contacts:["id|uuid|PK","patient_id|uuid|FK → patient.patients","contact_type|varchar|","contact_value|varchar|"]}},
scheduling:{label:"Scheduling & Queue",tables:{
appointments:["id|uuid|PK","patient_id|uuid|FK → patient.patients","slot_id|uuid|FK → scheduling.slots","start_at|timestamptz|"],
queue_tickets:["id|uuid|PK","patient_id|uuid|FK → patient.patients","appointment_id|uuid|FK → scheduling.appointments","service_date|date|"]}},
encounter:{label:"Encounter & Admission",tables:{
registrations:["id|uuid|PK","patient_id|uuid|FK → patient.patients","appointment_id|uuid|FK → scheduling.appointments","organization_id|uuid|FK → master.organizations"],
encounters:["id|uuid|PK","patient_id|uuid|FK → patient.patients","registration_id|uuid|FK → encounter.registrations","organization_id|uuid|FK → master.organizations","status|varchar|","start_at|timestamptz|"],
encounter_participants:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","practitioner_id|uuid|FK → master.practitioners","participant_role|varchar|"],
bed_assignments:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","bed_id|uuid|FK → master.beds","occupied_from|timestamptz|"]}},
consent:{label:"Consent & Disclosure",tables:{
consent_records:["id|uuid|PK","patient_id|uuid|FK → patient.patients","status|varchar|"],
consent_artifacts:["id|uuid|PK","consent_id|uuid|FK → consent.consent_records","storage_uri|text|","sha256|char(64)|"]}},
clinical:{label:"Clinical Documentation",tables:{
clinical_notes:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","author_practitioner_id|uuid|FK → master.practitioners","note_type|varchar|","signed_at|timestamptz|"],
diagnoses:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","patient_id|uuid|FK → patient.patients","diagnosis_code|varchar|"],
observations:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","patient_id|uuid|FK → patient.patients","code|varchar|","value_numeric|numeric|","unit_ucum|varchar|"],
procedures:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","procedure_code|varchar|","status|varchar|"],
care_plans:["id|uuid|PK","patient_id|uuid|FK → patient.patients","encounter_id|uuid|FK → encounter.encounters","status|varchar|"],
clinical_documents:["id|uuid|PK","patient_id|uuid|FK → patient.patients","encounter_id|uuid|FK → encounter.encounters","document_type|varchar|"]}},
orders:{label:"Order Management",tables:{
service_orders:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","patient_id|uuid|FK → patient.patients","requesting_practitioner_id|uuid|FK → master.practitioners","order_type|varchar|","status|varchar|"],
order_items:["id|uuid|PK","service_order_id|uuid|FK → orders.service_orders","service_id|uuid|FK → master.service_catalog","quantity|numeric|"]}},
laboratory:{label:"Laboratory LIS",tables:{
lab_orders:["id|uuid|PK","service_order_id|uuid|FK → orders.service_orders","accession_number|varchar|","status|varchar|"],
specimens:["id|uuid|PK","lab_order_id|uuid|FK → laboratory.lab_orders","barcode|varchar|","status|varchar|"],
lab_results:["id|uuid|PK","lab_order_id|uuid|FK → laboratory.lab_orders","specimen_id|uuid|FK → laboratory.specimens","result_value|numeric|","verified_at|timestamptz|"],
lab_reports:["id|uuid|PK","lab_order_id|uuid|FK → laboratory.lab_orders","report_number|varchar|","released_at|timestamptz|"]}},
radiology:{label:"Radiology RIS",tables:{
radiology_orders:["id|uuid|PK","service_order_id|uuid|FK → orders.service_orders","status|varchar|"],
imaging_studies:["id|uuid|PK","radiology_order_id|uuid|FK → radiology.radiology_orders","study_instance_uid|varchar|"],
radiology_reports:["id|uuid|PK","radiology_order_id|uuid|FK → radiology.radiology_orders","report_status|varchar|"]}},
pharmacy:{label:"Pharmacy",tables:{
medications:["id|uuid|PK","medication_code|varchar|","kfa_code|varchar|","generic_name|varchar|"],
prescriptions:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","patient_id|uuid|FK → patient.patients","prescriber_id|uuid|FK → master.practitioners","status|varchar|"],
prescription_items:["id|uuid|PK","prescription_id|uuid|FK → pharmacy.prescriptions","medication_id|uuid|FK → pharmacy.medications","dose_text|varchar|"],
dispenses:["id|uuid|PK","prescription_id|uuid|FK → pharmacy.prescriptions","status|varchar|","dispensed_at|timestamptz|"],
dispense_items:["id|uuid|PK","dispense_id|uuid|FK → pharmacy.dispenses","prescription_item_id|uuid|FK → pharmacy.prescription_items","stock_lot_id|uuid|FK → inventory.stock_lots"]}},
inventory:{label:"Inventory & Stock",tables:{
items:["id|uuid|PK","item_code|varchar|","item_name|varchar|","medication_id|uuid|FK → pharmacy.medications"],
stock_lots:["id|uuid|PK","item_id|uuid|FK → inventory.items","warehouse_id|uuid|FK → inventory.warehouses","lot_number|varchar|","expiry_date|date|"],
stock_movements:["id|uuid|PK","item_id|uuid|FK → inventory.items","lot_id|uuid|FK → inventory.stock_lots","quantity_delta|numeric|","movement_type|varchar|"]}},
nutrition:{label:"Nutrition & Kitchen",tables:{
nutrition_orders:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","patient_id|uuid|FK → patient.patients","diet_code|varchar|"],
meal_productions:["id|uuid|PK","production_date|date|","status|varchar|"]}},
operations:{label:"Hospital Operations",tables:{
surgery_cases:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","status|varchar|"],
cssd_batches:["id|uuid|PK","batch_code|varchar|","sterilization_status|varchar|"],
assets:["id|uuid|PK","asset_code|varchar|","location_id|uuid|FK → master.locations"]}},
procurement:{label:"Procurement",tables:{
purchase_orders:["id|uuid|PK","supplier_id|uuid|","po_number|varchar|","status|varchar|"],
purchase_order_items:["id|uuid|PK","purchase_order_id|uuid|FK → procurement.purchase_orders","item_id|uuid|FK → inventory.items"]}},
billing:{label:"Billing & Claims",tables:{
payers:["id|uuid|PK","payer_code|varchar|","payer_name|varchar|"],
coverages:["id|uuid|PK","patient_id|uuid|FK → patient.patients","payer_id|uuid|FK → billing.payers"],
charges:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","patient_id|uuid|FK → patient.patients","source_kind|varchar|","amount|numeric|"],
invoices:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","patient_id|uuid|FK → patient.patients","invoice_number|varchar|","status|varchar|"],
invoice_lines:["id|uuid|PK","invoice_id|uuid|FK → billing.invoices","charge_id|uuid|FK → billing.charges","total_amount|numeric|"],
payments:["id|uuid|PK","patient_id|uuid|FK → patient.patients","amount|numeric|"],
claims:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","coverage_id|uuid|FK → billing.coverages","claim_amount|numeric|"]}},
finance:{label:"Finance ERP",tables:{
journal_entries:["id|uuid|PK","journal_date|date|","status|varchar|"],
journal_lines:["id|uuid|PK","journal_entry_id|uuid|FK → finance.journal_entries","debit_amount|numeric|","credit_amount|numeric|"]}},
hr:{label:"Human Resources",tables:{
employees:["id|uuid|PK","employee_number|varchar|","organization_id|uuid|FK → master.organizations"],
payroll_runs:["id|uuid|PK","period_month|date|","status|varchar|"]}},
quality:{label:"Quality & Reporting",tables:{
incidents:["id|uuid|PK","encounter_id|uuid|FK → encounter.encounters","incident_type|varchar|","status|varchar|"],
quality_indicators:["id|uuid|PK","indicator_code|varchar|","numerator|numeric|","denominator|numeric|"]}},
integration:{label:"FHIR & External Integration",tables:{
external_systems:["id|uuid|PK","system_code|varchar|","system_type|varchar|"],
external_resource_links:["id|uuid|PK","external_system_id|uuid|FK → integration.external_systems","local_entity_type|varchar|","local_entity_id|uuid|","external_resource_type|varchar|"],
outbox_events:["id|uuid|PK","event_type|varchar|","aggregate_id|uuid|","payload|jsonb|","occurred_at|timestamptz|"],
integration_deliveries:["id|uuid|PK","outbox_event_id|uuid|FK → integration.outbox_events","external_system_id|uuid|FK → integration.external_systems","status|varchar|"]}},
audit:{label:"Audit & Compliance",tables:{
access_logs:["id|uuid|PK","user_id|uuid|FK → identity.users","action|varchar|","occurred_at|timestamptz|"],
data_change_logs:["id|uuid|PK","entity_type|varchar|","entity_id|uuid|","action|varchar|"]}},
analytics:{label:"Analytics & BI",tables:{
report_definitions:["id|uuid|PK","report_code|varchar|","query_config|jsonb|"],
daily_snapshots:["id|uuid|PK","snapshot_date|date|","metric_value|numeric|"]}}
};
const base={
patients:[
{id:"P-001",mrn:"RM-000421",name:"Nadia Putri (Demo)",birth:"1990-04-15",gender:"P",payer:"BPJS",phone:"0812••••1841"},
{id:"P-002",mrn:"RM-000422",name:"Bima Santoso (Demo)",birth:"1981-08-09",gender:"L",payer:"Umum",phone:"0812••••6635"},
{id:"P-003",mrn:"RM-000423",name:"Sari Wijaya (Demo)",birth:"1978-03-27",gender:"P",payer:"Asuransi",phone:"0811••••4723"},
{id:"P-004",mrn:"RM-000424",name:"Arga Mahendra (Demo)",birth:"2002-11-17",gender:"L",payer:"BPJS",phone:"0857••••1294"},
{id:"P-005",mrn:"RM-000425",name:"Dewi Larasati (Demo)",birth:"1966-06-02",gender:"P",payer:"BPJS",phone:"0813••••2150"},
{id:"P-006",mrn:"RM-000426",name:"Raka Prasetyo (Demo)",birth:"1995-12-25",gender:"L",payer:"Umum",phone:"0822••••8889"}],
practitioners:[{id:"PR-01",name:"dr. Alya S., Sp.PD"},{id:"PR-02",name:"dr. Farhan, Sp.A"},{id:"PR-03",name:"dr. Maya, Sp.Rad"}],
encounters:[
{id:"E-1001",patientId:"P-001",date:"2026-10-30",type:"Rawat Jalan",unit:"Poli Penyakit Dalam",doctor:"PR-01",status:"in-progress",payer:"BPJS"},
{id:"E-1002",patientId:"P-002",date:"2026-10-30",type:"IGD",unit:"Instalasi Gawat Darurat",doctor:"PR-01",status:"in-progress",payer:"Umum"},
{id:"E-1003",patientId:"P-003",date:"2026-10-30",type:"Rawat Inap",unit:"Ruang Melati",doctor:"PR-01",status:"in-progress",payer:"Asuransi"},
{id:"E-1004",patientId:"P-004",date:"2026-10-30",type:"Rawat Jalan",unit:"Poli Anak",doctor:"PR-02",status:"finished",payer:"BPJS"},
{id:"E-1005",patientId:"P-005",date:"2026-10-30",type:"Rawat Jalan",unit:"Poli Penyakit Dalam",doctor:"PR-01",status:"in-progress",payer:"BPJS"}],
observations:[
{id:"OBS-01",encounterId:"E-1001",code:"8480-6",name:"Tekanan darah sistolik",value:128,unit:"mm[Hg]",time:"08:42"},
{id:"OBS-02",encounterId:"E-1001",code:"8462-4",name:"Tekanan darah diastolik",value:82,unit:"mm[Hg]",time:"08:42"},
{id:"OBS-03",encounterId:"E-1002",code:"8867-4",name:"Denyut jantung",value:98,unit:"/min",time:"09:05"},
{id:"OBS-04",encounterId:"E-1003",code:"8310-5",name:"Suhu tubuh",value:37.2,unit:"Cel",time:"09:20"}],
diagnoses:[{id:"DX-01",encounterId:"E-1001",code:"I10",name:"Hipertensi esensial (primer)"},{id:"DX-02",encounterId:"E-1002",code:"R50.9",name:"Demam, tidak spesifik"},{id:"DX-03",encounterId:"E-1003",code:"E11.9",name:"Diabetes melitus tipe 2"}],
notes:[{id:"N-01",encounterId:"E-1001",author:"PR-01",summary:"Kontrol rutin hipertensi; evaluasi terapi dan pemeriksaan darah.",signed:true}],
orders:[{id:"SO-01",encounterId:"E-1001",type:"Laboratorium",service:"Darah Lengkap",priority:"routine",status:"completed"},{id:"SO-02",encounterId:"E-1002",type:"Laboratorium",service:"Darah Lengkap",priority:"urgent",status:"requested"},{id:"SO-03",encounterId:"E-1003",type:"Radiologi",service:"Foto Thorax",priority:"routine",status:"requested"}],
labs:[{id:"LAB-01",orderId:"SO-01",accession:"LIS-260001",status:"verified",specimen:"SP-01",value:"13.7",unit:"g/dL",test:"Hemoglobin"},{id:"LAB-02",orderId:"SO-02",accession:"LIS-260002",status:"pending",specimen:"SP-02",value:"",unit:"g/dL",test:"Hemoglobin"}],
prescriptions:[{id:"RX-01",encounterId:"E-1001",medication:"Amlodipine 5 mg",quantity:10,status:"waiting"},{id:"RX-02",encounterId:"E-1003",medication:"Metformin 500 mg",quantity:14,status:"dispensed"}],
stock:[{id:"ST-01",item:"Amlodipine 5 mg",lot:"AM-2609-A",expiry:"2027-11-30",qty:240},{id:"ST-02",item:"Metformin 500 mg",lot:"MT-2610-B",expiry:"2028-04-30",qty:118},{id:"ST-03",item:"Spuit 3 mL",lot:"SP-2610-C",expiry:"2028-07-30",qty:530}],
movements:[{id:"MV-01",stockId:"ST-02",delta:-14,ref:"RX-02",reason:"Dispensing"}],
charges:[{id:"CH-01",encounterId:"E-1001",source:"Pemeriksaan dokter",amount:150000},{id:"CH-02",encounterId:"E-1001",source:"LAB-01 · Darah Lengkap",amount:95000},{id:"CH-03",encounterId:"E-1002",source:"Pemeriksaan IGD",amount:220000},{id:"CH-04",encounterId:"E-1003",source:"Tindakan & akomodasi",amount:550000}],
invoices:[{id:"INV-01",encounterId:"E-1001",status:"open",number:"INV-2026-001"},{id:"INV-02",encounterId:"E-1002",status:"open",number:"INV-2026-002"},{id:"INV-03",encounterId:"E-1003",status:"open",number:"INV-2026-003"}],
outbox:[{id:"EVT-01",entity:"Encounter",ref:"E-1001",type:"encounter.updated",status:"queued"},{id:"EVT-02",entity:"Observation",ref:"OBS-01",type:"observation.created",status:"validated"},{id:"EVT-03",entity:"DiagnosticReport",ref:"LAB-01",type:"lab.verified",status:"queued"}],
activities:[{time:"10:45",title:"Hasil laboratorium diverifikasi",detail:"LAB-01 · E-1001"},{time:"10:28",title:"Resep diserahkan",detail:"RX-02 · E-1003"},{time:"09:55",title:"Order laboratorium dibuat",detail:"SO-02 · E-1002"},{time:"09:34",title:"Encounter dimulai",detail:"E-1005 · RM-000425"}]
};
window.SIMRS_CATALOG={moduleGroups:moduleGroups,db:db,base:base,version:"2026-10-30",blueprint:{modules:68,schemas:23,tables:271,columns:3395,relationships:762,indexes:1003,fhirMappings:77}};
})();