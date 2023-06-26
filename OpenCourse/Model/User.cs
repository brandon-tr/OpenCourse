using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Net;
using Microsoft.AspNetCore.Identity;

namespace OpenCourse.Model;

public class User : IdentityUser
{
    public User()
    {
        Deleted = false;
        Avatar = "https://ui-avatars.com/api/?name=John+Doe";
    }

    [Required]
    [MinLength(2)]
    [MaxLength(52)]
    [DataType(DataType.Text)]
    public string FirstName { get; set; }

    [Required]
    [MinLength(2)]
    [MaxLength(52)]
    [DataType(DataType.Text)]
    public string LastName { get; set; }

    public ICollection<UserRoles>? UserRoles { get; set; }
    public bool IsBanned { get; set; }
    public DateTime? TimeOut { get; set; }
    public DateTime? LastLogIn { get; set; }
    public string Avatar { get; set; }

    public IPAddress? LastLoginIp { get; set; }

    [DefaultValue(false)] public bool Deleted { get; set; }

    public DateTime? DateToDelete { get; set; }

    public TrashBin? TrashBin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
