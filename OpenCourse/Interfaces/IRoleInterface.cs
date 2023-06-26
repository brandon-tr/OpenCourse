using Microsoft.AspNetCore.Mvc;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Model;

namespace OpenCourse.Interfaces;

public interface IRoleInterface
{
    Task<ActionResult<IEnumerable<Role>>> GetRole();
    Task<ActionResult<Role>> GetRole(string id);
    Task<bool> PutRole(string id, Role role);
    Task<ActionResult<Role>> PostRole(Role role);
    Task<bool> DeleteRole(string id);
    Task<List<UserRoleResponseDto>> GetAllRolesAsync();
}
