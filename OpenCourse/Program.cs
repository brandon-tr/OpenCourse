using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
using OpenCourse.Middlewares;
using OpenCourse.Model;
using OpenCourse.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<OpenCourseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("OpenCourseContext") ??
                      throw new InvalidOperationException("Connection string 'OpenCourseContext' not found.")));
builder.WebHost.ConfigureKestrel((context, options) =>
{
    options.ListenAnyIP(5001, listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http1AndHttp2AndHttp3;
        listenOptions.UseHttps();
    });
});

// Add services to the container.
// Create Authentication
builder.Services.AddIdentity<User, Role>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 5;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredUniqueChars = 0;
    options.Lockout.AllowedForNewUsers = true;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromSeconds(30);
}).AddEntityFrameworkStores<OpenCourseContext>().AddDefaultTokenProviders();
builder.Services.ConfigureApplicationCookie(options =>
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
builder.Services.AddAuthentication().AddGoogle(googleOptions =>
{
    if (bool.Parse(builder.Configuration["Google"]) &&
        builder.Configuration["Authentication:Google:ClientId"] is not null &&
        builder.Configuration["Authentication:Google:ClientSecret"] is not null)
    {
        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    }
});
// builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//     .AddCookie(options =>
//     {
//         options.LoginPath = null;
//         options.LogoutPath = null;
//         options.Cookie.Name = "OpenCourseCookie";
//         options.SlidingExpiration = true;
//         options.ExpireTimeSpan = TimeSpan.FromHours(10);
//         options.Events = new CookieAuthenticationEvents
//         {
//             OnRedirectToLogin = context =>
//             {
//                 context.Response.StatusCode = StatusCodes.Status401Unauthorized;
//                 return Task.CompletedTask;
//             },
//             OnRedirectToAccessDenied = context =>
//             {
//                 context.Response.StatusCode = StatusCodes.Status403Forbidden;
//                 return Task.CompletedTask;
//             }
//         };
//     }).AddGoogle(googleOptions =>
//     {
// if (bool.Parse(builder.Configuration["Google"]) &&
//      builder.Configuration["Authentication:Google:ClientId"] is not null &&
//      builder.Configuration["Authentication:Google:ClientSecret"] is not null)
// {
//     googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
//     googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
// }
//     });
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddLogging();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AnonymousOnly", policy => { policy.Requirements.Add(new AnonymousOnlyRequirement()); });
});
builder.Services.AddSingleton<IAuthorizationHandler, AnonymousOnlyAuthorizationHandler>();
// Create Rate Limiter
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        return RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Request.Headers.UserAgent.ToString(),
            partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 180,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            });
    });
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
            await context.HttpContext.Response.WriteAsync(
                $"Too many requests. Please try again after {retryAfter.TotalMinutes} minute(s). " +
                $"Read more about our rate limits at https://example.org/docs/ratelimiting.", token);
        else
            await context.HttpContext.Response.WriteAsync(
                "Too many requests. Please try again later. " +
                "Read more about our rate limits at https://example.org/docs/ratelimiting.", token);
    };
});
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<WebSocketService>();

var app = builder.Build();
app.UseHsts();
app.UseHttpsRedirection();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseMiddleware<CustomExceptionHandlerMiddleware>();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpLogging();
app.MapControllers();
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};

app.UseWebSockets(webSocketOptions);

app.Run();
