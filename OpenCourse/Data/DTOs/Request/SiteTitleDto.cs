using System.ComponentModel.DataAnnotations;

namespace OpenCourse.Data.DTOs.Request;

public class SiteTitleDto
{
    [Required] [MaxLength(50)] public string SiteName { get; set; }
}
