
-- create database


-- create database hospitaldb;
-- \c hospitaldb;


-- tables _______________________


create table staff_role (
    id int generated always as identity primary key,
    name varchar(50) not null unique
);

create table building (
    id int generated always as identity primary key,
    name varchar(100) not null,
    address varchar(255)
);

create table floor (
    id int generated always as identity primary key,
    name varchar(100) not null,
    fk_building_id int not null references building(id)
);

create table room (
    id int generated always as identity primary key,
    name varchar(100) not null,
    fk_floor_id int not null references floor(id)
);

create table patient (
    id int generated always as identity primary key,
    firstname varchar(100),
    lastname varchar(100),
    gender varchar(50),
    cpr_number varchar(50) unique
);

create table room_booking (
    id int generated always as identity primary key,
    fk_room_id int not null references room(id),
    start_time timestamp not null,
    end_time timestamp not null,
    fk_patient_id int not null references patient(id)
);

create table staff (
    id int generated always as identity primary key,
    firstname varchar(100),
    lastname varchar(100),
    fk_role_id int not null references staff_role(id)
);

create table "user" (
    id int generated always as identity primary key,
    username varchar(100) not null unique,
    password_hash varchar(255) not null,
    salt varchar(255) not null,
    fk_staff_id int not null references staff(id)
);

create table department (
    id int generated always as identity primary key,
    name varchar(100),
    type varchar(100)
);

create table department_staff (
    id int generated always as identity primary key,
    fk_staff_id int not null references staff(id),
    fk_department_id int not null references department(id)
);

create table medication (
    id int generated always as identity primary key,
    name varchar(100),
    generic_name varchar(100),
    brand varchar(100),
    form varchar(100),
    strength varchar(100),
    category varchar(100),
    description text
);

create table medication_storage (
    id int generated always as identity primary key,
    fk_medication_id int not null references medication(id),
    amount double precision not null
);

create table medication_storage_missing (
    id int generated always as identity primary key,
    fk_medication_storage_id int not null references medication_storage(id),
    amount_missing double precision not null,
    went_missing_at timestamp not null
);

create table shift (
    id int generated always as identity primary key,
    start_time timestamp not null,
    end_time timestamp not null
);

create table shift_staff (
    id int generated always as identity primary key,
    fk_shift_id int not null references shift(id),
    fk_staff_id int not null references staff(id)
);

create table treatment (
    id int generated always as identity primary key,
    fk_patient_id int not null references patient(id),
    description varchar(500),
    time timestamp not null
);

create table prescription (
    id int generated always as identity primary key,
    fk_medication_id int not null references medication(id),
    fk_treatment_id int not null references treatment(id),
    fk_prescribed_by_staff_id int not null references staff(id),
    doses double precision not null
);

create table treatment_staff (
    id int generated always as identity primary key,
    fk_treatment_id int not null references treatment(id),
    fk_staff_id int not null references staff(id)
);


-- insert data _______________________



-- staff roles

insert into staff_role (name) values
('doctor'),
('nurse');


-- buildings

insert into building (name, address) values
('main hospital', '123 health st'),
('specialist wing', '456 care ave');


-- floors

insert into floor (name, fk_building_id) values
('ground floor', 1), ('first floor', 1), ('second floor', 1),
('ground floor', 2), ('first floor', 2), ('second floor', 2);


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
('melatonin','melatonin','natrol','tablet','5mg','sleep aid','helps with sleep disorders.');


-- medication storage

insert into medication_storage (fk_medication_id, amount) values
(1,500),(2,400),(3,300),(4,250),(5,200),(6,180),(7,160),(8,150),(9,140),(10,130),
(11,120),(12,110),(13,100),(14,90),(15,80),(16,70),(17,60),(18,50),(19,40),(20,30),
(21,25),(22,20),(23,15),(24,10),(25,5),(26,30);


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

insert into patient (firstname, lastname, gender, cpr_number) values
('michael','conklin','male','150553-4561'),
('darlene','kelly','female','120254-3800'),
('edward','reep','male','210696-1193'),
('jennifer','love','female','110751-2280'),
('eloise','lininger','female','070271-2408'),
('sharon','miller','female','130874-1016'),
('phillip','rape','male','041245-3581'),
('frances','johnson','female','011254-3430'),
('rickey','martin','male','300481-3285'),
('mayra','james','female','200105-6762'),
('kathleen','russell','female','081002-9986'),
('william','andrews','female','111158-4571'),
('fernando','acosta','male','290890-4365'),
('oliva','rogers','female','201195-1166'),
('joselyn','hudnall','female','121081-0974'),
('shirley','walker','female','100159-3664'),
('garrett','taylor','male','150301-9147'),
('carl','ellis','male','111062-4731'),
('patti','jones','female','091175-1364'),
('derrick','williams','male','100691-2679'),
('joyce','toles','female','060884-2934'),
('stephanie','knox','female','221160-0554'),
('michael','gonzalez','male','141197-3723'),
('charles','eusebio','male','111156-3477'),
('bobby','selzer','male','060302-6535');


-- staff (doctors first, then nurses) - role_id: 1 = doctor, 2 = nurse

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
('henrik','hansen',2);


-- users (linked to staff, for login)
-- passwords: doctors use 'Doctor1234!', nurses use 'Nurse1234!'

insert into "user" (username, password_hash, salt, fk_staff_id) values
('larsc',  '$2b$11$nlclhzrwTwvhpiFLLyB32./O5E.NSqH9Z6YyHVHLInzuvic3W0daK', '$2b$11$nlclhzrwTwvhpiFLLyB32.', 1),
('doctor',   '$2b$11$v49fsgGrRe4izN65HiA.X.R9nnF7pfoOLf/s7QRiDsLFaTE4MNtLe', '$2b$11$v49fsgGrRe4izN65HiA.X.', 2),
('annaj',  '$2b$11$F/xqtdVrZjJUb6hfXptkAuse9F7s3DbH33SigLynX9D0YxMMqZI0O', '$2b$11$F/xqtdVrZjJUb6hfXptkAu', 26),
('nurse', '$2b$11$zFxZ4mU9GQZBiLkrz9fCRuGeMLXwumuCHWBCr7by6mccjlzMnT65m', '$2b$11$zFxZ4mU9GQZBiLkrz9fCRu', 27);


-- departments

insert into department (name, type) values
('emergency','critical care'),
('surgery','operation'),
('cardiology','specialist'),
('pediatrics','child care'),
('radiology','diagnostics');

-- department staff - doctors: 1–25, nurses: 26–50
insert into department_staff (fk_staff_id, fk_department_id) values
(1,1),(2,1),(3,2),(4,2),(5,3),(6,3),(7,4),(8,4),(9,5),(10,5),
(11,1),(12,2),(13,3),(14,4),(15,5),(16,1),(17,2),(18,3),(19,4),(20,5),
(21,1),(22,2),(23,3),(24,4),(25,5),
(26,1),(27,1),(28,2),(29,2),(30,3),(31,3),(32,4),(33,4),(34,5),(35,5),
(36,1),(37,2),(38,3),(39,4),(40,5),(41,1),(42,2),(43,3),(44,4),(45,5),
(46,1),(47,2),(48,3),(49,4),(50,5);

-- shifts

insert into shift (start_time,end_time) values
('2025-10-07 08:00:00','2025-10-07 16:00:00'),
('2025-10-07 16:00:00','2025-10-07 23:59:00'),
('2025-10-08 00:00:00','2025-10-08 08:00:00');

-- shift staff
insert into shift_staff (fk_shift_id, fk_staff_id) values
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),
(2,11),(2,12),(2,13),(2,14),(2,15),(2,16),(2,17),(2,18),(2,19),(2,20),
(3,21),(3,22),(3,23),(3,24),(3,25),
(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),
(2,36),(2,37),(2,38),(2,39),(2,40),(2,41),(2,42),(2,43),(2,44),(2,45),
(3,46),(3,47),(3,48),(3,49),(3,50);


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
(25,'chronic illness monitoring',current_timestamp);

-- treatment staff - (doctor + nurse per treatment)
insert into treatment_staff (fk_treatment_id, fk_staff_id) values
(1,1),(1,26),(2,2),(2,27),(3,3),(3,28),(4,4),(4,29),(5,5),(5,30),
(6,6),(6,31),(7,7),(7,32),(8,8),(8,33),(9,9),(9,34),(10,10),(10,35),
(11,11),(11,36),(12,12),(12,37),(13,13),(13,38),(14,14),(14,39),
(15,15),(15,40),(16,16),(16,41),(17,17),(17,42),(18,18),(18,43),
(19,19),(19,44),(20,20),(20,45),(21,21),(21,46),(22,22),(22,47),
(23,23),(23,48),(24,24),(24,49),(25,25),(25,50);

-- prescriptions - (doctors only)
insert into prescription (fk_medication_id, fk_treatment_id, fk_prescribed_by_staff_id, doses) values
(1,1,1,2),(2,2,2,3),(3,3,3,1),(4,4,4,2),(5,5,5,1),
(6,6,6,3),(7,7,7,2),(8,8,8,1),(9,9,9,2),(10,10,10,1),
(11,11,11,2),(12,12,12,1),(13,13,13,2),(14,14,14,3),(15,15,15,1),
(16,16,16,2),(17,17,17,1),(18,18,18,2),(19,19,19,3),(20,20,20,1),
(21,21,21,2),(22,22,22,1),(23,23,23,2),(24,24,24,1),(25,25,25,3);


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
(10,'2025-10-07 17:00:00','2025-10-07 21:00:00',10);

-- medication storage missing  
insert into medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) values
(1, 10, '2025-10-07 12:00:00'),
(2, 5, '2025-10-07 15:30:00');


-- views _______________________


create or replace view vw_nurses as
select
    s.id as nurse_id,
    s.firstname,
    s.lastname,
    d.id as department_id,
    d.name as department_name,
    sh.id as shift_id,
    sh.start_time as shift_start,
    sh.end_time as shift_end
from staff s
join staff_role sr on sr.id = s.fk_role_id
left join department_staff ds on ds.fk_staff_id = s.id
left join department d on d.id = ds.fk_department_id
left join shift_staff ss on ss.fk_staff_id = s.id
left join shift sh on sh.id = ss.fk_shift_id
where sr.name = 'nurse';

create or replace view vw_doctors as
select
    s.id as doctor_id,
    s.firstname,
    s.lastname,
    d.id as department_id,
    d.name as department_name
from staff s
join staff_role sr on sr.id = s.fk_role_id and sr.name = 'doctor'
left join department_staff ds on ds.fk_staff_id = s.id
left join department d on d.id = ds.fk_department_id;

create or replace view vw_week_shifts as
select
    sh.id as shift_id,
    sh.start_time,
    sh.end_time,
    s.id as staff_id,
    s.firstname,
    s.lastname,
    sr.name as staff_role
from shift sh
left join shift_staff ss on ss.fk_shift_id = sh.id
left join staff s on s.id = ss.fk_staff_id
left join staff_role sr on sr.id = s.fk_role_id;

-- (other views can remain identical — just no backticks)


-- functions _______________________


create or replace function calculate_patient_age(date_of_birth date)
returns integer
language plpgsql
as $$
begin
    return extract(year from age(current_date, date_of_birth));
end;
$$;

create or replace function is_patient_minor(date_of_birth date)
returns boolean
language plpgsql
as $$
begin
    return extract(year from age(current_date, date_of_birth)) < 18;
end;
$$;

create or replace function patient_bmi_value(
    weight_in_kg double precision,
    height_in_cm double precision
)
returns double precision
language plpgsql
as $$
begin
    if weight_in_kg <= 0 or height_in_cm <= 0 then
        return null;
    end if;

    return weight_in_kg / power(height_in_cm / 100.0, 2);
end;
$$;

create or replace function patient_bmi_category(
    weight_in_kg double precision,
    height_in_cm double precision
)
returns varchar(20)
language plpgsql
as $$
declare
    bmi double precision;
begin
    bmi := patient_bmi_value(weight_in_kg, height_in_cm);

    if bmi is null then
        return null;
    elsif bmi < 18.5 then
        return 'underweight';
    elsif bmi < 25 then
        return 'normal';
    elsif bmi < 30 then
        return 'overweight';
    else
        return 'obesity';
    end if;
end;
$$;


-- procedure _______________________


create or replace function sp_get_nurse_by_id(p_nurse_id int)
returns table(
    nurse_id int,
    firstname varchar,
    lastname varchar,
    department_id int,
    department_name varchar,
    shift_id int,
    shift_start timestamp,
    shift_end timestamp
)
language plpgsql
as $$
begin
    return query
    select
        s.id,
        s.firstname,
        s.lastname,
        d.id,
        d.name,
        sh.id,
        sh.start_time,
        sh.end_time
    from staff s
    join staff_role sr on sr.id = s.fk_role_id and sr.name = 'nurse'
    left join department_staff ds on ds.fk_staff_id = s.id
    left join department d on d.id = ds.fk_department_id
    left join shift_staff ss on ss.fk_staff_id = s.id
    left join shift sh on sh.id = ss.fk_shift_id
    where s.id = p_nurse_id;
end;
$$;

create or replace function sp_get_floor_by_id(p_floor_id int)
returns table(
    floor_id int,
    floor_name varchar,
    building_id int,
    building_name varchar,
    building_address varchar,
    room_id int,
    room_name varchar
)
language plpgsql
as $$
begin
    return query
    select
        f.id,
        f.name,
        b.id,
        b.name,
        b.address,
        r.id,
        r.name
    from floor f
    join building b on b.id = f.fk_building_id
    left join room r on r.fk_floor_id = f.id
    where f.id = p_floor_id;
end;
$$;

create or replace function sp_get_building_by_id(p_building_id int)
returns table(
    building_id int,
    building_name varchar,
    address varchar,
    floor_id int,
    floor_name varchar,
    room_id int,
    room_name varchar
)
language plpgsql
as $$
begin
    return query
    select
        b.id,
        b.name,
        b.address,
        f.id,
        f.name,
        r.id,
        r.name
    from building b
    left join floor f on f.fk_building_id = b.id
    left join room r on r.fk_floor_id = f.id
    where b.id = p_building_id;
end;
$$;

create or replace function sp_get_doctor_by_id(p_doctor_id int)
returns table(
    doctor_id int,
    firstname varchar,
    lastname varchar,
    department_id int,
    department_name varchar
)
language plpgsql
as $$
begin
    return query
    select
        s.id,
        s.firstname,
        s.lastname,
        d.id,
        d.name
    from staff s
    join staff_role sr on sr.id = s.fk_role_id and sr.name = 'doctor'
    left join department_staff ds on ds.fk_staff_id = s.id
    left join department d on d.id = ds.fk_department_id
    where s.id = p_doctor_id;
end;
$$;

create or replace function sp_get_patient_by_id(p_patient_id int)
returns table(
    patient_id int,
    firstname varchar,
    lastname varchar,
    gender varchar,
    cpr_number varchar,
    roombooking_id int,
    room_name varchar,
    floor_name varchar,
    building_name varchar
)
language plpgsql
as $$
begin
    return query
    select
        p.id,
        p.firstname,
        p.lastname,
        p.gender,
        p.cpr_number,
        rb.id,
        r.name,
        f.name,
        b.name
    from patient p
    left join room_booking rb on rb.fk_patient_id = p.id
    left join room r on r.id = rb.fk_room_id
    left join floor f on f.id = r.fk_floor_id
    left join building b on b.id = f.fk_building_id
    where p.id = p_patient_id;
end;
$$;

create or replace function sp_get_shift_by_id(p_shift_id int)
returns table(
    shift_id int,
    start_time timestamp,
    end_time timestamp,
    staff_id int,
    firstname varchar,
    lastname varchar,
    staff_role varchar
)
language plpgsql
as $$
begin
    return query
    select
        sh.id,
        sh.start_time,
        sh.end_time,
        s.id,
        s.firstname,
        s.lastname,
        sr.name
    from shift sh
    left join shift_staff ss on ss.fk_shift_id = sh.id
    left join staff s on s.id = ss.fk_staff_id
    left join staff_role sr on sr.id = s.fk_role_id
    where sh.id = p_shift_id;
end;
$$;

create or replace function sp_get_room_by_id(p_room_id int)
returns table(
    room_id int,
    room_name varchar,
    floor_name varchar,
    building_name varchar,
    booking_id int,
    start_time timestamp,
    end_time timestamp,
    patient_id int,
    patient_firstname varchar,
    patient_lastname varchar
)
language plpgsql
as $$
begin
    return query
    select
        r.id,
        r.name,
        f.name,
        b.name,
        rb.id,
        rb.start_time,
        rb.end_time,
        p.id,
        p.firstname,
        p.lastname
    from room r
    left join floor f on f.id = r.fk_floor_id
    left join building b on b.id = f.fk_building_id
    left join room_booking rb on rb.fk_room_id = r.id
    left join patient p on p.id = rb.fk_patient_id
    where r.id = p_room_id;
end;
$$;

create or replace function sp_get_department_by_id(p_department_id int)
returns table(
    department_id int,
    department_name varchar,
    department_type varchar,
    staff_id int,
    firstname varchar,
    lastname varchar,
    staff_role varchar
)
language plpgsql
as $$
begin
    return query
    select
        d.id,
        d.name,
        d.type,
        s.id,
        s.firstname,
        s.lastname,
        sr.name
    from department d
    left join department_staff ds on ds.fk_department_id = d.id
    left join staff s on s.id = ds.fk_staff_id
    left join staff_role sr on sr.id = s.fk_role_id
    where d.id = p_department_id;
end;
$$;

