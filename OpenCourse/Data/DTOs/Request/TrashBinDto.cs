using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using OpenCourse.Data.DTOs.Response;

namespace OpenCourse.Data.DTOs.Request;

public class TrashBinDto
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; }

    [Required]
    [MinLength(2)]
    [MaxLength(255)]
    [DataType(DataType.Text)]
    public string Name { get; set; }

    public string Type { get; set; }

    public ICollection<UserRoleResponseDto>? UserRoles { get; set; }
    public DateTime? DateToDelete { get; set; }
    public string Image { get; set; }
    public int? VideoCount { get; set; }
}
