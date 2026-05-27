using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApi.Services
{
    public class PrescriptionService : IPrescriptionService
    {
        private DbSet<Prescription> prescriptions;
        private readonly HospitalContext _hospitalContext;
        IMapper _mapper;

        public PrescriptionService(HospitalContext dbContext, IMapper mapper)
        {
            _hospitalContext = dbContext;
            _mapper = mapper;
            prescriptions = dbContext.Prescriptions;
        }

        public async Task<IEnumerable<PrescriptionOutput>> GetAll()
        {
            var entities = await prescriptions.ToListAsync();
            return _mapper.Map<IEnumerable<PrescriptionOutput>>(entities);
        }

        public async Task<PrescriptionOutput> GetOne(int id)
        {
            var entity = await prescriptions.FirstOrDefaultAsync(p => p.Id == id);
            if (entity == null)
                return null;

            return _mapper.Map<PrescriptionOutput>(entity);
        }

        public async Task<bool> EditPrescription(int PrescriptionId, PrescriptionInput editedPrescriptionData)
        {
            var entity = await prescriptions.FirstOrDefaultAsync(p => p.Id == PrescriptionId);
            if (entity == null)
                return false;

            entity.FkMedicationId = editedPrescriptionData.FkMedicationId;
            entity.FkTreatmentId = editedPrescriptionData.FkTreatmentId;
            entity.FkPrescribedByStaffId = editedPrescriptionData.FkPrescribedByStaffId;
            entity.Doses = editedPrescriptionData.Doses;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePrescription(int id)
        {
            var entity = await prescriptions.FirstOrDefaultAsync(p => p.Id == id);
            if (entity == null)
                return false;

            prescriptions.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<int> CreatePrescription(PrescriptionInput newPrescription)
        {
            var entity = _mapper.Map<Prescription>(newPrescription);
            await prescriptions.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();
            return entity.Id;
        }
    }
}
