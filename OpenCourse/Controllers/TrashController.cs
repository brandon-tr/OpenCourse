using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Request;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Exceptions;
using OpenCourse.Services;

namespace OpenCourse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TrashController : ControllerBase
{
    private readonly OpenCourseContext _context;
    private readonly UserService _userService;

    public TrashController(OpenCourseContext context, UserService userService)
    {
        _context = context;
        _userService = userService;
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
                u.User.Email.Contains(pagingParameters.Search) ||
                u.Course.Title.Contains(pagingParameters.Search)
            );
        var count = result.Count();
        if (count <= 0) count = 1;
        result = result.Skip((pagingParameters.PageNumber - 1) * pagingParameters.PageSize)
            .Take(pagingParameters.PageSize);
        var users = await result.Include(u => u.User).Where(u => u.UserId != null)
            .Select(u => new TrashBinDto
            {
                Id = u.Id.ToString(),
                Name = $"{u.User.FirstName} {u.User.LastName}",
                DateToDelete = u.User.DateToDelete,
                Image = u.User.Avatar,
                Type = "User",
                UserRoles = u.User.UserRoles.Select(r => new UserRoleResponseDto
                {
                    Id = r.Role.Id,
                    Name = r.Role.Name,
                    Level = r.Role.Level
                }).ToList()
            })
            .ToListAsync();
        var courseList = await result.Include(t => t.Course).Where(u => u.CourseId != null).Select(c => new TrashBinDto
        {
            Id = c.Id.ToString(),
            Name = c.Course.Title,
            Image = c.Course.Image,
            VideoCount = c.Course.Videos.Count,
            DateToDelete = c.Course.DateToDelete,
            Type = "Course"
        }).ToListAsync();
        var concatList = users.Concat(courseList).ToList();
        var pagedResponse = new PagedTrashBinResponseDto
        {
            Data = concatList,
            CurrentPage = pagingParameters.PageNumber,
            PageSize = pagingParameters.PageSize,
            TotalCount = count,
            TotalPages = (int)Math.Ceiling(count / (double)pagingParameters.PageSize)
        };
        return Ok(pagedResponse);
    }

    [HttpDelete("DeleteItem")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteItem([FromBody] TrashDeleteItem item)
    {
        if (item.Id.IsNullOrEmpty()) throw new Exception("Id cannot be empty");
        var response = new
        {
            status = 200,
            message = "Item deleted successfully"
        };
        var intId = int.Parse(item.Id);
        switch (item.Type)
        {
            case "User":
                var user = await _context.TrashBin.FirstOrDefaultAsync(i => i.Id == intId);
                if (user.UserId == null) throw new NullReferenceException("User not found");
                _context.TrashBin.Remove(user);
                await _userService.DeleteUserAsync(user.UserId, HttpContext);
                await _context.SaveChangesAsync();
                return Ok(response);
            case "Course":
                var course = await _context.TrashBin.Include(c => c.Course).FirstAsync(i => i.Id == intId);
                if (course == null) throw new Exception("Course not found");
                _context.Course.Remove(course.Course);
                _context.TrashBin.Remove(course);
                await _context.SaveChangesAsync();
                return Ok(response);
            default:
                throw new ForbiddenException("Invalid type");
        }
    }

    [HttpPost("RecoverItem")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> RecoverItem([FromBody] TrashDeleteItem item)
    {
        if (item.Id.IsNullOrEmpty()) throw new Exception("Id cannot be empty");
        var response = new
        {
            status = 200,
            message = "Item Recovered Successfully"
        };
        var intId = int.Parse(item.Id);
        switch (item.Type)
        {
            case "User":
                var user = await _context.TrashBin.FirstOrDefaultAsync(i => i.Id == intId);
                if (user.UserId == null) throw new NullReferenceException("User not found");
                _context.TrashBin.Remove(user);
                await _userService.RecoverUserFromTrash(user.UserId, HttpContext);
                await _context.SaveChangesAsync();
                return Ok(response);
            case "Course":
                var course = await _context.TrashBin.Include(c => c.Course).FirstAsync(i => i.Id == intId);
                if (course == null) throw new Exception("Course not found");
                course.Course.DateToDelete = null;
                course.Course.Deleted = false;
                _context.Update(course.Course);
                _context.TrashBin.Remove(course);
                await _context.SaveChangesAsync();
                return Ok(response);
            default:
                throw new ForbiddenException("Invalid type");
        }
    }
}
