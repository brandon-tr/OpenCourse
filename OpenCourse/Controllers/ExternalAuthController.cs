using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
using OpenCourse.Model;
using OpenCourse.Services;

namespace OpenCourse.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExternalAuthController : ControllerBase
{
    private readonly OpenCourseContext _context;
    private readonly ILogger<ExternalAuthController> _logger;
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;
    private readonly UserService _userService;

    public ExternalAuthController(SignInManager<User> signInManager, UserManager<User> userManager,
        OpenCourseContext context, ILogger<ExternalAuthController> logger, UserService userService)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _context = context;
        _logger = logger;
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        var properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", "/signin-google");
        properties.RedirectUri = Url.Action("ExternalLoginCallback");
        return new ChallengeResult("Google", properties);
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
    {
        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null)
        {
            _logger.Log(LogLevel.Error, "Error loading external login information. ");
            return Redirect("/?errors=unknown");
        }

        var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, false, true);
        if (result.Succeeded) return await ProcessSuccessfulExternalLoginResult(info);

        if (result.IsLockedOut) return Redirect("/?errors=locked");

        if (result.IsNotAllowed) return Redirect("/?errors=not_allowed");

        if (result.RequiresTwoFactor) return Redirect("/?errors=2fa");

        return await CreateUserForExternalLogin(info);
    }

    private async Task<IActionResult> ProcessSuccessfulExternalLoginResult(ExternalLoginInfo info)
    {
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        var retrievedUser = await _userManager.FindByEmailAsync(email);

        if (retrievedUser == null)
        {
            _logger.Log(LogLevel.Error, "User is null");
            return Redirect("/?errors=user_is_null");
        }

        retrievedUser.LastLogIn = DateTime.UtcNow;
        retrievedUser.LastLoginIp = HttpContext.Connection.RemoteIpAddress;
        await _userManager.UpdateAsync(retrievedUser);

        await _userService.SetRoleMaxClaim(retrievedUser);
        return Redirect("/");
    }

    private async Task<IActionResult> CreateUserForExternalLogin(ExternalLoginInfo info)
    {
        var user = new User
        {
            UserName = info.Principal.FindFirstValue(ClaimTypes.Email),
            Email = info.Principal.FindFirstValue(ClaimTypes.Email),
            FirstName = info.Principal.FindFirstValue(ClaimTypes.GivenName) ??
                        throw new NullReferenceException("Null value"),
            LastName = info.Principal.FindFirstValue(ClaimTypes.Surname) ??
                       throw new NullReferenceException("Null Value"),
            LastLogIn = DateTime.UtcNow,
            LastLoginIp = HttpContext.Connection.RemoteIpAddress
        };
        var createResult = await _userManager.CreateAsync(user);
        var role = await _context.Role.FirstOrDefaultAsync(r => r.Id.Equals("48952354-c45e-4ffc-8e9d-0a4db66a0724"))
            .ConfigureAwait(false);
        if (role == null)
        {
            _logger.Log(LogLevel.Error, "Role not found, ensure a correct id has been set");
            return Redirect("/?errors=unknown");
        }

        if (createResult.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, role.Name);
            createResult = await _userManager.AddLoginAsync(user, info);
            if (createResult.Succeeded)
            {
                await _signInManager.SignInAsync(user, false);
                await _userService.SetRoleMaxClaim(user);
                // The user has been created and signed in.
                return Redirect("/");
            }
        }

        _logger.Log(LogLevel.Error, "Failed to create user");
        return Redirect("/?errors=unknown");
    }
}
