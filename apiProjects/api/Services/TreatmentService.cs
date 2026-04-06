using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class TreatmentService : ITreatmentService
    {
        private DbSet<Treatment> treatments;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;
        public TreatmentService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            treatments = dbContext.Treatments;
        }
        public async Task<IEnumerable<TreatmentOutput>> GetAll()
        {
            return null;
        }
        public async Task<TreatmentOutput> GetOne(int id)
        {
            return null;
        }
        public async Task<bool> EditTreatment(int TreatmentId, TreatmentInput editedTreatmentData)
        {
            return false;
        }
        public async Task<bool> DeleteTreatment(int id)
        {
            return false;
        }
        public async Task<bool> CreateTreatment(TreatmentInput newTreatment)
        {
            return false;
        }
    }
}
