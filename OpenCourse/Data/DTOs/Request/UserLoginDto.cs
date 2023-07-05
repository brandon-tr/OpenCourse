using System.ComponentModel.DataAnnotations;

namespace OpenCourse.Data.DTOs.Request;

public class UserLoginDto
{
    [Required]
    [EmailAddress]
    [MinLength(2)]
    [MaxLength(120)]
    public string Email { get; set; }

    [Required]
    [MinLength(3)]
    [MaxLength(100)]
    public string Password { get; set; }
}
