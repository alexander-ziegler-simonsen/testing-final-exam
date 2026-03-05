-- ===========================================
-- Create Database
-- ===========================================
USE HospitalDB;


-- ----- enums -----
CREATE TABLE StaffRole (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE
);


-- LOCATION STRUCTURE
CREATE TABLE Building (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    address NVARCHAR(255)
);

CREATE TABLE Floor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    fkBuildingId INT NOT NULL,
    CONSTRAINT FK_Floor_Building FOREIGN KEY (fkBuildingId) REFERENCES Building(id)
);

-- PATIENTS & ROOMS
CREATE TABLE Room (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    fkFloorId INT NOT NULL,
    CONSTRAINT FK_Room_Floor FOREIGN KEY (fkFloorId) REFERENCES Floor(id)
);

CREATE TABLE Patient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname NVARCHAR(100),
    lastname NVARCHAR(100),
    gender NVARCHAR(50),
    cprNumber NVARCHAR(50) UNIQUE
);

CREATE TABLE RoomBooking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fkRoomId INT NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    fkPatientId INT NOT NULL,
    CONSTRAINT FK_RoomBooking_Room FOREIGN KEY (fkRoomId) REFERENCES Room(id),
    CONSTRAINT FK_RoomBooking_Patient FOREIGN KEY (fkPatientId) REFERENCES Patient(id)
);

-- STAFF 
CREATE TABLE Staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname NVARCHAR(100),
    lastname NVARCHAR(100),
    fkRoleId INT NOT NULL,
    CONSTRAINT FK_Staff_Role FOREIGN KEY (fkRoleId) REFERENCES StaffRole(id)
);


-- DEPARTMENTS & STAFF ASSIGNMENTS
CREATE TABLE Department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(100),
    type NVARCHAR(100)
);

CREATE TABLE DepartmentStaff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fkStaffId INT NOT NULL,
    fkDepartmentId INT NOT NULL,
    CONSTRAINT FK_DepartmentStaff_Staff FOREIGN KEY (fkStaffId) REFERENCES Staff(id),
    CONSTRAINT FK_DepartmentStaff_Department FOREIGN KEY (fkDepartmentId) REFERENCES Department(id)
);

-- MEDICATION STORAGE
CREATE TABLE Medication (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(100),
    genericName NVARCHAR(100),
    brand NVARCHAR(100),
    form NVARCHAR(100),
    strength NVARCHAR(100),
    category NVARCHAR(100),
    description TEXT
);

CREATE TABLE MedicationStorage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fkMedicationId INT NOT NULL,
    amount FLOAT NOT NULL,
    CONSTRAINT FK_MedicationStorage_Medication FOREIGN KEY (fkMedicationId) REFERENCES Medication(id)
);

CREATE TABLE MedicationStorageMissing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fkMedicationStorageId INT NOT NULL,
    amountMissing FLOAT NOT NULL,
    wentMissingAt DATETIME NOT NULL,
    CONSTRAINT FK_MedicationStorageMissing_Storage FOREIGN KEY (fkMedicationStorageId) REFERENCES MedicationStorage(id)
);

-- SHIFTS
CREATE TABLE Shift (
    id INT AUTO_INCREMENT PRIMARY KEY,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL
);

CREATE TABLE ShiftStaff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fkShiftId INT NOT NULL,
    fkStaffId INT NOT NULL,
    CONSTRAINT FK_ShiftStaff_Shift FOREIGN KEY (fkShiftId) REFERENCES Shift(id),
    CONSTRAINT FK_ShiftStaff_Staff FOREIGN KEY (fkStaffId) REFERENCES Staff(id)
);

-- TREATMENTS 
CREATE TABLE Treatment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fkPatientId INT NOT NULL,
    description NVARCHAR(500),
    time DATETIME NOT NULL,
    CONSTRAINT FK_Treatment_Patient FOREIGN KEY (fkPatientId) REFERENCES Patient(id)
);

CREATE TABLE Prescription (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fkMedicationId INT NOT NULL,
    fkTreatmentId INT NOT NULL,
    fkPrescribedByStaffId INT NOT NULL,
    doses FLOAT NOT NULL,

    CONSTRAINT FK_Prescription_Medication FOREIGN KEY (fkMedicationId) REFERENCES Medication(id),
    CONSTRAINT FK_Prescription_Treatment FOREIGN KEY (fkTreatmentId) REFERENCES Treatment(id),
    CONSTRAINT FK_Prescription_Staff FOREIGN KEY (fkPrescribedByStaffId) REFERENCES Staff(id)
);


CREATE TABLE TreatmentStaff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fkTreatmentId INT NOT NULL,
    fkStaffId INT NOT NULL,
    CONSTRAINT FK_TreatmentStaff_Treatment FOREIGN KEY (fkTreatmentId) REFERENCES Treatment(id),
    CONSTRAINT FK_TreatmentStaff_Staff FOREIGN KEY (fkStaffId) REFERENCES Staff(id)
);


-- ===========================================
-- part 2 - add data
-- ===========================================

USE HospitalDB;

-- STAFF ROLES
INSERT INTO StaffRole (name) VALUES
('Doctor'),
('Nurse');


-- BUILDINGS
INSERT INTO Building (name, address) VALUES
('Main Hospital', '123 Health St'),
('Specialist Wing', '456 Care Ave');

-- FLOORS
INSERT INTO Floor (name, fkBuildingId) VALUES
('Ground Floor', 1), ('First Floor', 1), ('Second Floor', 1),
('Ground Floor', 2), ('First Floor', 2), ('Second Floor', 2);

-- MEDICATION (25) 
INSERT INTO Medication (name,genericName,brand,form,strength,category,description) VALUES
('Paracetamol','Acetaminophen','Panodil','Tablet','500mg','Pain relief','Used to treat mild to moderate pain and fever.'),
('Amoxicillin','Amoxicillin','Amoxil','Capsule','250mg','Antibiotic','Used to treat bacterial infections.'),
('Atorvastatin','Atorvastatin','Lipitor','Tablet','20mg','Cholesterol','Lowers cholesterol and prevents heart disease.'),
('Ibuprofen','Ibuprofen','Nurofen','Tablet','400mg','Pain relief','Relieves pain, inflammation, and fever.'),
('Omeprazole','Omeprazole','Losec','Capsule','20mg','Acid reducer','Treats acid reflux and ulcers.'),
('Ciprofloxacin','Ciprofloxacin','Cipro','Tablet','500mg','Antibiotic','Treats bacterial infections.'),
('Metformin','Metformin','Glucophage','Tablet','500mg','Diabetes','Used for type 2 diabetes management.'),
('Simvastatin','Simvastatin','Zocor','Tablet','20mg','Cholesterol','Reduces cholesterol.'),
('Lisinopril','Lisinopril','Zestril','Tablet','10mg','Blood Pressure','Treats high blood pressure.'),
('Amlodipine','Amlodipine','Norvasc','Tablet','5mg','Blood Pressure','Treats high blood pressure.'),
('Hydrocortisone','Hydrocortisone','Cortisol','Cream','1%','Steroid','Reduces inflammation.'),
('Prednisone','Prednisone','Deltasone','Tablet','10mg','Steroid','Reduces inflammation and suppresses immune system.'),
('Levothyroxine','Levothyroxine','Euthyrox','Tablet','50mcg','Hormone','Treats hypothyroidism.'),
('Albuterol','Albuterol','Ventolin','Inhaler','100mcg','Respiratory','Treats asthma symptoms.'),
('Furosemide','Furosemide','Lasix','Tablet','40mg','Diuretic','Used to reduce fluid retention.'),
('Warfarin','Warfarin','Coumadin','Tablet','5mg','Blood thinner','Prevents blood clots.'),
('Clopidogrel','Clopidogrel','Plavix','Tablet','75mg','Blood thinner','Prevents stroke and heart attack.'),
('Diazepam','Diazepam','Valium','Tablet','5mg','Anxiety','Treats anxiety, muscle spasms, and seizures.'),
('Lorazepam','Lorazepam','Ativan','Tablet','2mg','Anxiety','Treats anxiety disorders.'),
('Gabapentin','Gabapentin','Neurontin','Capsule','300mg','Neuropathy','Used to treat nerve pain.'),
('Citalopram','Citalopram','Celexa','Tablet','20mg','Depression','Treats depression and anxiety.'),
('Sertraline','Sertraline','Zoloft','Tablet','50mg','Depression','Treats depression and anxiety.'),
('Escitalopram','Escitalopram','Lexapro','Tablet','10mg','Depression','Treats depression and anxiety.'),
('Montelukast','Montelukast','Singulair','Tablet','10mg','Respiratory','Treats asthma and allergies.'),
('Ranitidine','Ranitidine','Zantac','Tablet','150mg','Acid reducer','Reduces stomach acid.'),
('Melatonin','Melatonin','Natrol','Tablet','5mg','Sleep aid','Helps with sleep disorders.');

-- MEDICATION STORAGE (25)
INSERT INTO MedicationStorage (fkMedicationId, amount) VALUES
(1,500),(2,400),(3,300),(4,250),(5,200),(6,180),(7,160),(8,150),(9,140),(10,130),
(11,120),(12,110),(13,100),(14,90),(15,80),(16,70),(17,60),(18,50),(19,40),(20,30),
(21,25),(22,20),(23,15),(24,10),(25,5);


-- ROOMS 
INSERT INTO Room (name, fkFloorId) VALUES
-- Building 1, Ground Floor (floor id = 1)
('Room A101',1),('Room A102',1),('Room A103',1),('Room A104',1),('Room A105',1),
-- Building 1, First Floor (floor id = 2)
('Room A201',2),('Room A202',2),('Room A203',2),('Room A204',2),('Room A205',2),
-- Building 1, Second Floor (floor id = 3)
('Room A301',3),('Room A302',3),('Room A303',3),('Room A304',3),('Room A305',3),
-- Building 2, Ground Floor (floor id = 4)
('Room B101',4),('Room B102',4),('Room B103',4),('Room B104',4),('Room B105',4),
-- Building 2, First Floor (floor id = 5)
('Room B201',5),('Room B202',5),('Room B203',5),('Room B204',5),('Room B205',5),
-- Building 2, Second Floor (floor id = 6)
('Room B301',6),('Room B302',6),('Room B303',6),('Room B304',6),('Room B305',6);

-- ===========================================
-- PATIENTS (25) - fake person data - - works
-- from https://www.fakenamegenerator.com/advanced.php?t=country&n%5B%5D=us&c%5B%5D=dk&gen=50&age-min=19&age-max=85
-- ===========================================
INSERT INTO Patient (firstname, lastname, gender, cprNumber) VALUES
('Michael','Conklin','male','150553-4561'),
('Darlene','Kelly','female','120254-3800'),
('Edward','Reep','male','210696-1193'),
('Jennifer','Love','female','110751-2280'),
('Eloise','Lininger','female','070271-2408'),
('Sharon','Miller','female','130874-1016'),
('Phillip','Rape','male','041245-3581'),
('Frances','Johnson','female','011254-3430'),
('Rickey','Martin','male','300481-3285'),
('Mayra','James','female','200105-6762'),
('Kathleen','Russell','female','081002-9986'),
('William','Andrews','female','111158-4571'),
('Fernando','Acosta','male','290890-4365'),
('Oliva','Rogers','female','201195-1166'),
('Joselyn','Hudnall','female','121081-0974'),
('Shirley','Walker','female','100159-3664'),
('Garrett','Taylor','male','150301-9147'),
('Carl','Ellis','male','111062-4731'),
('Patti','Jones','female','091175-1364'),
('Derrick','Williams','male','100691-2679'),
('Joyce','Toles','female','060884-2934'),
('Stephanie','Knox','female','221160-0554'),
('Michael','Gonzalez','male','141197-3723'),
('Charles','Eusebio','male','111156-3477'),
('Bobby','Selzer','male','060302-6535');


-- STAFF (Doctors first, then Nurses) - roleId: 1 = Doctor, 2 = Nurse
INSERT INTO Staff (firstname, lastname, fkRoleId) VALUES
('Lars','Christensen',1),('Eva','Møller',1),('Thomas','Pedersen',1),  -- Doctors (1–25)
('Maria','Jensen',1),('Peter','Poulsen',1),('Anna','Nielsen',1),
('Mikkel','Hansen',1),('Laura','Larsen',1),('Frederik','Olsen',1),
('Clara','Andersen',1),('Simon','Christensen',1),('Sofie','Møller',1),
('Anders','Pedersen',1),('Ida','Jensen',1),('Rasmus','Poulsen',1),
('Mia','Nielsen',1),('Christian','Hansen',1),('Lise','Larsen',1),
('Jacob','Olsen',1),('Julie','Andersen',1),('Martin','Christensen',1),
('Line','Møller',1),('Henrik','Pedersen',1),('Emma','Jensen',1),
('Nikolaj','Poulsen',1),
('Anna','Jensen',2),('Mette','Knudsen',2),('Jonas','Poulsen',2),  -- Nurses (26–50)
('Sofie','Andersen',2),('Frederik','Larsen',2),('Clara','Olsen',2),
('Simon','Nielsen',2),('Ida','Hansen',2),('Rasmus','Christensen',2),
('Emma','Møller',2),('Christian','Pedersen',2),('Laura','Jensen',2),
('Jacob','Poulsen',2),('Mia','Nielsen',2),('Anders','Hansen',2),
('Julie','Larsen',2),('Martin','Olsen',2),('Lise','Andersen',2),
('Peter','Christensen',2),('Nikolaj','Møller',2),('Thomas','Pedersen',2),
('Maria','Jensen',2),('John','Poulsen',2),('Sara','Nielsen',2),
('Henrik','Hansen',2);

-- DEPARTMENTS (5) 
INSERT INTO Department (name, type) VALUES
('Emergency','Critical Care'),
('Surgery','Operation'),
('Cardiology','Specialist'),
('Pediatrics','Child Care'),
('Radiology','Diagnostics');

-- DEPARTMENT STAFF - Doctors: 1–25, Nurses: 26–50
INSERT INTO DepartmentStaff (fkStaffId,fkDepartmentId) VALUES
(1,1),(2,1),(3,2),(4,2),(5,3),(6,3),(7,4),(8,4),(9,5),(10,5),
(11,1),(12,2),(13,3),(14,4),(15,5),(16,1),(17,2),(18,3),(19,4),(20,5),
(21,1),(22,2),(23,3),(24,4),(25,5),
(26,1),(27,1),(28,2),(29,2),(30,3),(31,3),(32,4),(33,4),(34,5),(35,5),
(36,1),(37,2),(38,3),(39,4),(40,5),(41,1),(42,2),(43,3),(44,4),(45,5),
(46,1),(47,2),(48,3),(49,4),(50,5);

-- SHIFTS
INSERT INTO Shift (startTime,endTime) VALUES
('2025-10-07 08:00:00','2025-10-07 16:00:00'),
('2025-10-07 16:00:00','2025-10-07 23:59:00'),
('2025-10-08 00:00:00','2025-10-08 08:00:00');

-- SHIFT STAFF
INSERT INTO ShiftStaff (fkShiftId,fkStaffId) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),
(2,11),(2,12),(2,13),(2,14),(2,15),(2,16),(2,17),(2,18),(2,19),(2,20),
(3,21),(3,22),(3,23),(3,24),(3,25),  -- Doctors
(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),
(2,36),(2,37),(2,38),(2,39),(2,40),(2,41),(2,42),(2,43),(2,44),(2,45),
(3,46),(3,47),(3,48),(3,49),(3,50); -- Nurses

-- TREATMENTS
INSERT INTO Treatment (fkPatientId,description,time) VALUES
(1,'Fever and headache',NOW()),
(2,'Bacterial infection',NOW()),
(3,'Cholesterol check',NOW()),
(4,'Asthma management',NOW()),
(5,'Diabetes control',NOW()),
(6,'Blood pressure monitoring',NOW()),
(7,'Anxiety treatment',NOW()),
(8,'Acid reflux treatment',NOW()),
(9,'Pain relief',NOW()),
(10,'Steroid therapy',NOW()),
(11,'Asthma inhaler training',NOW()),
(12,'Sleep disorder assessment',NOW()),
(13,'Blood thinner monitoring',NOW()),
(14,'Neuropathy pain management',NOW()),
(15,'Depression treatment',NOW()),
(16,'Heart disease check',NOW()),
(17,'Pediatric care',NOW()),
(18,'Radiology imaging',NOW()),
(19,'Surgery post-op care',NOW()),
(20,'Emergency care',NOW()),
(21,'Physical therapy',NOW()),
(22,'Vaccination',NOW()),
(23,'Routine checkup',NOW()),
(24,'Lab test follow-up',NOW()),
(25,'Chronic illness monitoring',NOW());

-- TREATMENT STAFF - (Doctor + Nurse per treatment)
INSERT INTO TreatmentStaff (fkTreatmentId,fkStaffId) VALUES
(1,1),(1,26),(2,2),(2,27),(3,3),(3,28),(4,4),(4,29),(5,5),(5,30),
(6,6),(6,31),(7,7),(7,32),(8,8),(8,33),(9,9),(9,34),(10,10),(10,35),
(11,11),(11,36),(12,12),(12,37),(13,13),(13,38),(14,14),(14,39),
(15,15),(15,40),(16,16),(16,41),(17,17),(17,42),(18,18),(18,43),
(19,19),(19,44),(20,20),(20,45),(21,21),(21,46),(22,22),(22,47),
(23,23),(23,48),(24,24),(24,49),(25,25),(25,50);

-- PRESCRIPTIONS - (Doctors only)
INSERT INTO Prescription (fkMedicationId,fkTreatmentId,fkPrescribedByStaffId,doses) VALUES
(1,1,1,2),(2,2,2,3),(3,3,3,1),(4,4,4,2),(5,5,5,1),
(6,6,6,3),(7,7,7,2),(8,8,8,1),(9,9,9,2),(10,10,10,1),
(11,11,11,2),(12,12,12,1),(13,13,13,2),(14,14,14,3),(15,15,15,1),
(16,16,16,2),(17,17,17,1),(18,18,18,2),(19,19,19,3),(20,20,20,1),
(21,21,21,2),(22,22,22,1),(23,23,23,2),(24,24,24,1),(25,25,25,3);

-- ROOM BOOKINGS (25 bookings) 
INSERT INTO RoomBooking (fkRoomId,startTime,endTime,fkPatientId) VALUES
(1,'2025-10-07T08:00:00','2025-10-07T12:00:00',1),
(2,'2025-10-07T09:00:00','2025-10-07T13:00:00',2),
(3,'2025-10-07T10:00:00','2025-10-07T14:00:00',3),
(4,'2025-10-07T11:00:00','2025-10-07T15:00:00',4),
(5,'2025-10-07T12:00:00','2025-10-07T16:00:00',5),
(6,'2025-10-07T13:00:00','2025-10-07T17:00:00',6),
(7,'2025-10-07T14:00:00','2025-10-07T18:00:00',7),
(8,'2025-10-07T15:00:00','2025-10-07T19:00:00',8),
(9,'2025-10-07T16:00:00','2025-10-07T20:00:00',9),
(10,'2025-10-07T17:00:00','2025-10-07T21:00:00',10),
(11,'2025-10-07T08:30:00','2025-10-07T12:30:00',11),
(12,'2025-10-07T09:30:00','2025-10-07T13:30:00',12),
(13,'2025-10-07T10:30:00','2025-10-07T14:30:00',13),
(14,'2025-10-07T11:30:00','2025-10-07T15:30:00',14),
(15,'2025-10-07T12:30:00','2025-10-07T16:30:00',15),
(16,'2025-10-07T13:30:00','2025-10-07T17:30:00',16),
(17,'2025-10-07T14:30:00','2025-10-07T18:30:00',17),
(18,'2025-10-07T15:30:00','2025-10-07T19:30:00',18),
(19,'2025-10-07T16:30:00','2025-10-07T20:30:00',19),
(20,'2025-10-07T17:30:00','2025-10-07T21:30:00',20),
(21,'2025-10-07T08:15:00','2025-10-07T12:15:00',21),
(22,'2025-10-07T09:15:00','2025-10-07T13:15:00',22),
(23,'2025-10-07T10:15:00','2025-10-07T14:15:00',23),
(24,'2025-10-07T11:15:00','2025-10-07T15:15:00',24),
(25,'2025-10-07T12:15:00','2025-10-07T16:15:00',25);

-- MEDICATION STORAGE missing  
INSERT INTO MedicationStorageMissing (fkMedicationStorageId, amountMissing, wentMissingAt) VALUES
(1, 10, '2025-10-07T12:00:00'),
(2, 5, '2025-10-07T15:30:00');


-- views 


CREATE OR REPLACE VIEW vw_Nurses AS
SELECT
    s.id AS nurse_id,
    s.firstname,
    s.lastname,
    d.id AS department_id,
    d.name AS department_name,
    sh.id AS shift_id,
    sh.startTime AS shift_start,
    sh.endTime AS shift_end
FROM Staff s
JOIN StaffRole sr ON sr.id = s.fkRoleId
LEFT JOIN DepartmentStaff ds ON ds.fkStaffId = s.id
LEFT JOIN Department d ON d.id = ds.fkDepartmentId
LEFT JOIN ShiftStaff ss ON ss.fkStaffId = s.id
LEFT JOIN `Shift` sh ON sh.id = ss.fkShiftId
WHERE sr.name = 'Nurse';


CREATE OR REPLACE VIEW vw_Floors AS
SELECT 
    f.id AS floor_id,
    f.name AS floor_name,
    b.id AS building_id,
    b.name AS building_name,
    b.address AS building_address,
    r.id AS room_id,
    r.name AS room_name
FROM Floor f
JOIN Building b ON b.id = f.fkBuildingId
LEFT JOIN Room r ON r.fkFloorId = f.id;


CREATE OR REPLACE VIEW vw_Buildings AS
SELECT 
    b.id AS building_id,
    b.name AS building_name,
    b.address,
    f.id AS floor_id,
    f.name AS floor_name,
    r.id AS room_id,
    r.name AS room_name
FROM Building b
LEFT JOIN Floor f ON f.fkBuildingId = b.id
LEFT JOIN Room r ON r.fkFloorId = f.id;


CREATE OR REPLACE VIEW vw_Doctors AS
SELECT
    s.id AS doctor_id,
    s.firstname,
    s.lastname,
    d.id AS department_id,
    d.name AS department_name
FROM Staff s
JOIN StaffRole sr ON sr.id = s.fkRoleId AND sr.name = 'Doctor'
LEFT JOIN DepartmentStaff ds ON ds.fkStaffId = s.id
LEFT JOIN Department d ON d.id = ds.fkDepartmentId;

CREATE OR REPLACE VIEW vw_Patients AS
SELECT
    p.id AS patient_id,
    p.firstname,
    p.lastname,
    p.gender,
    p.cprNumber,
    rb.id AS roombooking_id,
    r.name AS room_name,
    f.name AS floor_name,
    b.name AS building_name

FROM Patient p
LEFT JOIN RoomBooking rb ON rb.fkPatientId = p.id
LEFT JOIN Room r ON r.id = rb.fkRoomId
LEFT JOIN Floor f ON f.id = r.fkFloorId
LEFT JOIN Building b ON b.id = f.fkBuildingId;

CREATE OR REPLACE VIEW vw_WeekShifts AS
SELECT
    sh.id AS shift_id,
    sh.startTime,
    sh.endTime,
    s.id AS staff_id,
    s.firstname,
    s.lastname,
    sr.name AS staff_role
FROM `Shift` sh
LEFT JOIN ShiftStaff ss ON ss.fkShiftId = sh.id
LEFT JOIN Staff s ON s.id = ss.fkStaffId
LEFT JOIN StaffRole sr ON sr.id = s.fkRoleId;

CREATE OR REPLACE VIEW vw_Rooms AS
SELECT
    r.id AS room_id,
    r.name AS room_name,
    f.name AS floor_name,
    b.name AS building_name,
    rb.id AS booking_id,
    rb.startTime,
    rb.endTime,
    p.id AS patient_id,
    p.firstname AS patient_firstname,
    p.lastname AS patient_lastname,
    t.id AS treatment_id,
    t.description AS treatment_description,
    t.time AS treatment_time
FROM Room r
LEFT JOIN Floor f ON f.id = r.fkFloorId
LEFT JOIN Building b ON b.id = f.fkBuildingId
LEFT JOIN RoomBooking rb ON rb.fkRoomId = r.id
LEFT JOIN Patient p ON p.id = rb.fkPatientId
LEFT JOIN Treatment t ON t.fkPatientId = p.id;

CREATE OR REPLACE VIEW vw_Departments AS
SELECT
    d.id AS department_id,
    d.name AS department_name,
    d.type AS department_type,
    s.id AS staff_id,
    s.firstname,
    s.lastname,
    sr.name AS staff_role
FROM Department d
LEFT JOIN DepartmentStaff ds ON ds.fkDepartmentId = d.id
LEFT JOIN Staff s ON s.id = ds.fkStaffId
LEFT JOIN StaffRole sr ON sr.id = s.fkRoleId;

-- stored functions


use HospitalDB;

DELIMITER $$

CREATE FUNCTION `CalculatePatientAge` (dateOfBirth DATE)
RETURNS INTEGER
DETERMINISTIC
BEGIN
	RETURN timestampdiff(YEAR, dateOfBirth, CURDATE());
END$$

DELIMITER ;


DELIMITER $$

CREATE FUNCTION `IsPatientMinor` (dateOfBirth DATE)
RETURNS boolean
DETERMINISTIC
BEGIN
	RETURN timestampdiff(YEAR, dateOfBirth, CURDATE()) < 18;
END$$

DELIMITER ;

DELIMITER $$

CREATE FUNCTION `PatientBmiValue` (weightInKg float, heightInCm float)
RETURNS float
DETERMINISTIC
BEGIN
	IF weightInKg <= 0 OR heightInCm <= 0 THEN
		RETURN NULL;
	END IF;

	RETURN weightInKg / POW(heightInCm / 100, 2);
END$$

DELIMITER ;

DELIMITER $$

CREATE FUNCTION `PatientBmiCategory` (weightInKg float, heightInCm float)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
	DECLARE bmi FLOAT;
    
    SET bmi = PatientBmiValue(weight_kg, height_cm);
	
	IF bmi IS NULL THEN
		RETURN NULL;
	ELSEIF bmi < 18.5 THEN
		RETURN 'underweight';
	ELSEIF bmi < 25 THEN
		RETURN 'normal';
	ELSEIF bmi < 30 THEN
		RETURN 'overweight';
	ELSE
		RETURN 'obesity';
	END IF;
END$$

DELIMITER ;

-- stored procedure

use HospitalDB;

DELIMITER $$

CREATE PROCEDURE sp_GetNurseById(IN pNurseId INT)
BEGIN
    SELECT
        s.id AS nurse_id,
        s.firstname,
        s.lastname,
        d.id AS department_id,
        d.name AS department_name,
        sh.id AS shift_id,
        sh.startTime AS shift_start,
        sh.endTime AS shift_end
    FROM Staff s
    JOIN StaffRole sr ON sr.id = s.fkRoleId AND sr.name = 'Nurse'
    LEFT JOIN DepartmentStaff ds ON ds.fkStaffId = s.id
    LEFT JOIN Department d ON d.id = ds.fkDepartmentId
    LEFT JOIN ShiftStaff ss ON ss.fkStaffId = s.id
    LEFT JOIN `Shift` sh ON sh.id = ss.fkShiftId
    WHERE s.id = pNurseId;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_GetFloorById(IN pFloorId INT)
BEGIN
    SELECT 
        f.id AS floor_id,
        f.name AS floor_name,
        b.id AS building_id,
        b.name AS building_name,
        b.address AS building_address,
        r.id AS room_id,
        r.name AS room_name
    FROM Floor f
    JOIN Building b ON b.id = f.fkBuildingId
    LEFT JOIN Room r ON r.fkFloorId = f.id
    WHERE f.id = pFloorId;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_GetBuildingById(IN pBuildingId INT)
BEGIN
    SELECT 
        b.id AS building_id,
        b.name AS building_name,
        b.address,
        f.id AS floor_id,
        f.name AS floor_name,
        r.id AS room_id,
        r.name AS room_name
    FROM Building b
    LEFT JOIN Floor f ON f.fkBuildingId = b.id
    LEFT JOIN Room r ON r.fkFloorId = f.id
    WHERE b.id = pBuildingId;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_GetDoctorById(IN pDoctorId INT)
BEGIN
    SELECT
        s.id AS doctor_id,
        s.firstname,
        s.lastname,
        d.id AS department_id,
        d.name AS department_name
    FROM Staff s
    JOIN StaffRole sr ON sr.id = s.fkRoleId AND sr.name = 'Doctor'
    LEFT JOIN DepartmentStaff ds ON ds.fkStaffId = s.id
    LEFT JOIN Department d ON d.id = ds.fkDepartmentId
    WHERE s.id = pDoctorId;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_GetPatientById(IN pPatientId INT)
BEGIN
    SELECT
        p.id AS patient_id,
        p.firstname,
        p.lastname,
        p.gender,
        p.cprNumber,
        rb.id AS roombooking_id,
        r.name AS room_name,
        f.name AS floor_name,
        b.name AS building_name
    FROM Patient p
    LEFT JOIN RoomBooking rb ON rb.fkPatientId = p.id
    LEFT JOIN Room r ON r.id = rb.fkRoomId
    LEFT JOIN Floor f ON f.id = r.fkFloorId
    LEFT JOIN Building b ON b.id = f.fkBuildingId
    WHERE p.id = pPatientId;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_GetShiftById(IN pShiftId INT)
BEGIN
    SELECT
        sh.id AS shift_id,
        sh.startTime,
        sh.endTime,
        s.id AS staff_id,
        s.firstname,
        s.lastname,
        sr.name AS staff_role
    FROM `Shift` sh
    LEFT JOIN ShiftStaff ss ON ss.fkShiftId = sh.id
    LEFT JOIN Staff s ON s.id = ss.fkStaffId
    LEFT JOIN StaffRole sr ON sr.id = s.fkRoleId
    WHERE sh.id = pShiftId;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_GetRoomById(IN pRoomId INT)
BEGIN
    SELECT
        r.id AS room_id,
        r.name AS room_name,
        f.name AS floor_name,
        b.name AS building_name,
        rb.id AS booking_id,
        rb.startTime,
        rb.endTime,
        p.id AS patient_id,
        p.firstname AS patient_firstname,
        p.lastname AS patient_lastname
    FROM Room r
    LEFT JOIN Floor f ON f.id = r.fkFloorId
    LEFT JOIN Building b ON b.id = f.fkBuildingId
    LEFT JOIN RoomBooking rb ON rb.fkRoomId = r.id
    LEFT JOIN Patient p ON p.id = rb.fkPatientId
    WHERE r.id = pRoomId;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_GetDepartmentById(IN pDepartmentId INT)
BEGIN
    SELECT
        d.id AS department_id,
        d.name AS department_name,
        d.type AS department_type,
        s.id AS staff_id,
        s.firstname,
        s.lastname,
        sr.name AS staff_role
    FROM Department d
    LEFT JOIN DepartmentStaff ds ON ds.fkDepartmentId = d.id
    LEFT JOIN Staff s ON s.id = ds.fkStaffId
    LEFT JOIN StaffRole sr ON sr.id = s.fkRoleId
    WHERE d.id = pDepartmentId;
END$$

DELIMITER ;

