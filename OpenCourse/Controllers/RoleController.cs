using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenCourse.Data;
using OpenCourse.Model;
using OpenCourse.Services;

namespace OpenCourse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly OpenCourseContext _context;
    private readonly RoleService _roleService;

    public RoleController(OpenCourseContext context, RoleService roleService)
    {
        _context = context;
        _roleService = roleService;
    }

    // GET: api/Role
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Role>>> GetRole()
    {
        return await _roleService.GetRole();
    }

    // GET: api/Role/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Role>> GetRole(int id)
    {
        return await _roleService.GetRole(id);
    }

    // PUT: api/Role/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PutRole(int id, Role role)
    {
        if (await _roleService.PutRole(id, role))
        {
            var response = new
            {
                status = 200,
                message = "Role updated successfully"
            };
            return Ok(response);
        }

        throw new Exception("Role update failed");
    }

    // POST: api/Role
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Role>> PostRole(Role role)
    {
        await _roleService.PostRole(role);
        var response = new
        {
            status = 200,
            message = "Role created successfully"
        };
        return Created("", response);
    }

    // DELETE: api/Role/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        await _roleService.DeleteRole(id);
        var response = new
        {
            status = 200,
            message = "Role deleted successfully"
        };
        return Ok(response);
    }

    [HttpGet("GetAllRoles")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<Role>>> GetAllRoles()
    {
        var roles = await _roleService.GetAllRolesAsync().ConfigureAwait(false);
        return Ok(roles);
    }

    private bool RoleExists(int id)
    {
        return (_context.Role?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}