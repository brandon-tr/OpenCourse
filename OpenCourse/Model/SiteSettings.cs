using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenCourse.Model;

public class SiteSettings
{
    public SiteSettings()
    {
        SiteName = "OpenCourse";
        SiteDescription = "OpenCourse is a free and open source online course platform.";
        SiteKeywords = "OpenCourse, Open Source, Online Course, Free";
        SiteAuthor = "Brandon Travis";
        SiteUrl = "https://github.com/brandon-tr/OpenCourse";
        IsRegistrationEnabled = true;
        IsEmailConfirmationRequired = true;
        IsMaintenanceMode = false;
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required] [MaxLength(50)] public string SiteName { get; set; }

    [MaxLength(255)] public string SiteDescription { get; set; }

    [MaxLength(255)] public string SiteKeywords { get; set; }

    [MaxLength(255)] public string SiteAuthor { get; set; }

    [MaxLength(255)] public string? SiteEmail { get; set; }

    [MaxLength(255)] public string SiteUrl { get; set; }

    [MaxLength(255)] public string? SiteLogo { get; set; }

    [MaxLength(255)] public string? SiteFavicon { get; set; }

    [MaxLength(255)] public string? SiteFacebook { get; set; }

    [MaxLength(255)] public string? SiteTwitter { get; set; }

    [MaxLength(255)] public string? SiteInstagram { get; set; }

    [MaxLength(255)] public string? SiteYoutube { get; set; }
    public bool IsRegistrationEnabled { get; set; }
    public bool IsEmailConfirmationRequired { get; set; }
    public bool IsMaintenanceMode { get; set; }
}