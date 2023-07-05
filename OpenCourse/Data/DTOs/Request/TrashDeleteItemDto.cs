using Microsoft.Build.Framework;

namespace OpenCourse.Data.DTOs.Request;

public class TrashDeleteItem
{
    [Required] public string Id { get; set; }

    [Required] public string Type { get; set; }
}
