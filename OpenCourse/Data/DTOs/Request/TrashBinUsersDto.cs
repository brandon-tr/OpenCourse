using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenCourse.Data.DTOs.Response;

public class TrashBinUsersDto
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; }

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

    public ICollection<UserRoleResponseDto>? UserRoles { get; set; }
    public DateTime? DateToDelete { get; set; }
    public bool IsBanned { get; set; }
    public string Avatar { get; set; }
}
