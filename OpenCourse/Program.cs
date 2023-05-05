using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
using OpenCourse.Middlewares;
using OpenCourse.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<OpenCourseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("OpenCourseContext") ??
                      throw new InvalidOperationException("Connection string 'OpenCourseContext' not found.")));


// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddLogging();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = null;
        options.LogoutPath = null;
        options.Cookie.Name = "OpenCourseCookie";
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromHours(10);
        options.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            },
            OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddScoped<UserService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    Console.WriteLine("Here");
    app.UseHsts();
}

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpLogging();
app.UseMiddleware<CustomExceptionHandlerMiddleware>();
app.MapControllers();


app.Run();
