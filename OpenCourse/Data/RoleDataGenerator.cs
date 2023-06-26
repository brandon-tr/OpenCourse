using Microsoft.EntityFrameworkCore;
using OpenCourse.Model;

namespace OpenCourse.Data;

public class RoleDataGenerator
{
    private readonly ModelBuilder _modelBuilder;

    public RoleDataGenerator(ModelBuilder modelBuilder)
    {
        _modelBuilder = modelBuilder ?? throw new ArgumentNullException(nameof(modelBuilder));
    }

    public List<Role> GenerateDefaultRoles()
    {
        // Create list of roles from below do not use modelBuilder
        var roles = new List<Role>
        {
            new()
            {
                Id = new Guid("48952354-C45E-4FFC-8E9D-0A4DB66A0722").ToString(),
                Name = "Admin",
                NormalizedName = "ADMIN",
                Level = 3
            },
            new()
            {
                Id = new Guid("48952354-C45E-4FFC-8E9D-0A4DB66A0723").ToString(),
                Name = "Moderator",
                NormalizedName = "MODERATOR",
                Level = 2
            },
            new()
            {
                Id = new Guid("48952354-C45E-4FFC-8E9D-0A4DB66A0724").ToString(),
                Name = "Student",
                NormalizedName = "STUDENT",
                Level = 1
            }
        };
        return roles;
    }
}
