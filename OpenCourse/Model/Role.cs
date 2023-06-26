using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace OpenCourse.Model;

public class Role : IdentityRole
{
    [Required] public int Level { get; set; }

    public ICollection<UserRoles>? UserRoles { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
