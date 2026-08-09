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
            CreateMap<FloorInputDto, Floor>().ValidateMemberList(MemberList.Source);
            CreateMap<Medication, MedicationOutputDto>();
            CreateMap<MedicationInputDto, Medication>().ValidateMemberList(MemberList.Source);
            CreateMap<MedicationStorage, MedicationStorageOutputDto>();
            CreateMap<MedicationStorageInputDto, MedicationStorage>().ValidateMemberList(MemberList.Source);
            CreateMap<MedicationStorageMissing, MedicationStorageMissingOutputDto>();
            CreateMap<MedicationStorageMissingInputDto, MedicationStorageMissing>().ValidateMemberList(MemberList.Source);
            CreateMap<RoomBooking, RoomBookingOutputDto>();
            CreateMap<RoomBookingInputDto, RoomBooking>().ValidateMemberList(MemberList.Source);
            CreateMap<Treatment, TreatmentOutputDto>();
            CreateMap<TreatmentInputDto, Treatment>().ValidateMemberList(MemberList.Source);
            CreateMap<TreatmentStaff, TreatmentStaffOutputDto>();
            CreateMap<TreatmentStaffInputDto, TreatmentStaff>().ValidateMemberList(MemberList.Source);
            CreateMap<Patient, PatientOutputDto>();
            CreateMap<Department, DepartmentOutputDto>();
            CreateMap<DepartmentInputDto, Department>().ValidateMemberList(MemberList.Source);
            CreateMap<DepartmentStaff, DepartmentStaffOutputDto>()
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.FkDepartment))
                .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.FkStaff));
            CreateMap<DepartmentStaffInputDto, DepartmentStaff>().ValidateMemberList(MemberList.Source);
            CreateMap<Building, BuildingOutputDto>();
            CreateMap<Prescription, PrescriptionOutputDto>();
            CreateMap<PrescriptionInputDto, Prescription>().ValidateMemberList(MemberList.Source);
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
