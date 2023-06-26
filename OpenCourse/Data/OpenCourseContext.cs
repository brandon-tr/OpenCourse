using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Model;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IWebHostEnvironment;

namespace OpenCourse.Data;

public class OpenCourseContext : IdentityDbContext
{
    private readonly IWebHostEnvironment _env;

    public OpenCourseContext(DbContextOptions<OpenCourseContext> options, IHostingEnvironment env)
        : base(options)
    {
        _env = env;
    }

    public DbSet<User> User { get; set; } = default!;

    // public DbSet<UserRoles> UserRoles { get; set; } = default!;
    public DbSet<Role> Role { get; set; } = default!;
    public DbSet<SiteSettings> SiteSetting { get; set; } = default!;
    public DbSet<TrashBin> TrashBin { get; set; } = default!;
    public DbSet<Video> Video { get; set; } = default!;
    public DbSet<Course> Course { get; set; } = default!;
    public DbSet<ConnectedClients> ConnectedClients { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>()
            .HasOne(u => u.TrashBin)
            .WithOne(t => t.User)
            .HasForeignKey<TrashBin>(t => t.UserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<ConnectedClients>()
            .HasIndex(u => u.UserId)
            .IsUnique();

        modelBuilder.Entity<UserRoles>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        modelBuilder.Entity<UserRoles>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);


        RoleDataGenerator roleDataGenerator = new(modelBuilder);
        var roles = roleDataGenerator.GenerateDefaultRoles();
        modelBuilder.Entity<Role>().HasData(roles);
        var siteSettings = new SiteSettings
        {
            Id = 1
        };
        modelBuilder.Entity<SiteSettings>().HasData(siteSettings);

        /* Only seed User table and UserRole table in Development  */
        if (_env.IsDevelopment())
        {
            var userDataGenerator = new UserDataGenerator();
            var users = userDataGenerator.GenerateUsers();

            foreach (var user in users)
            {
                var random = new Random();
                var randomRole = random.Next(0, roles.Count);
                modelBuilder.Entity<UserRoles>().HasData(new UserRoles
                {
                    UserId = user.Id,
                    RoleId = roles[randomRole].Id
                });
            }

            // var userRole = new List<UserRole>();
            // foreach (var user in users)
            // {
            //     var random = new Random();
            //     var randomRole = random.Next(0, roles.Count);
            //
            //     userRole.Add(new UserRole
            //     {
            //         Id = user.Id,
            //         UserId = user.Id,
            //         RoleId = roles[randomRole].Id
            //     });
            // }

            modelBuilder.Entity<User>().HasData(users);
            // modelBuilder.Entity<UserRole>().HasData(userRole);
        }
    }
}
