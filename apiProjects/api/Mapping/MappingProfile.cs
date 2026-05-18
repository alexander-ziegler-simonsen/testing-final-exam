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
            CreateMap<Room, RoomOutput>();
            CreateMap<Floor, FloorOutput>();
            CreateMap<FloorInput, Floor>();
            CreateMap<Medication, MedicationOutput>();
            CreateMap<MedicationInput, Medication>();
            CreateMap<MedicationStorage, MedicationStorageOutput>();
            CreateMap<MedicationStorageInput, MedicationStorage>();
            CreateMap<MedicationStorageMissing, MedicationStorageMissingOutput>();
            CreateMap<MedicationStorageMissingInput, MedicationStorageMissing>();
            CreateMap<RoomBooking, RoomBookingOutput>();
            CreateMap<RoomBookingInput, RoomBooking>();
            CreateMap<Shift, ShiftOutput>();
            CreateMap<ShiftStaff, ShiftStaffOutput>();
            CreateMap<Treatment, TreatmentOutput>();
            CreateMap<TreatmentInput, Treatment>();
            CreateMap<TreatmentStaff, TreatmentStaffOutput>();
            CreateMap<TreatmentStaffInput, TreatmentStaff>();
            CreateMap<Patient, PatientOutput>();
            CreateMap<Department, DepartmentOutput>();
            CreateMap<DepartmentInput, Department>();
            CreateMap<DepartmentStaff, DepartmentStaffOutput>();
            CreateMap<Building, BuildingOutput>();
            CreateMap<Prescription, PrescriptionOutput>();
            CreateMap<PrescriptionInput, Prescription>();
            CreateMap<Staff, StaffOutput>();

            CreateMap<User, LoginOutput>()
                .ForMember(dest => dest.StaffId, opt => opt.MapFrom(src => src.FkStaff.Id))
                .ForMember(dest => dest.Firstname, opt => opt.MapFrom(src => src.FkStaff.Firstname))
                .ForMember(dest => dest.Lastname, opt => opt.MapFrom(src => src.FkStaff.Lastname))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.FkStaff.FkRole.Name))
                .ForMember(dest => dest.Token, opt => opt.Ignore());

            // custom mappings
            CreateMap<Building, LocationOutput>()
                .ForMember(dest => dest.Building, opt => opt.MapFrom(src => src))
                .ForMember(dest => dest.FloorsWithRooms, opt => opt.MapFrom(src => src.Floors));

            CreateMap<Floor, FloorRoomsOutput>()
                .ForMember(dest => dest.Floor, opt => opt.MapFrom(src => src))          
                .ForMember(dest => dest.Rooms, opt => opt.MapFrom(src => src.Rooms));   
        }
    }


}
