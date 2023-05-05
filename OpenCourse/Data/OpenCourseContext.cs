using Microsoft.EntityFrameworkCore;
using OpenCourse.Model;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IWebHostEnvironment;

namespace OpenCourse.Data;

public class OpenCourseContext : DbContext
{
    private readonly IWebHostEnvironment _env;

    public OpenCourseContext(DbContextOptions<OpenCourseContext> options, IHostingEnvironment env)
        : base(options)
    {
        _env = env;
    }

    public DbSet<User> User { get; set; } = default!;
    public DbSet<UserRole> UserRoles { get; set; } = default!;
    public DbSet<Role> Role { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        RoleDataGenerator roleDataGenerator = new(modelBuilder);
        var roles = roleDataGenerator.GenerateDefaultRoles();
        modelBuilder.Entity<Role>().HasData(roles);

        /* Only seed User table and UserRole table in Development  */
        if (_env.IsDevelopment())
        {
            var userDataGenerator = new UserDataGenerator();
            var users = userDataGenerator.GenerateUsers();

            var userRole = new List<UserRole>();
            foreach (var user in users)
            {
                var random = new Random();
                var randomRole = random.Next(0, roles.Count);

                userRole.Add(new UserRole
                {
                    Id = user.Id,
                    UserId = user.Id,
                    RoleId = roles[randomRole].Id
                });
            }

            modelBuilder.Entity<User>().HasData(users);
            modelBuilder.Entity<UserRole>().HasData(userRole);
        }
    }
}