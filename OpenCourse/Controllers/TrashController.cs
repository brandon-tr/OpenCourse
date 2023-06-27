using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Response;

namespace OpenCourse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TrashController : ControllerBase
{
    private readonly OpenCourseContext _context;

    public TrashController(OpenCourseContext context)
    {
        _context = context;
    }

    [HttpGet("GetAllTrash")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<PagedTrashBinResponseDto>>> GetAll(
        [FromQuery] PagingParameters pagingParameters)
    {
        if (pagingParameters.PageNumber <= 0) throw new NullReferenceException("Page number must be greater than 0");
        if (pagingParameters.PageSize <= 0) throw new NullReferenceException("Page size must be greater than 0");


        var result = _context.TrashBin.AsQueryable();
        if (!string.IsNullOrEmpty(pagingParameters.Search))
            result = result.Where(u =>
                u.User.FirstName.Contains(pagingParameters.Search) ||
                u.User.LastName.Contains(pagingParameters.Search) ||
                u.User.Id.Equals(pagingParameters.Search) ||
                u.User.Email.Contains(pagingParameters.Search)
            );
        var count = result.Count();
        if (count <= 0) count = 1;
        result = result.Skip((pagingParameters.PageNumber - 1) * pagingParameters.PageSize)
            .Take(pagingParameters.PageSize);
        var users = await result.Include(u => u.User)
            .Select(u => new TrashBinUsersDto
            {
                Id = u.User.Id,
                FirstName = u.User.FirstName,
                LastName = u.User.LastName,
                Email = u.User.Email,
                IsBanned = u.User.IsBanned,
                DateToDelete = u.User.DateToDelete,
                Avatar = u.User.Avatar,
                UserRoles = u.User.UserRoles.Select(r => new UserRoleResponseDto
                {
                    Id = r.Role.Id,
                    Name = r.Role.Name,
                    Level = r.Role.Level
                }).ToList()
            })
            .ToListAsync();
        var pagedResponse = new PagedTrashBinResponseDto
        {
            Users = users,
            CurrentPage = pagingParameters.PageNumber,
            PageSize = pagingParameters.PageSize,
            TotalCount = count,
            TotalPages = (int)Math.Ceiling(count / (double)pagingParameters.PageSize)
        };
        return Ok(pagedResponse);
    }
}
