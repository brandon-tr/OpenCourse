using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Exceptions;
using OpenCourse.Model;
using OpenCourse.Services;

namespace OpenCourse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    // GET USER WITH ID: api/Authentication/{id}
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<GetUserResponseDto>> GetUser(int id)
    {
        var user = await _userService.GetUserAsync(id).ConfigureAwait(false);
        return user;
    }

    // POST REGISTER: api/Authentication/Register
    [HttpPost("Register")]
    public async Task<ActionResult<GetUserResponseDto>> Register([FromBody] UserRegistrationDto registerUser)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userService.RegisterUserAsync(registerUser);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    // POST Login: api/Authentication/Login
    [HttpPost("Login")]
    public async Task<ActionResult<User>> Login([FromBody] UserLoginDto userLoginDto)
    {
        if (User.Identity.IsAuthenticated) throw new UserAlreadySignedInException();

        var user = await _userService.LoginUserAsync(userLoginDto).ConfigureAwait(false);
        var claims = GenerateClaims(user);

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true
        };
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity), authProperties);
        return Ok();
    }

    private static List<Claim> GenerateClaims(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email)
        };

        foreach (var userRole in user.UserRoles) claims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));
        return claims;
    }
}
