using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Exceptions;
using OpenCourse.Model;
using OpenCourse.Services;

namespace OpenCourse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly UserService _userService;

    public UserController(UserService userService, UserManager<User> userManager)
    {
        _userService = userService;
        _userManager = userManager;
    }

    // GET USER WITH ID: api/Authentication/{id}
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin, Moderator")]
    public async Task<ActionResult<GetUserResponseDto>> GetUser(string id)
    {
        var user = await _userService.GetUserAsync(id).ConfigureAwait(false);
        return user;
    }

    // GET ALL USERS PAGINATION WITH FILTER: api/Authentication/GetAllUsers
    [HttpGet("GetAllUsers")]
    [Authorize(Roles = "Admin, Moderator")]
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

        user.LastLogIn = DateTime.UtcNow;
        user.LastLoginIp = HttpContext.Connection.RemoteIpAddress;
        await _userService.UpdateUserAsync(user);
        var claims = await _userManager.GetClaimsAsync(user);
        var roleLevel = claims.FirstOrDefault(c => c.Type == "RoleLevel")?.Value;
        return Ok(new { message = "Welcome back " + user.FirstName, level = roleLevel, status = 200 });
    }

    [HttpPost("UpdateUser")]
    [Authorize(Roles = "Admin, Moderator")]
    public async Task<ActionResult<User>> UpdateUser([FromBody] UserUpdateDto user)
    {
        await _userService.UpdateUserAsync(user, HttpContext);
        return Ok(new { message = "User updated", status = 200 });
    }

    [HttpPost("ban/{id}")]
    [Authorize(Roles = "Moderator, Admin")]
    public async Task<ActionResult<User>> BanUser(string id)
    {
        await _userService.BanUserAsync(id, HttpContext);
        return Ok(new { message = "User banned", status = 200 });
    }

    [HttpPost("unban/{id}")]
    [Authorize(Roles = "Moderator, Admin")]
    public async Task<ActionResult<User>> UnBanUser(string id)
    {
        await _userService.UnBanUserAsync(id, HttpContext);
        return Ok(new { message = "User unbanned", status = 200 });
    }

    [HttpGet("checkAdmin")]
    [Authorize(Roles = "Admin, Moderator")]
    public async Task<ActionResult> CheckAdmin()
    {
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user == null) throw new UserNotFoundException();
        var claims = await _userManager.GetClaimsAsync(user);
        var roleLevel = claims.FirstOrDefault(c => c.Type == "RoleLevel")?.Value;
        return Ok(new { message = "Approved", level = roleLevel, status = 200 });
    }

    [HttpDelete("DeleteUser")]
    [Authorize(Roles = "Admin, Moderator")]
    public async Task<ActionResult> DeleteUser([FromBody] string id)
    {
        await _userService.DeleteUserAsync(id, HttpContext);
        return Ok(new { message = "User has been marked for deletion", status = 200 });
    }


    [HttpPost("recover")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<User>> RecoverUser([FromBody] string id)
    {
        await _userService.RecoverUserFromTrash(id, HttpContext);
        return Ok(new { message = "User has been recovered", status = 200 });
    }
}
