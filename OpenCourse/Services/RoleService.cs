using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Exceptions;
using OpenCourse.Interfaces;
using OpenCourse.Model;

namespace OpenCourse.Services;

public class RoleService : IRoleInterface
{
    private readonly IConfiguration _configuration;
    private readonly OpenCourseContext _context;

    public RoleService(OpenCourseContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<ActionResult<IEnumerable<Role>>> GetRole()
    {
        if (_context.Role == null) throw new RoleNotFoundException();
        return await _context.Role.ToListAsync();
    }

    public async Task<ActionResult<Role>> GetRole(int id)
    {
        if (_context.Role == null) throw new RoleNotFoundException();
        var role = await _context.Role.FindAsync(id);

        if (role == null) throw new RoleNotFoundException();

        return role;
    }

    public async Task<bool> PutRole(int id, Role role)
    {
        if (id != role.Id) throw new BadRolePutException(role.Name);

        _context.Entry(role).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConcurrencyException();
        }
    }

    public async Task<ActionResult<Role>> PostRole(Role role)
    {
        if (_context.Role == null) throw new DatabaseFailedConnectionException();
        _context.Role.Add(role);
        await _context.SaveChangesAsync();

        return role;
    }

    public async Task<bool> DeleteRole(int id)
    {
        if (_context.Role == null) throw new RoleNotFoundException();
        var role = await _context.Role.FindAsync(id);
        if (role == null) throw new RoleNotFoundException();

        _context.Role.Remove(role);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<UserRoleResponseDto>> GetAllRolesAsync()
    {
        var roles = await _context.Role.Select(r => new UserRoleResponseDto
        {
            Id = r.Id,
            Name = r.Name,
            Level = r.Level
        }).ToListAsync().ConfigureAwait(false);
        return roles;
    }
}