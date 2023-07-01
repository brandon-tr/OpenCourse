namespace OpenCourse.Data.DTOs.Response;

public class GetCurrentUserResponseDto
{
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Avatar { get; set; }
    public bool IsBanned { get; set; }
    public bool LoggedIn { get; set; }
    public int level { get; set; }
}
