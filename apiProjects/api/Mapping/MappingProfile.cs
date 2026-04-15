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
            CreateMap<Medication, MedicationOutput>();
            CreateMap<MedicationStorage, MedicationStorageOutput>();
            CreateMap<RoomBooking, RoomBookingOutput>();
            CreateMap<Shift, ShiftOutput>();
            CreateMap<ShiftStaff, ShiftStaffOutput>();
            CreateMap<Treatment, TreatmentOutput>();
            CreateMap<TreatmentStaff, TreatmentStaffOutput>();
            CreateMap<Patient, PatientOutput>();
            CreateMap<Department, DepartmentOutput>();
            CreateMap<DepartmentStaff, DepartmentStaffOutput>();
            CreateMap<Building, BuildingOutput>();
            CreateMap<MedicationStorageMissing, MedicationStorageMissingOutput>();
            CreateMap<Prescription, PrescriptionOutput>();
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
