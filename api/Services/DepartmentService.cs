using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class DepartmentService : IDepartmentService
    {
        private DbSet<Department> departments;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;
        public DepartmentService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            departments = dbContext.Departments;
        }

        public async Task<IEnumerable<DepartmentOutputDto>> GetAll()
        {
            var entities = await departments.OrderBy(d => d.Id).ToListAsync();
            return _mapper.Map<IEnumerable<DepartmentOutputDto>>(entities);
        }

        public async Task<DepartmentOutputDto> GetOne(int id)
        {
            var entity = await departments.FirstOrDefaultAsync(d => d.Id == id);
            if (entity == null)
                return null;

            return _mapper.Map<DepartmentOutputDto>(entity);
        }

        public async Task<bool> EditDepartment(int DepartmentId, DepartmentInputDto editedDepartmentData)
        {
            var entity = await departments.FirstOrDefaultAsync(d => d.Id == DepartmentId);
            if (entity == null)
                return false;

            entity.Name = editedDepartmentData.Name;
            entity.Type = editedDepartmentData.Type;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDepartment(int id)
        {
            var entity = await departments.FirstOrDefaultAsync(d => d.Id == id);
            if (entity == null)
                return false;

            departments.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<int> CreateDepartment(DepartmentInputDto newDepartment)
        {
            var entity = _mapper.Map<Department>(newDepartment);
            await departments.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }
    }
}
