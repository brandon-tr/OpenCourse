using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenCourse.Model;

public class Course
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 5,
        ErrorMessage = "Title must be at minimum 5 characters longer and cannot be greater than 100 characters")]
    public string Title { get; set; }

    [Required]
    [StringLength(500, MinimumLength = 10,
        ErrorMessage = "Description cannot be longer than 500 characters. Minimum length is 10 characters.")]
    public string Description { get; set; }

    public ICollection<Video> Videos { get; set; }


    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
