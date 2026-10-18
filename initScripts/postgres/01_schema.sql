
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
    firstname varchar(100) not null,
    lastname varchar(100) not null,
    gender varchar(50) not null,
    cpr_number varchar(50) not null unique,
    date_of_birth date not null,
    weight_kg double precision,
    height_cm double precision
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
    fk_staff_id int references staff(id)
);

create table user_patient (
    id int generated always as identity primary key,
    fk_user_id int not null unique references "user"(id),
    fk_patient_id int not null unique references patient(id)
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
