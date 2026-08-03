using System.Text;
using AutoMapper;
using Microsoft.Extensions.Logging;
using hospitalApi.Data;
using hospitalApi.Mapping;
using hospitalApi.Services;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Mvc.Controllers;
// using Scalar.AspNetCore;

// fix added to prevent problems with DateTime values
// Allow writing DateTime(Kind=UTC) to PostgreSQL 'timestamp without time zone' columns
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);


// Configure EF Core postgres
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<HospitalContext>(options => options.UseNpgsql(connectionString));


// mapping
// builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());;

// add services
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IMedicinService, MedicinService>();
builder.Services.AddScoped<IShiftService, ShiftService>();
builder.Services.AddScoped<IStaffService, StaffService>();
builder.Services.AddScoped<IStorageService, StorageService>();
builder.Services.AddScoped<IMissingStorageService, MissingStorageService>();

builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IDepartmentStaffService, DepartmentStaffService>();
builder.Services.AddScoped<IRoomBookingService, RoomBookingService>();
builder.Services.AddScoped<ITreatmentService, TreatmentService>();
builder.Services.AddScoped<ITreatmentStaffService, TreatmentStaffService>();
builder.Services.AddScoped<IPrescriptionService, PrescriptionService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

// add automapper
builder.Services.AddSingleton<IMapper>(sp =>
{
    var loggerFactory = sp.GetRequiredService<ILoggerFactory>();

    var config = new MapperConfiguration(cfg =>
    {
        cfg.AddProfile<MappingProfile>();
    }, loggerFactory);

    return config.CreateMapper();
});


// external api
builder.Services.AddHttpClient<IExternalApiService, ExternalApiService>(client =>
{
    client.BaseAddress = new Uri("http://api.medicinpriser.dk/v1/");
});

// JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

// cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // TODO - this needs to be a appsettings value, since it can/will be running in a VM
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add controllers
builder.Services.AddControllers();



builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApi(options =>
{
    options.CreateSchemaReferenceId = (type) =>
    {
        var id = OpenApiOptions.CreateDefaultSchemaReferenceId(type);
        return id is null ? null : type.Type.FullName!.Replace("+", ".", StringComparison.Ordinal);
    };

    options.AddOperationTransformer((operation, context, cancellationToken) =>
    {
        if (context.Description.ActionDescriptor is ControllerActionDescriptor action)
        {
            operation.OperationId = $"{action.ControllerName}_{action.ActionName}";
        }
        return Task.CompletedTask;
    });
    // .NET's default schema generation marks int/number types as also accepting
    // fix that makes it so that it shows up as a int/null in the OpenAPI schema instead of string/number/null
    // https://svrooij.io/2025/12/19/openapi-dotnet-10-number-quirk/ 
    options.AddSchemaTransformer((schema, context, cancellationToken) =>
    {
        if (schema.Type is { } type && type.HasFlag(Microsoft.OpenApi.JsonSchemaType.String) &&
            (type.HasFlag(Microsoft.OpenApi.JsonSchemaType.Integer) || type.HasFlag(Microsoft.OpenApi.JsonSchemaType.Number)))
        {
            schema.Type = type & ~Microsoft.OpenApi.JsonSchemaType.String;
            schema.Pattern = null;
        }
        return Task.CompletedTask;
    });
});

var app = builder.Build();


// Open API

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // now serves /openapi/v1.json instead of /swagger/v1/swagger.json
    // app.MapScalarApiReference(); // UI page
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1"); 
    });
}

// add cors rules
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Routing + controllers

app.MapControllers();

app.Run();