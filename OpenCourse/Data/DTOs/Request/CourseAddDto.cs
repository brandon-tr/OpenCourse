﻿using System.ComponentModel.DataAnnotations;

namespace OpenCourse.Data.DTOs.Request;

public class CourseAddDto
{
    [Microsoft.Build.Framework.Required]
    [StringLength(100, MinimumLength = 5,
        ErrorMessage = "Title must be at minimum 5 characters longer and cannot be greater than 100 characters")]
    public string Title { get; set; }

    [Microsoft.Build.Framework.Required]
    [StringLength(500, MinimumLength = 10,
        ErrorMessage = "Description cannot be longer than 500 characters. Minimum length is 10 characters.")]
    public string Description { get; set; }

    [Required] public IFormFile Image { get; set; }
}
