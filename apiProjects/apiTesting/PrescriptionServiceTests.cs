using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Models;
using hospitalApi.Services;
using hospitalApiTesting.Helpers;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace hospitalApiTesting;

[TestFixture]
public class PrescriptionServiceTests
{
    private Mock<HospitalContext> _contextMock = null!;
    private Mock<IMapper> _mapperMock = null!;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _contextMock = new Mock<HospitalContext>(options);
        _contextMock
            .Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        _mapperMock = new Mock<IMapper>();
        _mapperMock
            .Setup(m => m.Map<IEnumerable<PrescriptionOutput>>(It.IsAny<object>()))
            .Returns((object src) =>
                ((IEnumerable<Prescription>)src).Select(p => new PrescriptionOutput
                {
                    Id = p.Id,
                    FkMedicationId = p.FkMedicationId,
                    FkTreatmentId = p.FkTreatmentId,
                    FkPrescribedByStaffId = p.FkPrescribedByStaffId,
                    Doses = p.Doses,
                }));

        _mapperMock
            .Setup(m => m.Map<PrescriptionOutput>(It.IsAny<Prescription>()))
            .Returns((Prescription p) => new PrescriptionOutput
            {
                Id = p.Id,
                FkMedicationId = p.FkMedicationId,
                FkTreatmentId = p.FkTreatmentId,
                FkPrescribedByStaffId = p.FkPrescribedByStaffId,
                Doses = p.Doses,
            });

        _mapperMock
            .Setup(m => m.Map<Prescription>(It.IsAny<PrescriptionInput>()))
            .Returns((PrescriptionInput i) => new Prescription
            {
                FkMedicationId = i.FkMedicationId,
                FkTreatmentId = i.FkTreatmentId,
                FkPrescribedByStaffId = i.FkPrescribedByStaffId,
                Doses = i.Doses,
            });
    }

    private List<Prescription> ThreePrescriptions() =>
    [
        new Prescription { Id = 1, FkMedicationId = 10, FkTreatmentId = 100, FkPrescribedByStaffId = 1, Doses = 2.0 },
        new Prescription { Id = 2, FkMedicationId = 20, FkTreatmentId = 100, FkPrescribedByStaffId = 2, Doses = 1.5 },
        new Prescription { Id = 3, FkMedicationId = 10, FkTreatmentId = 200, FkPrescribedByStaffId = 1, Doses = 3.0 },
    ];

    private PrescriptionService BuildService(List<Prescription> prescriptions)
    {
        var dbSetMock = MockDbSetHelper.Create(prescriptions);
        _contextMock.Setup(c => c.Prescriptions).Returns(dbSetMock.Object);
        return new PrescriptionService(_contextMock.Object, _mapperMock.Object);
    }

    // GetAll

    [Test]
    public async Task GetAll_ReturnsAllPrescriptions()
    {
        var service = BuildService(ThreePrescriptions());

        var result = (await service.GetAll()).ToList();

        Assert.That(result, Has.Count.EqualTo(3));
    }

    // GetOne

    [Test]
    public async Task GetOne_WithValidId_ReturnsCorrectPrescription()
    {
        var service = BuildService(ThreePrescriptions());

        var result = await service.GetOne(2);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.FkMedicationId, Is.EqualTo(20));
        Assert.That(result.Doses, Is.EqualTo(1.5));
    }

    [Test]
    public async Task GetOne_WithInvalidId_ReturnsNull()
    {
        var service = BuildService(ThreePrescriptions());

        var result = await service.GetOne(999);

        Assert.That(result, Is.Null);
    }

    // EditPrescription

    [Test]
    public async Task EditPrescription_WithValidId_UpdatesAllFieldsAndReturnsTrue()
    {
        var prescription = new Prescription
        {
            Id = 1,
            FkMedicationId = 10,
            FkTreatmentId = 100,
            FkPrescribedByStaffId = 1,
            Doses = 2.0,
        };
        var service = BuildService([prescription]);

        var input = new PrescriptionInput
        {
            FkMedicationId = 99,
            FkTreatmentId = 999,
            FkPrescribedByStaffId = 5,
            Doses = 4.0,
        };
        var result = await service.EditPrescription(1, input);

        Assert.That(result, Is.True);
        Assert.That(prescription.FkMedicationId, Is.EqualTo(99));
        Assert.That(prescription.FkTreatmentId, Is.EqualTo(999));
        Assert.That(prescription.FkPrescribedByStaffId, Is.EqualTo(5));
        Assert.That(prescription.Doses, Is.EqualTo(4.0));
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task EditPrescription_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.EditPrescription(999, new PrescriptionInput());

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // DeletePrescription

    [Test]
    public async Task DeletePrescription_WithValidId_ReturnsTrueAndRemoves()
    {
        var prescriptions = ThreePrescriptions();
        var dbSetMock = MockDbSetHelper.Create(prescriptions);
        _contextMock.Setup(c => c.Prescriptions).Returns(dbSetMock.Object);
        var service = new PrescriptionService(_contextMock.Object, _mapperMock.Object);

        var result = await service.DeletePrescription(2);

        Assert.That(result, Is.True);
        dbSetMock.Verify(d => d.Remove(It.Is<Prescription>(p => p.Id == 2)), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeletePrescription_WithInvalidId_ReturnsFalseWithoutSaving()
    {
        var service = BuildService([]);

        var result = await service.DeletePrescription(999);

        Assert.That(result, Is.False);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    // CreatePrescription

    [Test]
    public async Task CreatePrescription_WithValidInput_CallsAddAndSave()
    {
        var prescriptions = new List<Prescription>();
        var dbSetMock = MockDbSetHelper.Create(prescriptions);
        _contextMock.Setup(c => c.Prescriptions).Returns(dbSetMock.Object);
        var service = new PrescriptionService(_contextMock.Object, _mapperMock.Object);

        var result = await service.CreatePrescription(new PrescriptionInput
        {
            FkMedicationId = 5,
            FkTreatmentId = 50,
            FkPrescribedByStaffId = 1,
            Doses = 1.0,
        });

        Assert.That(result, Is.GreaterThanOrEqualTo(0));
        dbSetMock.Verify(d => d.AddAsync(It.IsAny<Prescription>(), It.IsAny<CancellationToken>()), Times.Once);
        _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
