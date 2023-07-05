namespace OpenCourse.Data;

public class CourseDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? Image { get; set; }
    public int? VideoCount { get; set; }

    public bool? Deleted { get; set; }
    public DateTime? DateToDelete { get; set; }
}
