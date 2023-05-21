using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace OpenCourse.Model;

public class User
{
    public User()
    {
        Deleted = false;
        Avatar = "https://ui-avatars.com/api/?name=John+Doe";
        
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

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

    [Required]
    [MinLength(2)]
    [MaxLength(120)]
    [DataType(DataType.EmailAddress)]
    public string Email { get; set; }

    [Required]
    [MinLength(3)]
    [MaxLength(100)]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    public ICollection<UserRole>? UserRoles { get; set; }
    public bool IsBanned { get; set; }
    public DateTime? TimeOut { get; set; }
    public DateTime? LastLogIn { get; set; }
    public string Avatar { get; set; }

    public IPAddress? LastLoginIp { get; set; }

    [DefaultValue(false)] public bool Deleted { get; set; }

    public DateTime? DateToDelete { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}