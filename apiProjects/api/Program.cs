using AutoMapper;
using Microsoft.Extensions.Logging;
using hospitalApi.Data;
using hospitalApi.Mapping;
using hospitalApi.Services;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


// Configure EF Core postgres
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<HospitalContext>(options => options.UseNpgsql(connectionString));


// mapping
// builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());;

// add services
builder.Services.AddScoped<ILocationService, LocationService>();

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


// Swagger

builder.Services.AddEndpointsApiExplorer();

// does not work , since more than one DTO with the same name exist
//builder.Services.AddSwaggerGen();

// all on one page, hate it
// builder.Services.AddSwaggerGen(options =>
// {
//     options.CustomSchemaIds(type => type.FullName);
// });

builder.Services.AddSwaggerGen(options =>
{
    // options.SwaggerDoc("mysql-v1", new Microsoft.OpenApi.Models.OpenApiInfo
    // {
    //     Title = "Hospital API - MySQL",
    //     Version = "mysql v1"
    // });

    // still needed to avoid DTO name collisions
    options.CustomSchemaIds(type => type.FullName);
});


var app = builder.Build();


// Swagger UI

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        // options.SwaggerEndpoint("/swagger/mysql-v1/swagger.json", "MySQL v1");
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");

    });
}

// add cors rules
app.UseCors("AllowFrontend"); 

// Routing + controllers

app.MapControllers();

app.Run();