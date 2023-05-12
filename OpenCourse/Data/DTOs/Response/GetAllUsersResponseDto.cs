namespace OpenCourse.Data.DTOs.Response;

public class GetAllUsersResponseDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Avatar { get; set; }
    public bool IsBanned { get; set; }

    public List<UserRoleResponseDto> UserRoles { get; set; } = null!;
}