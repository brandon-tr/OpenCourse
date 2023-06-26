using Microsoft.AspNetCore.Identity;

namespace OpenCourse.Model;

public class UserRoles : IdentityUserRole<string>
{
    public virtual User User { get; set; } = default!;
    public virtual Role Role { get; set; } = default!;
}
