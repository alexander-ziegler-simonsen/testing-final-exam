using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using hospitalApi.Models;

namespace hospitalApi.Data;

public partial class HospitalContext : DbContext
{
    public HospitalContext(DbContextOptions<HospitalContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Building> Buildings { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<DepartmentStaff> DepartmentStaffs { get; set; }

    public virtual DbSet<Floor> Floors { get; set; }

    public virtual DbSet<Medication> Medications { get; set; }

    public virtual DbSet<MedicationStorage> MedicationStorages { get; set; }

    public virtual DbSet<MedicationStorageMissing> MedicationStorageMissings { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Prescription> Prescriptions { get; set; }

    public virtual DbSet<Room> Rooms { get; set; }

    public virtual DbSet<RoomBooking> RoomBookings { get; set; }

    public virtual DbSet<Staff> Staff { get; set; }

    public virtual DbSet<StaffRole> StaffRoles { get; set; }

    public virtual DbSet<Treatment> Treatments { get; set; }

    public virtual DbSet<TreatmentStaff> TreatmentStaffs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserPatient> UserPatients { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Building>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("building_pkey");

            entity.ToTable("building");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("department_pkey");

            entity.ToTable("department");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Type)
                .HasMaxLength(100)
                .HasColumnName("type");
        });

        modelBuilder.Entity<DepartmentStaff>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("department_staff_pkey");

            entity.ToTable("department_staff");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.FkDepartmentId).HasColumnName("fk_department_id");
            entity.Property(e => e.FkStaffId).HasColumnName("fk_staff_id");

            entity.HasOne(d => d.FkDepartment).WithMany(p => p.DepartmentStaffs)
                .HasForeignKey(d => d.FkDepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("department_staff_fk_department_id_fkey");

            entity.HasOne(d => d.FkStaff).WithMany(p => p.DepartmentStaffs)
                .HasForeignKey(d => d.FkStaffId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("department_staff_fk_staff_id_fkey");
        });

        modelBuilder.Entity<Floor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("floor_pkey");

            entity.ToTable("floor");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.FkBuildingId).HasColumnName("fk_building_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");

            entity.HasOne(d => d.FkBuilding).WithMany(p => p.Floors)
                .HasForeignKey(d => d.FkBuildingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("floor_fk_building_id_fkey");
        });

        modelBuilder.Entity<Medication>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("medication_pkey");

            entity.ToTable("medication");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Brand)
                .HasMaxLength(100)
                .HasColumnName("brand");
            entity.Property(e => e.Category)
                .HasMaxLength(100)
                .HasColumnName("category");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Form)
                .HasMaxLength(100)
                .HasColumnName("form");
            entity.Property(e => e.GenericName)
                .HasMaxLength(100)
                .HasColumnName("generic_name");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Strength)
                .HasMaxLength(100)
                .HasColumnName("strength");
        });

        modelBuilder.Entity<MedicationStorage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("medication_storage_pkey");

            entity.ToTable("medication_storage");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.FkMedicationId).HasColumnName("fk_medication_id");

            entity.HasOne(d => d.FkMedication).WithMany(p => p.MedicationStorages)
                .HasForeignKey(d => d.FkMedicationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("medication_storage_fk_medication_id_fkey");
        });

        modelBuilder.Entity<MedicationStorageMissing>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("medication_storage_missing_pkey");

            entity.ToTable("medication_storage_missing");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.AmountMissing).HasColumnName("amount_missing");
            entity.Property(e => e.FkMedicationStorageId).HasColumnName("fk_medication_storage_id");
            entity.Property(e => e.WentMissingAt)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("went_missing_at");

            entity.HasOne(d => d.FkMedicationStorage).WithMany(p => p.MedicationStorageMissings)
                .HasForeignKey(d => d.FkMedicationStorageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("medication_storage_missing_fk_medication_storage_id_fkey");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("patient_pkey");

            entity.ToTable("patient");

            entity.HasIndex(e => e.CprNumber, "patient_cpr_number_key").IsUnique();

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.CprNumber)
                .HasMaxLength(50)
                .HasColumnName("cpr_number");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Firstname)
                .HasMaxLength(100)
                .HasColumnName("firstname");
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasColumnName("gender");
            entity.Property(e => e.HeightCm).HasColumnName("height_cm");
            entity.Property(e => e.Lastname)
                .HasMaxLength(100)
                .HasColumnName("lastname");
            entity.Property(e => e.WeightKg).HasColumnName("weight_kg");
        });

        modelBuilder.Entity<Prescription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("prescription_pkey");

            entity.ToTable("prescription");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Doses).HasColumnName("doses");
            entity.Property(e => e.FkMedicationId).HasColumnName("fk_medication_id");
            entity.Property(e => e.FkPrescribedByStaffId).HasColumnName("fk_prescribed_by_staff_id");
            entity.Property(e => e.FkTreatmentId).HasColumnName("fk_treatment_id");

            entity.HasOne(d => d.FkMedication).WithMany(p => p.Prescriptions)
                .HasForeignKey(d => d.FkMedicationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("prescription_fk_medication_id_fkey");

            entity.HasOne(d => d.FkPrescribedByStaff).WithMany(p => p.Prescriptions)
                .HasForeignKey(d => d.FkPrescribedByStaffId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("prescription_fk_prescribed_by_staff_id_fkey");

            entity.HasOne(d => d.FkTreatment).WithMany(p => p.Prescriptions)
                .HasForeignKey(d => d.FkTreatmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("prescription_fk_treatment_id_fkey");
        });

        modelBuilder.Entity<Room>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("room_pkey");

            entity.ToTable("room");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.FkFloorId).HasColumnName("fk_floor_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");

            entity.HasOne(d => d.FkFloor).WithMany(p => p.Rooms)
                .HasForeignKey(d => d.FkFloorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("room_fk_floor_id_fkey");
        });

        modelBuilder.Entity<RoomBooking>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("room_booking_pkey");

            entity.ToTable("room_booking");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.EndTime)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("end_time");
            entity.Property(e => e.FkPatientId).HasColumnName("fk_patient_id");
            entity.Property(e => e.FkRoomId).HasColumnName("fk_room_id");
            entity.Property(e => e.StartTime)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("start_time");

            entity.HasOne(d => d.FkPatient).WithMany(p => p.RoomBookings)
                .HasForeignKey(d => d.FkPatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("room_booking_fk_patient_id_fkey");

            entity.HasOne(d => d.FkRoom).WithMany(p => p.RoomBookings)
                .HasForeignKey(d => d.FkRoomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("room_booking_fk_room_id_fkey");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("staff_pkey");

            entity.ToTable("staff");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Firstname)
                .HasMaxLength(100)
                .HasColumnName("firstname");
            entity.Property(e => e.FkRoleId).HasColumnName("fk_role_id");
            entity.Property(e => e.Lastname)
                .HasMaxLength(100)
                .HasColumnName("lastname");

            entity.HasOne(d => d.FkRole).WithMany(p => p.Staff)
                .HasForeignKey(d => d.FkRoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("staff_fk_role_id_fkey");
        });

        modelBuilder.Entity<StaffRole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("staff_role_pkey");

            entity.ToTable("staff_role");

            entity.HasIndex(e => e.Name, "staff_role_name_key").IsUnique();

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_pkey");

            entity.ToTable("user");

            entity.HasIndex(e => e.Username, "user_username_key").IsUnique();

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .HasColumnName("username");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Salt)
                .HasMaxLength(255)
                .HasColumnName("salt");
            entity.Property(e => e.FkStaffId).HasColumnName("fk_staff_id");

            entity.HasOne(d => d.FkStaff).WithMany()
                .HasForeignKey(d => d.FkStaffId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_fk_staff_id_fkey");
        });

        modelBuilder.Entity<UserPatient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_patient_pkey");

            entity.ToTable("user_patient");

            entity.HasIndex(e => e.FkUserId, "user_patient_fk_user_id_key").IsUnique();

            entity.HasIndex(e => e.FkPatientId, "user_patient_fk_patient_id_key").IsUnique();

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.FkUserId).HasColumnName("fk_user_id");
            entity.Property(e => e.FkPatientId).HasColumnName("fk_patient_id");

            entity.HasOne(d => d.FkUser).WithOne(p => p.UserPatient)
                .HasForeignKey<UserPatient>(d => d.FkUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_patient_fk_user_id_fkey");

            entity.HasOne(d => d.FkPatient).WithOne(p => p.UserPatient)
                .HasForeignKey<UserPatient>(d => d.FkPatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_patient_fk_patient_id_fkey");
        });

        modelBuilder.Entity<Treatment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("treatment_pkey");

            entity.ToTable("treatment");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.FkPatientId).HasColumnName("fk_patient_id");
            entity.Property(e => e.Time)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("time");

            entity.HasOne(d => d.FkPatient).WithMany(p => p.Treatments)
                .HasForeignKey(d => d.FkPatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("treatment_fk_patient_id_fkey");
        });

        modelBuilder.Entity<TreatmentStaff>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("treatment_staff_pkey");

            entity.ToTable("treatment_staff");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.FkStaffId).HasColumnName("fk_staff_id");
            entity.Property(e => e.FkTreatmentId).HasColumnName("fk_treatment_id");

            entity.HasOne(d => d.FkStaff).WithMany(p => p.TreatmentStaffs)
                .HasForeignKey(d => d.FkStaffId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("treatment_staff_fk_staff_id_fkey");

            entity.HasOne(d => d.FkTreatment).WithMany(p => p.TreatmentStaffs)
                .HasForeignKey(d => d.FkTreatmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("treatment_staff_fk_treatment_id_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
