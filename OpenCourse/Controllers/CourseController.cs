using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Request;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Model;

namespace OpenCourse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CourseController : ControllerBase
{
    private readonly OpenCourseContext _context;
    private readonly IWebHostEnvironment _hostEnvironment;
    private readonly ILogger<CourseController> _logger;

    public CourseController(OpenCourseContext context, ILogger<CourseController> logger,
        IWebHostEnvironment hostEnvironment)
    {
        _context = context;
        _logger = logger;
        _hostEnvironment = hostEnvironment;
    }

    // GET: api/Course
    [HttpGet]
    public async Task<ActionResult<PagedCoursesResponseDto>> GetCourse([FromQuery] PagingParameters pagingParameters)
    {
        if (_context.Course == null) throw new NullReferenceException("Courses is null");

        if (pagingParameters.PageNumber <= 0) throw new NullReferenceException("Page number must be greater than 0");
        if (pagingParameters.PageSize <= 0) throw new NullReferenceException("Page size must be greater than 0");

        var query = _context.Course.AsQueryable() ?? throw new ArgumentNullException("_context.Course.AsQueryable()");

        query = query.Where(c => c.Deleted == false);

        if (!string.IsNullOrEmpty(pagingParameters.Search))
            query = query.Where(u =>
                u.Title.Contains(pagingParameters.Search) ||
                u.Description.Contains(pagingParameters.Search) ||
                u.Id.ToString().Equals(pagingParameters.Search)
            );

        // Apply pagination
        var totalCount = await query.CountAsync();
        if (totalCount <= 0) totalCount = 1;

        var totalPages = (int)Math.Ceiling((double)totalCount / pagingParameters.PageSize);
        var currentPage = pagingParameters.PageNumber > totalPages ? totalPages : pagingParameters.PageNumber;
        query = query
            .OrderBy(c => c.Id)
            .Skip((pagingParameters.PageNumber - 1) * pagingParameters.PageSize)
            .Take(pagingParameters.PageSize);
        var courseList = await query.Select(c => new CourseDto
        {
            Id = c.Id,
            Title = c.Title,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            Image = c.Image,
            VideoCount = c.Videos.Count
        }).ToListAsync();

        var response = new PagedCoursesResponseDto
        {
            Courses = courseList,
            CurrentPage = currentPage,
            TotalPages = totalPages,
            PageSize = pagingParameters.PageSize,
            TotalCount = totalCount
        };
        return response;
    }

    // GET: api/Course/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetCourse(int id)
    {
        if (_context.Course == null) return NotFound();
        var course = await _context.Course.FindAsync(id);

        if (course == null) return NotFound();

        return course;
    }

    // PUT: api/Course/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCourse(int id, Course course)
    {
        if (id != course.Id) return BadRequest();

        _context.Entry(course).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CourseExists(id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    // POST: api/Course
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost("Add")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<Course>> PostCourse([FromForm] CourseAddDto course)
    {
        if (_context.Course == null) return Problem("Entity set 'OpenCourseContext.Course'  is null.");

        // Get the uploaded file from the DTO
        var file = course.Image;
        // Extract the original file extension
        var fileExtension = Path.GetExtension(file.FileName);
        // Generate a new unique name for the file to avoid collisions
        var uniqueFileName = Guid.NewGuid().ToString();
        // Combine the unique file name with the original extension
        var fileNameWithExtension = $"{uniqueFileName}{fileExtension}";
        // Combine the file path with the file name
        var filePath = Path.Combine(_hostEnvironment.WebRootPath, "images", fileNameWithExtension);
        var imagePath = Path.Combine(_hostEnvironment.WebRootPath, "images");

        if (!Directory.Exists(imagePath)) Directory.CreateDirectory(imagePath);

        // Save the file to the server
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        Console.WriteLine("HERE FILE SAVED");

        var newCourse = new Course
        {
            Title = course.Title,
            Description = course.Description,
            Image = fileNameWithExtension
        };

        _context.Course.Add(newCourse);
        await _context.SaveChangesAsync();

        var message = new
        {
            status = 200,
            message = "Successfully added course"
        };
        return Ok(message);
    }

    // DELETE: api/Course/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        if (_context.Course == null) return NotFound();
        var course = await _context.Course.FindAsync(id);
        if (course == null) return NotFound();

        course.Deleted = true;
        course.DateToDelete = DateTime.UtcNow + TimeSpan.FromDays(30);

        var trashBin = new TrashBin { Course = course };

        // Add it to the context
        _context.TrashBin.Add(trashBin);

        _context.Update(course);

        var response = new
        {
            status = 200,
            message = "Successfully deleted course"
        };

        await _context.SaveChangesAsync().ConfigureAwait(false);

        return Ok(response);
    }

    private bool CourseExists(int id)
    {
        return (_context.Course?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}
