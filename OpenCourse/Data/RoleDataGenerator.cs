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
                Id = 1,
                Name = "Admin",
                Level = 3
            },
            new()
            {
                Id = 2,
                Name = "Moderator",
                Level = 2
            },
            new()
            {
                Id = 3,
                Name = "Student",
                Level = 1
            }
        };
        return roles;
    }
}