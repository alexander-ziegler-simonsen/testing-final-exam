
-- insert data _______________________



-- staff roles

insert into staff_role (name) values
('doctor'),
('nurse'),
('admin'),
('not-in-use');


-- buildings

insert into building (name, address) values
('main hospital', '123 health st'),
('specialist wing', '456 care ave');


-- floors

insert into floor (name, fk_building_id) values
('ground floor', 1), ('first floor', 1), ('second floor', 1),
('ground floor', 2), ('first floor', 2), ('second floor', 2),
('test-delete target', 1);


-- medication (26)

insert into medication (name,generic_name,brand,form,strength,category,description) values
('paracetamol','acetaminophen','panodil','tablet','500mg','pain relief','used to treat mild to moderate pain and fever.'),
('amoxicillin','amoxicillin','amoxil','capsule','250mg','antibiotic','used to treat bacterial infections.'),
('atorvastatin','atorvastatin','lipitor','tablet','20mg','cholesterol','lowers cholesterol and prevents heart disease.'),
('ibuprofen','ibuprofen','nurofen','tablet','400mg','pain relief','relieves pain, inflammation, and fever.'),
('omeprazole','omeprazole','losec','capsule','20mg','acid reducer','treats acid reflux and ulcers.'),
('ciprofloxacin','ciprofloxacin','cipro','tablet','500mg','antibiotic','treats bacterial infections.'),
('metformin','metformin','glucophage','tablet','500mg','diabetes','used for type 2 diabetes management.'),
('simvastatin','simvastatin','zocor','tablet','20mg','cholesterol','reduces cholesterol.'),
('lisinopril','lisinopril','zestril','tablet','10mg','blood pressure','treats high blood pressure.'),
('amlodipine','amlodipine','norvasc','tablet','5mg','blood pressure','treats high blood pressure.'),
('hydrocortisone','hydrocortisone','cortisol','cream','1%','steroid','reduces inflammation.'),
('prednisone','prednisone','deltasone','tablet','10mg','steroid','reduces inflammation and suppresses immune system.'),
('levothyroxine','levothyroxine','euthyrox','tablet','50mcg','hormone','treats hypothyroidism.'),
('albuterol','albuterol','ventolin','inhaler','100mcg','respiratory','treats asthma symptoms.'),
('furosemide','furosemide','lasix','tablet','40mg','diuretic','used to reduce fluid retention.'),
('warfarin','warfarin','coumadin','tablet','5mg','blood thinner','prevents blood clots.'),
('clopidogrel','clopidogrel','plavix','tablet','75mg','blood thinner','prevents stroke and heart attack.'),
('diazepam','diazepam','valium','tablet','5mg','anxiety','treats anxiety, muscle spasms, and seizures.'),
('lorazepam','lorazepam','ativan','tablet','2mg','anxiety','treats anxiety disorders.'),
('gabapentin','gabapentin','neurontin','capsule','300mg','neuropathy','used to treat nerve pain.'),
('citalopram','citalopram','celexa','tablet','20mg','depression','treats depression and anxiety.'),
('sertraline','sertraline','zoloft','tablet','50mg','depression','treats depression and anxiety.'),
('escitalopram','escitalopram','lexapro','tablet','10mg','depression','treats depression and anxiety.'),
('montelukast','montelukast','singulair','tablet','10mg','respiratory','treats asthma and allergies.'),
('ranitidine','ranitidine','zantac','tablet','150mg','acid reducer','reduces stomach acid.'),
('melatonin','melatonin','natrol','tablet','5mg','sleep aid','helps with sleep disorders.'),
('test-delete target', 'test', 'test', 'tablet', '0mg', 'test fixture', 'disposable row for delete testing, do not use for anything else.');


-- medication storage

insert into medication_storage (fk_medication_id, amount) values
(1,500),(2,400),(3,300),(4,250),(5,200),(6,180),(7,160),(8,150),(9,140),(10,130),
(11,120),(12,110),(13,100),(14,90),(15,80),(16,70),(17,60),(18,50),(19,40),(20,30),
(21,25),(22,20),(23,15),(24,10),(25,5),(26,30),
(1,1);


-- rooms

insert into room (name, fk_floor_id) values
('room a101',1),('room a102',1),('room a103',1),('room a104',1),('room a105',1),
('room a201',2),('room a202',2),('room a203',2),('room a204',2),('room a205',2),
('room a301',3),('room a302',3),('room a303',3),('room a304',3),('room a305',3),
('room b101',4),('room b102',4),('room b103',4),('room b104',4),('room b105',4),
('room b201',5),('room b202',5),('room b203',5),('room b204',5),('room b205',5),
('room b301',6),('room b302',6),('room b303',6),('room b304',6),('room b305',6);


-- patients (25)
-- from https://www.fakenamegenerator.com/advanced.php?t=country&n%5b%5d=us&c%5b%5d=dk&gen=50&age-min=19&age-max=85

-- date_of_birth is decoded from each cpr_number (ddmmyy + century digit), so it stays
-- consistent with what CprService would derive from the same cpr; weight_kg/height_cm
-- are made-up but plausible values spread across the bmi categories for test coverage.
insert into patient (firstname, lastname, gender, cpr_number, date_of_birth, weight_kg, height_cm) values
('michael','conklin','male','1505534561','1953-05-15',82,178),
('darlene','kelly','female','1202543800','1954-02-12',65,162),
('edward','reep','male','2106961193','1996-06-21',90,180),
('jennifer','love','female','1107512280','1951-07-11',58,160),
('eloise','lininger','female','0702712408','1971-02-07',70,168),
('sharon','miller','female','1308741016','1974-08-13',95,165),
('phillip','rape','male','0412453581','1945-12-04',75,175),
('frances','johnson','female','0112543430','1954-12-01',50,158),
('rickey','martin','male','3004813285','1981-04-30',100,182),
('mayra','james','female','2001056762','2005-01-20',55,165),
('kathleen','russell','female','0810029986','2002-10-08',48,170),
('william','andrews','female','1111584571','1958-11-11',68,160),
('fernando','acosta','male','2908904365','1990-08-29',85,176),
('oliva','rogers','female','2011951166','1995-11-20',60,167),
('joselyn','hudnall','female','1210810974','1981-10-12',72,163),
('shirley','walker','female','1001593664','1959-01-10',78,155),
('garrett','taylor','male','1503019147','2001-03-15',68,179),
('carl','ellis','male','1110624731','1962-10-11',95,174),
('patti','jones','female','0911751364','1975-11-09',62,164),
('derrick','williams','male','1006912679','1991-06-10',79,183),
('joyce','toles','female','0608842934','1984-08-06',54,172),
('stephanie','knox','female','2211600554','1960-11-22',88,160),
('michael','gonzalez','male','1411973723','1997-11-14',72,177),
('charles','eusebio','male','1111563477','1956-11-11',80,170),
('bobby','selzer','male','0603026535','2002-03-06',66,175),
('test', 'deletetarget', 'other', 'ZZTEST-PATIENT-0001', '1990-01-01', 70, 170);

-- staff (doctors first, then nurses, then admin) - role_id: 1 = doctor, 2 = nurse, 3 = admin

insert into staff (firstname, lastname, fk_role_id) values
('lars','christensen',1),('eva','møller',1),('thomas','pedersen',1),
('maria','jensen',1),('peter','poulsen',1),('anna','nielsen',1),
('mikkel','hansen',1),('laura','larsen',1),('frederik','olsen',1),
('clara','andersen',1),('simon','christensen',1),('sofie','møller',1),
('anders','pedersen',1),('ida','jensen',1),('rasmus','poulsen',1),
('mia','nielsen',1),('christian','hansen',1),('lise','larsen',1),
('jacob','olsen',1),('julie','andersen',1),('martin','christensen',1),
('line','møller',1),('henrik','pedersen',1),('emma','jensen',1),
('nikolaj','poulsen',1),
('anna','jensen',2),('mette','knudsen',2),('jonas','poulsen',2),
('sofie','andersen',2),('frederik','larsen',2),('clara','olsen',2),
('simon','nielsen',2),('ida','hansen',2),('rasmus','christensen',2),
('emma','møller',2),('christian','pedersen',2),('laura','jensen',2),
('jacob','poulsen',2),('mia','nielsen',2),('anders','hansen',2),
('julie','larsen',2),('martin','olsen',2),('lise','andersen',2),
('peter','christensen',2),('nikolaj','møller',2),('thomas','pedersen',2),
('maria','jensen',2),('john','poulsen',2),('sara','nielsen',2),
('henrik','hansen',2),
('kirsten','holm',3),
('test', 'delete target', 3);

-- users (linked to staff, for login)
-- passwords: doctors use 'Doctor1234!', nurses use 'Nurse1234!', admin uses 'Admin1234!'

insert into "user" (username, password_hash, salt, fk_staff_id) values
('larsc',  '$2b$11$nlclhzrwTwvhpiFLLyB32./O5E.NSqH9Z6YyHVHLInzuvic3W0daK', '$2b$11$nlclhzrwTwvhpiFLLyB32.', 1),
('doctor',   '$2b$11$v49fsgGrRe4izN65HiA.X.R9nnF7pfoOLf/s7QRiDsLFaTE4MNtLe', '$2b$11$v49fsgGrRe4izN65HiA.X.', 2),
('annaj',  '$2b$11$F/xqtdVrZjJUb6hfXptkAuse9F7s3DbH33SigLynX9D0YxMMqZI0O', '$2b$11$F/xqtdVrZjJUb6hfXptkAu', 26),
('nurse', '$2b$11$zFxZ4mU9GQZBiLkrz9fCRuGeMLXwumuCHWBCr7by6mccjlzMnT65m', '$2b$11$zFxZ4mU9GQZBiLkrz9fCRu', 27),
('admin', '$2b$11$AO5m33t61b01mMygc4uxqelHjDV/qAce9gGg8jX8lKGoI6GddnBlK', '$2b$11$AO5m33t61b01mMygc4uxqe', 51);
-- patient users (linked to patient via user_patient, for login - not staff)
-- password: 'Patient1234!'
insert into "user" (username, password_hash, salt, fk_staff_id) values
('patient', '$2b$11$ksR/CXHW8KK5iufZueYHiO1sHNYatmwbDKhvfkhXM0I/FpF554ADS', '$2b$11$ksR/CXHW8KK5iufZueYHiO', null);

insert into user_patient (fk_user_id, fk_patient_id) values
((select id from "user" where username = 'patient'), 1);


-- departments

insert into department (name, type) values
('emergency','critical care'),
('surgery','operation'),
('cardiology','specialist'),
('pediatrics','child care'),
('radiology','diagnostics'),
('test-delete target', 'test fixture');

-- department staff - doctors: 1–25, nurses: 26–50
insert into department_staff (fk_staff_id, fk_department_id) values
(1,1),(2,1),(3,2),(4,2),(5,3),(6,3),(7,4),(8,4),(9,5),(10,5),(11,1),
(12,2),(13,3),(14,4),(15,5),(16,1),(17,2),(18,3),(19,4),(20,5),(21,1),
(22,2),(23,3),(24,4),(25,5),
(26,1),(27,1),(28,2),(29,2),(30,3),(31,3),(32,4),(33,4),(34,5),(35,5),
(36,1),(37,2),(38,3),(39,4),(40,5),(41,1),(42,2),(43,3),(44,4),(45,5),
(46,1),(47,2),(48,3),(49,4),(50,5),(50,4);

-- treatments

insert into treatment (fk_patient_id,description,time) values
(1,'fever and headache',current_timestamp),
(2,'bacterial infection',current_timestamp),
(3,'cholesterol check',current_timestamp),
(4,'asthma management',current_timestamp),
(5,'diabetes control',current_timestamp),
(6,'blood pressure monitoring',current_timestamp),
(7,'anxiety treatment',current_timestamp),
(8,'acid reflux treatment',current_timestamp),
(9,'pain relief',current_timestamp),
(10,'steroid therapy',current_timestamp),
(11,'asthma inhaler training',current_timestamp),
(12,'sleep disorder assessment',current_timestamp),
(13,'blood thinner monitoring',current_timestamp),
(14,'neuropathy pain management',current_timestamp),
(15,'depression treatment',current_timestamp),
(16,'heart disease check',current_timestamp),
(17,'pediatric care',current_timestamp),
(18,'radiology imaging',current_timestamp),
(19,'surgery post-op care',current_timestamp),
(20,'emergency care',current_timestamp),
(21,'physical therapy',current_timestamp),
(22,'vaccination',current_timestamp),
(23,'routine checkup',current_timestamp),
(24,'lab test follow-up',current_timestamp),
(25,'chronic illness monitoring',current_timestamp),
(26, 'disposable treatment, reserved for delete fixtures', current_timestamp);

-- treatment staff - (doctor + nurse per treatment)
insert into treatment_staff (fk_treatment_id, fk_staff_id) values
(1,1),(1,26),(2,2),(2,27),(3,3),(3,28),(4,4),(4,29),(5,5),(5,30),
(6,6),(6,31),(7,7),(7,32),(8,8),(8,33),(9,9),(9,34),(10,10),(10,35),
(11,11),(11,36),(12,12),(12,37),(13,13),(13,38),(14,14),(14,39),
(15,15),(15,40),(16,16),(16,41),(17,17),(17,42),(18,18),(18,43),
(19,19),(19,44),(20,20),(20,45),(21,21),(21,46),(22,22),(22,47),
(23,23),(23,48),(24,24),(24,49),(25,25),(25,50),
(26, 1);

-- prescriptions - (doctors only)
insert into prescription (fk_medication_id, fk_treatment_id, fk_prescribed_by_staff_id, doses) values
(1,1,1,2),(2,2,2,3),(3,3,3,1),(4,4,4,2),(5,5,5,1),
(6,6,6,3),(7,7,7,2),(8,8,8,1),(9,9,9,2),(10,10,10,1),
(11,11,11,2),(12,12,12,1),(13,13,13,2),(14,14,14,3),(15,15,15,1),
(16,16,16,2),(17,17,17,1),(18,18,18,2),(19,19,19,3),(20,20,20,1),
(21,21,21,2),(22,22,22,1),(23,23,23,2),(24,24,24,1),(25,25,25,3),
(1, 26, 1, 1);


-- room bookings

insert into room_booking (fk_room_id,start_time,end_time,fk_patient_id) values
(1,'2025-10-07 08:00:00','2025-10-07 12:00:00',1),
(2,'2025-10-07 09:00:00','2025-10-07 13:00:00',2),
(3,'2025-10-07 10:00:00','2025-10-07 14:00:00',3),
(4,'2025-10-07 11:00:00','2025-10-07 15:00:00',4),
(5,'2025-10-07 12:00:00','2025-10-07 16:00:00',5),
(6,'2025-10-07 13:00:00','2025-10-07 17:00:00',6),
(7,'2025-10-07 14:00:00','2025-10-07 18:00:00',7),
(8,'2025-10-07 15:00:00','2025-10-07 19:00:00',8),
(9,'2025-10-07 16:00:00','2025-10-07 20:00:00',9),
(10,'2025-10-07 17:00:00','2025-10-07 21:00:00',10),
(1, '2099-01-01 08:00:00', '2099-01-01 09:00:00', 1);

-- medication storage missing
insert into medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) values
(1, 10, '2025-10-07 12:00:00'),
(2, 5, '2025-10-07 15:30:00'),
(27, 1, '2099-01-01 08:00:00');