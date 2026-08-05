using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class DepartmentStaffService : IDepartmentStaffService
    {
        private DbSet<DepartmentStaff> departmentStaffs;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;

        public DepartmentStaffService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            departmentStaffs = dbContext.DepartmentStaffs;
        }

        public async Task<IEnumerable<DepartmentStaffOutputDto>> GetAll()
        {
            var entities = await departmentStaffs
                .Include(ds => ds.FkDepartment)
                .Include(ds => ds.FkStaff)
                .ToListAsync();

            return _mapper.Map<IEnumerable<DepartmentStaffOutputDto>>(entities);
        }

        public async Task<DepartmentStaffOutputDto?> GetOne(int id)
        {
            var entity = await departmentStaffs
                .Include(ds => ds.FkDepartment)
                .Include(ds => ds.FkStaff)
                .FirstOrDefaultAsync(ds => ds.Id == id);

            if (entity == null)
                return null;

            return _mapper.Map<DepartmentStaffOutputDto>(entity);
        }

        public async Task<int> CreateDepartmentStaff(DepartmentStaffInputDto input)
        {
            var entity = _mapper.Map<DepartmentStaff>(input);
            await departmentStaffs.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> EditDepartmentStaff(int id, DepartmentStaffInputDto input)
        {
            var entity = await departmentStaffs.FirstOrDefaultAsync(ds => ds.Id == id);
            if (entity == null)
                return false;

            entity.FkDepartmentId = input.FkDepartmentId;
            entity.FkStaffId = input.FkStaffId;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDepartmentStaff(int id)
        {
            var entity = await departmentStaffs.FirstOrDefaultAsync(ds => ds.Id == id);
            if (entity == null)
                return false;

            departmentStaffs.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }
    }
}
