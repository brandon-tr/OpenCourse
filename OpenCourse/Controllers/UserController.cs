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

    // GET USER WITH ID: api/Authentication/5
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<GetUserResponseDto>> GetUser(int id)
    {
        try
        {
            return await _userService.GetUserAsync(id).ConfigureAwait(false);
        }
        catch (UserNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentNullException)
        {
            return BadRequest();
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }

    // POST REGISTER: api/Authentication/Register
    [HttpPost("Register")]
    public async Task<ActionResult<GetUserResponseDto>> Register([FromBody] UserRegistrationDto registerUser)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        try
        {
            var user = await _userService.RegisterUserAsync(registerUser);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        catch (EmailAlreadyExistsException)
        {
            return BadRequest("Email Already Exists");
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }

    // POST Login: api/Authentication/Login
    [HttpPost("Login")]
    public async Task<ActionResult<User>> Login([FromBody] UserLoginDto userLoginDto)
    {
        try
        {
            var user = await _userService.LoginUserAsync(userLoginDto).ConfigureAwait(false);
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email)
            };
            foreach (var userRole in user.UserRoles) claims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true
            };
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity), authProperties);
            return Ok();
        }
        catch (UserNotFoundException)
        {
            return NotFound();
        }
        catch (WrongPasswordException)
        {
            return Unauthorized("Incorrect Password");
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
}