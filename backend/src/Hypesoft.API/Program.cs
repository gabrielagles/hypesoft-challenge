using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Queries;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Infrastructure.Configuration;
using Hypesoft.API.Middlewares;
using Microsoft.OpenApi.Models;
using AspNetCoreRateLimit;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hypesoft API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining<CreateProductCommand>();
    cfg.RegisterServicesFromAssemblyContaining<GetProductsQuery>();
});

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(options =>
{
    options.EnableEndpointRateLimiting = true;
    options.StackBlockedRequests = false;
    options.HttpStatusCode = 429;
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "*:/api/*",
            Period = "1m",
            Limit = 100,
        },
        new RateLimitRule
        {
            Endpoint = "POST:/api/products",
            Period = "1m",
            Limit = 30,
        },
        new RateLimitRule
        {
            Endpoint = "POST:/api/categories",
            Period = "1m",
            Limit = 30,
        },
        new RateLimitRule
        {
            Endpoint = "*",
            Period = "1s",
            Limit = 30,
        },
    };
});
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddInMemoryRateLimiting();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");
app.UseIpRateLimiting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
