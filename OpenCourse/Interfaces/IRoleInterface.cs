using Microsoft.AspNetCore.Mvc;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Model;

namespace OpenCourse.Interfaces;

public interface IRoleInterface
{
    Task<ActionResult<IEnumerable<Role>>> GetRole();
    Task<ActionResult<Role>> GetRole(int id);
    Task<bool> PutRole(int id, Role role);
    Task<ActionResult<Role>> PostRole(Role role);
    Task<bool> DeleteRole(int id);
    Task<List<UserRoleResponseDto>> GetAllRolesAsync();
}