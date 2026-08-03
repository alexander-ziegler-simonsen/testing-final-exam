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
        public async Task<IEnumerable<TreatmentOutputDto>> GetAll(TreatmentInputDto? filter = null, string? sortBy = null, string? sortDir = "asc")
        {
            IQueryable<Treatment> query = treatments;

            if (filter != null)
            {
                if (!string.IsNullOrWhiteSpace(filter.Description))
                    query = query.Where(t => t.Description != null && t.Description.ToLower().Contains(filter.Description.ToLower()));
                if (filter.FkPatientId != 0)
                    query = query.Where(t => t.FkPatientId == filter.FkPatientId);
            }

            bool desc = sortDir?.ToLower() == "desc";
            query = sortBy?.ToLower() switch
            {
                "description" => desc ? query.OrderByDescending(t => t.Description) : query.OrderBy(t => t.Description),
                "time" => desc ? query.OrderByDescending(t => t.Time) : query.OrderBy(t => t.Time),
                "fkpatientid" => desc ? query.OrderByDescending(t => t.FkPatientId) : query.OrderBy(t => t.FkPatientId),
                _ => desc ? query.OrderByDescending(t => t.Id) : query.OrderBy(t => t.Id),
            };

            var entities = await query.ToListAsync();
            return _mapper.Map<IEnumerable<TreatmentOutputDto>>(entities);
        }

        public async Task<TreatmentOutputDto> GetOne(int id)
        {
            var entity = await treatments.FirstOrDefaultAsync(t => t.Id == id);
            if (entity == null)
                return null;

            return _mapper.Map<TreatmentOutputDto>(entity);
        }

        public async Task<bool> EditTreatment(int TreatmentId, TreatmentInputDto editedTreatmentData)
        {
            var entity = await treatments.FirstOrDefaultAsync(t => t.Id == TreatmentId);
            if (entity == null)
                return false;

            entity.FkPatientId = editedTreatmentData.FkPatientId;
            entity.Description = editedTreatmentData.Description;
            entity.Time = editedTreatmentData.Time;

            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTreatment(int id)
        {
            var entity = await treatments.FirstOrDefaultAsync(t => t.Id == id);
            if (entity == null)
                return false;

            treatments.Remove(entity);
            await _hospitalContext.SaveChangesAsync();
            return true;
        }

        public async Task<int> CreateTreatment(TreatmentInputDto newTreatment, int? staffId = null)
        {
            var entity = _mapper.Map<Treatment>(newTreatment);

            if (staffId is null)
            {
                await treatments.AddAsync(entity);
                await _hospitalContext.SaveChangesAsync();
                return entity.Id;
            }

            // Attributing the treatment to the creating staff member is part of
            // creating it - both rows must persist together or not at all.
            await using var transaction = await _hospitalContext.Database.BeginTransactionAsync();

            await treatments.AddAsync(entity);
            await _hospitalContext.SaveChangesAsync();

            await _hospitalContext.TreatmentStaffs.AddAsync(new TreatmentStaff
            {
                FkTreatmentId = entity.Id,
                FkStaffId = staffId.Value,
            });
            await _hospitalContext.SaveChangesAsync();

            await transaction.CommitAsync();
            return entity.Id;
        }
    }
}
