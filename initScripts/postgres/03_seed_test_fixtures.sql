
-- test fixtures for postman/newman positive-delete tests _______________________
--
-- these rows exist for exactly one purpose: to be deleted by a controller's
-- own "positive delete" test in postman, without touching real seed data that
-- other tests (read/update/validation) depend on staying stable.
--
-- naming convention: firstname/name fields are prefixed with 'zztest' so they
-- are obvious in the db during debugging and sort to the bottom of any
-- alphabetical listing.
--
-- ordering rule: two of these rows (treatment, medication_storage) are shared
-- parents for leaf-table fixtures below them. those two controllers' own
-- delete tests must run AFTER the leaf fixtures that reference them:
--   TreatmentStaff, Prescription  ->  before  ->  Treatment
--   MissingStorage                ->  before  ->  Storage
-- every other row below is a true orphan (nothing references it), so its
-- controller's delete test can run in any order relative to the others.


-- shared parent: disposable treatment
-- referenced by: TreatmentStaff fixture, Prescription fixture below
-- own controller: Treatment (delete this AFTER TreatmentStaff + Prescription fixtures are deleted)
insert into treatment (fk_patient_id, description, time) values
(1, 'zztest - disposable treatment, reserved for delete fixtures', current_timestamp);
-- -> id 26


-- shared parent: disposable medication_storage
-- referenced by: MissingStorage fixture below
-- own controller: Storage (delete this AFTER MissingStorage fixture is deleted)
insert into medication_storage (fk_medication_id, amount) values
(1, 1);
-- -> id 27


-- leaf: TreatmentStaff delete fixture (points at shared treatment above, stable staff)
insert into treatment_staff (fk_treatment_id, fk_staff_id) values
(26, 1);
-- -> id 51


-- leaf: Prescription delete fixture (points at shared treatment above, stable medication + staff)
insert into prescription (fk_medication_id, fk_treatment_id, fk_prescribed_by_staff_id, doses) values
(1, 26, 1, 1);
-- -> id 26


-- leaf: RoomBooking delete fixture (points at stable room + patient, no shared parent)
insert into room_booking (fk_room_id, start_time, end_time, fk_patient_id) values
(1, '2099-01-01 08:00:00', '2099-01-01 09:00:00', 1);
-- -> id 11


-- leaf: MissingStorage delete fixture (points at shared medication_storage above)
insert into medication_storage_missing (fk_medication_storage_id, amount_missing, went_missing_at) values
(27, 1, '2099-01-01 08:00:00');
-- -> id 3


-- orphan: Patient delete fixture (nothing references this id, safe standalone)
insert into patient (firstname, lastname, gender, cpr_number, date_of_birth, weight_kg, height_cm) values
('zztest', 'deletetarget', 'other', 'ZZTEST-PATIENT-0001', '1990-01-01', 70, 170);
-- -> id 26


-- orphan: Staff delete fixture (nothing references this id, safe standalone)
insert into staff (firstname, lastname, fk_role_id) values
('zztest', 'deletetarget', 3);
-- -> id 52


-- orphan: Medicin delete fixture (nothing references this id, safe standalone)
insert into medication (name, generic_name, brand, form, strength, category, description) values
('zztest-deletetarget', 'zztest', 'zztest', 'tablet', '0mg', 'test fixture', 'disposable row for delete testing, do not use for anything else.');
-- -> id 27


-- orphan: Department delete fixture (nothing references this id, safe standalone)
insert into department (name, type) values
('zztest-deletetarget', 'test fixture');
-- -> id 6


-- orphan: Location (floor) delete fixture (no rooms attached, safe standalone)
insert into floor (name, fk_building_id) values
('zztest-deletetarget', 1);
-- -> id 7


-- orphan: DepartmentStaff delete fixture (points at stable staff + stable department —
-- deliberately NOT the disposable department id6 above, so it can't attach a child to
-- Department's own orphan-delete target)
insert into department_staff (fk_staff_id, fk_department_id) values
(1, 1);
-- -> id 51


-- orphan: User delete fixture (fk_staff_id null, not linked via user_patient — nothing
-- references this row, safe standalone. password_hash/salt are placeholders, not a real
-- bcrypt hash — this row is only ever deleted, never logged in as)
insert into "user" (username, password_hash, salt, fk_staff_id) values
('zztest_deletetarget', 'zztest-disposable-not-a-real-hash', 'zztest-disposable-salt', null);
-- -> id 7
