using System.ComponentModel.DataAnnotations;

namespace OpenCourse.Data.DTOs.Response;

public class MetaDataDto
{
    [Required] [MaxLength(50)] public string SiteName { get; set; }

    [MaxLength(255)] public string SiteDescription { get; set; }

    [MaxLength(255)] public string SiteKeywords { get; set; }

    [MaxLength(255)] public string SiteAuthor { get; set; }

    [MaxLength(255)] public string? SiteEmail { get; set; }
    [MaxLength(255)] public string? siteUrl { get; set; }
}