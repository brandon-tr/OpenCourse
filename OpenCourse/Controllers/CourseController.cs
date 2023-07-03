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
    private readonly ILogger<CourseController> _logger;

    public CourseController(OpenCourseContext context, ILogger<CourseController> logger)
    {
        _context = context;
        _logger = logger;
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

        var filePath = Path.GetTempFileName();

        using (var stream = System.IO.File.Create(filePath))
        {
            await course.Image.CopyToAsync(stream);
        }

        var newCourse = new Course
        {
            Title = course.Title,
            Description = course.Description,
            Image = filePath
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
