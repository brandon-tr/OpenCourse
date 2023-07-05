using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Request;
using OpenCourse.Model;

namespace OpenCourse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SiteSettingController : ControllerBase
{
    private readonly OpenCourseContext _context;

    public SiteSettingController(OpenCourseContext context)
    {
        _context = context;
    }

    // GET: api/SiteSetting/5
    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<SiteSettings>> GetSiteSettings(int id)
    {
        if (_context.SiteSetting == null) return NotFound();
        var siteSettings = await _context.SiteSetting.FindAsync(id);

        if (siteSettings == null) return NotFound();

        return siteSettings;
    }

    [HttpGet("meta")]
    public async Task<ActionResult<MetaDataDto>> GetMetaData()
    {
        if (_context.SiteSetting == null) return NotFound();
        var siteSettings = await _context.SiteSetting.FindAsync(1);

        if (siteSettings == null) return NotFound();

        var meta = new MetaDataDto
        {
            SiteName = siteSettings.SiteName,
            SiteAuthor = siteSettings.SiteAuthor,
            SiteDescription = siteSettings.SiteDescription,
            SiteKeywords = siteSettings.SiteKeywords,
            SiteEmail = siteSettings.SiteEmail,
            siteUrl = siteSettings.SiteUrl
        };

        return meta;
    }

    [HttpGet("title")]
    public async Task<ActionResult<SiteTitleDto>> GetSiteTitle()
    {
        if (_context.SiteSetting == null) return NotFound();
        var siteSettings = await _context.SiteSetting.FindAsync(1);

        if (siteSettings == null) return NotFound();

        var title = new SiteTitleDto
        {
            SiteName = siteSettings.SiteName
        };

        return title;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}")]
    public async Task<IActionResult> PutSiteSettings(int id, SiteSettings siteSettings)
    {
        if (id != siteSettings.Id) return BadRequest();

        siteSettings.Id = id;
        _context.Entry(siteSettings).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SiteSettingsExists(id))
                return NotFound();
            throw;
        }

        var response = new
        {
            status = 200,
            message = "Site settings updated successfully"
        };
        return Ok(response);
    }

    private bool SiteSettingsExists(int id)
    {
        return (_context.SiteSetting?.Any(e => e.Id == id)).GetValueOrDefault();
    }

    [AllowAnonymous]
    [HttpGet("GetLogins")]
    public async Task<ActionResult<GetLogins>> GetLogins()
    {
        var siteSettings = await _context.SiteSetting.FindAsync(1);

        if (siteSettings == null) return NotFound();

        var logins = new GetLogins
        {
            IsGoogleLoginEnabled = siteSettings.IsGoogleLoginEnabled,
            registration = siteSettings.IsRegistrationEnabled
        };

        return Ok(logins);
    }
}
