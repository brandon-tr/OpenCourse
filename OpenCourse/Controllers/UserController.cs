using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Response;
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

    // GET ALL USERS PAGINATION WITH FILTER: api/Authentication/GetAllUsers
    [HttpGet("GetAllUsers")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PagedUsersResponseDto>> GetAllUsers(
        [FromQuery] PagingParameters getAllUsersDto)
    {
        var users = await _userService.GetAllUsersAsync(getAllUsersDto).ConfigureAwait(false);
        return Ok(users);
    }

    // POST REGISTER: api/Authentication/Register
    [HttpPost("Register")]
    [Authorize(Policy = "AnonymousOnly")]
    public async Task<ActionResult<GetUserResponseDto>> Register([FromBody] UserRegistrationDto registerUser)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userService.RegisterUserAsync(registerUser);
        var response = new
        {
            message = "Welcome " + user.FirstName + ", thank you for registering",
            status = 200
        };
        return Created("", response);
    }

    // POST Login: api/Authentication/Login
    [HttpPost("Login")]
    [Authorize(Policy = "AnonymousOnly")]
    public async Task<ActionResult<User>> Login([FromBody] UserLoginDto userLoginDto)
    {
        var user = await _userService.LoginUserAsync(userLoginDto).ConfigureAwait(false);
        var claims = GenerateClaims(user);

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true
        };
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity), authProperties);

        user.LastLogIn = DateTime.UtcNow;
        user.LastLoginIp = HttpContext.Connection.RemoteIpAddress;
        await _userService.UpdateUserAsync(user);
        return Ok(new { message = "Welcome back " + user.FirstName, status = 200 });
    }

    [HttpGet("checkAdmin")]
    [Authorize(Roles = "Admin")]
    public ActionResult CheckAdmin()
    {
        return Ok(new { message = "Approved", status = 200 });
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