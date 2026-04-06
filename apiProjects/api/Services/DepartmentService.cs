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

        public async Task<IEnumerable<DepartmentOutput>> GetAll()
        {
            return null;
        }
        public async Task<DepartmentOutput> GetOne(int id)
        {
            return null;
        }
        public async Task<bool> EditDepartment(int DepartmentId, DepartmentInput editedDepartmentData)
        {
            return false;
        }
        public async Task<bool> DeleteDepartment(int id)
        {
            return false;
        }
        public async Task<bool> CreateDepartment(DepartmentInput newDepartment)
        {
            return false;
        }
    }
}
