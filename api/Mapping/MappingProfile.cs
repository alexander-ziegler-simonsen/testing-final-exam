using AutoMapper;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;

namespace hospitalApi.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Room, RoomOutputDto>();
            CreateMap<Floor, FloorOutputDto>();
            CreateMap<FloorInputDto, Floor>();
            CreateMap<Medication, MedicationOutputDto>();
            CreateMap<MedicationInputDto, Medication>();
            CreateMap<MedicationStorage, MedicationStorageOutputDto>();
            CreateMap<MedicationStorageInputDto, MedicationStorage>();
            CreateMap<MedicationStorageMissing, MedicationStorageMissingOutputDto>();
            CreateMap<MedicationStorageMissingInputDto, MedicationStorageMissing>();
            CreateMap<RoomBooking, RoomBookingOutputDto>();
            CreateMap<RoomBookingInputDto, RoomBooking>();
            CreateMap<Shift, ShiftOutputDto>();
            CreateMap<ShiftInputDto, Shift>();
            CreateMap<ShiftStaff, ShiftStaffOutputDto>();
            CreateMap<Treatment, TreatmentOutputDto>();
            CreateMap<TreatmentInputDto, Treatment>();
            CreateMap<TreatmentStaff, TreatmentStaffOutputDto>();
            CreateMap<TreatmentStaffInputDto, TreatmentStaff>();
            CreateMap<Patient, PatientOutputDto>();
            CreateMap<Department, DepartmentOutputDto>();
            CreateMap<DepartmentInputDto, Department>();
            CreateMap<DepartmentStaff, DepartmentStaffOutputDto>()
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.FkDepartment))
                .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.FkStaff));
            CreateMap<Building, BuildingOutputDto>();
            CreateMap<Prescription, PrescriptionOutputDto>();
            CreateMap<PrescriptionInputDto, Prescription>();
            CreateMap<Staff, StaffOutputDto>();

            // custom mappings
            CreateMap<Building, LocationOutputDto>()
                .ForMember(dest => dest.Building, opt => opt.MapFrom(src => src))
                .ForMember(dest => dest.FloorsWithRooms, opt => opt.MapFrom(src => src.Floors));

            CreateMap<Floor, FloorRoomsOutputDto>()
                .ForMember(dest => dest.Floor, opt => opt.MapFrom(src => src))
                .ForMember(dest => dest.Rooms, opt => opt.MapFrom(src => src.Rooms));
        }
    }


}
