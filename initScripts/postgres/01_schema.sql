
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
    cpr_number varchar(50) unique,
    date_of_birth date,
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
    join staff_role sr on sr.id = s.fk_role_id and sr.name = 'nurse'
    left join department_staff ds on ds.fk_staff_id = s.id
    left join department d on d.id = ds.fk_department_id
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
