using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
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
    public async Task<ActionResult<IEnumerable<Course>>> GetCourse()
    {
        if (_context.Course == null) return NotFound();
        return await _context.Course.ToListAsync();
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

        _context.Course.Remove(course);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CourseExists(int id)
    {
        return (_context.Course?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}
