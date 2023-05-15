﻿using System.ComponentModel.DataAnnotations;

namespace OpenCourse.Data.DTOs.Response;

public class UserUpdateDto
{
    [Required] public int Id { get; set; }

    [EmailAddress]
    [MinLength(2)]
    [MaxLength(120)]
    public string? Email { get; set; }

    [MinLength(2)] [MaxLength(120)] public string? FirstName { get; set; }

    [MinLength(2)] [MaxLength(120)] public string? LastName { get; set; }

    [MinLength(3)] [MaxLength(120)] public string? Password { get; set; }

    public bool? IsBanned { get; set; }
    public string? Avatar { get; set; } = null!;

    public List<UserRoleResponseDto>? UserRoles { get; set; } = null!;
}