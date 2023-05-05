using System.Net;

namespace OpenCourse.Data.DTOs.Response;

public class GetCurrentUserResponseDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Avatar { get; set; }
    public bool IsBanned { get; set; }
    public DateTime? LastLogin { get; set; }
    public IPAddress? LastLoginIp { get; set; }

    public List<UserRoleResponseDto> UserRoles { get; set; } = null!;
}