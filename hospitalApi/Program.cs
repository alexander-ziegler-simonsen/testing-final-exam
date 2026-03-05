// using hospitalApi.Data.Postgres;
using hospitalApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


// Configure EF Core postgres
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<HospitalContext>(options => options.UseNpgsql(connectionString));


// mapping
// builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());;


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
        options.SwaggerEndpoint("/swagger/swagger.json", "v1");

    });
}


// Routing + controllers

app.MapControllers();

app.Run();