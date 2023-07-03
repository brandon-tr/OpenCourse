using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Exceptions;
using OpenCourse.Interfaces;
using OpenCourse.Model;

namespace OpenCourse.Services;

public class UserService : IUserInterface
{
    private readonly OpenCourseContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<UserService> _logger;

    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;

    public UserService(OpenCourseContext context, SignInManager<User> signInManager, UserManager<User> userManager,
        IHttpContextAccessor httpContextAccessor, ILogger<UserService> logger)
    {
        _context = context;
        _signInManager = signInManager;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<GetCurrentUserResponseDto> GetCurrentUser()
    {
        if (_httpContextAccessor.HttpContext == null || _httpContextAccessor.HttpContext.User == null)
            throw new NullReferenceException("http context null");
        var user = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext.User).ConfigureAwait(false);

        if (user == null) throw new NullReferenceException("User not found, please login or login again");

        await SetRoleMaxClaim(user);
        var claims = await _userManager.GetClaimsAsync(user);
        var maxLevel = claims.FirstOrDefault(cl => cl.Type == "RoleLevel")?.Value;

        if (maxLevel == null) throw new NullReferenceException("Please login again to retrieve your role");

        return new GetCurrentUserResponseDto
        {
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Avatar = user.Avatar,
            IsBanned = user.IsBanned,
            LoggedIn = true,
            level = int.Parse(maxLevel)
        };
    }

    public async Task<User> LoginUserAsync(UserLoginDto userLoginDto)
    {
        var user = await _context.User
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == userLoginDto.Email)
            .ConfigureAwait(false);
        if (user == null) throw new UserNotFoundException();

        // if (!BCrypt.Net.BCrypt.EnhancedVerify(userLoginDto.Password, user.Password)) throw new WrongPasswordException();
        var result = await _signInManager.PasswordSignInAsync(user, userLoginDto.Password, true, true);
        if (result.Succeeded)
        {
            await SetRoleMaxClaim(user);

            // Each role will be added as a claim
            // foreach (var role in roles)
            // {
            //     var claim = new Claim(ClaimTypes.Role, role);
            //     await _userManager.AddClaimAsync(user, claim);
            // }
            if (user.IsBanned) throw new UserBannedException();
            return user;
        }

        throw new WrongPasswordException();
    }

    public async Task<GetUserResponseDto> RegisterUserAsync(UserRegistrationDto userRegistrationDto)
    {
        if (await CheckEmailAsync(userRegistrationDto.Email).ConfigureAwait(false))
            throw new EmailAlreadyExistsException();
        Console.WriteLine(_context.Role.First().Id);
        var role = await _context.Role.FirstOrDefaultAsync(r => r.Id.Equals("48952354-c45e-4ffc-8e9d-0a4db66a0724"))
            .ConfigureAwait(false);

        if (role == null) throw new RoleNotFoundException();
        var newUser = new User
        {
            Email = userRegistrationDto.Email,
            FirstName = userRegistrationDto.FirstName,
            LastName = userRegistrationDto.LastName,
            UserName = userRegistrationDto.Email
        };
        try
        {
            var result = await _signInManager.UserManager.CreateAsync(newUser, userRegistrationDto.Password);
            var roleAdd = await _userManager.AddToRoleAsync(newUser, role.Name);
            if (!result.Succeeded)
                foreach (var error in result.Errors)
                    throw new InvalidDataException(error.Description);
            if (!roleAdd.Succeeded)
                foreach (var error in result.Errors)
                    throw new InvalidDataException(error.Description);
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            throw;
        }

        var responseRole = await _userManager.GetRolesAsync(newUser);
        var userResponseDto = new GetUserResponseDto
        {
            Id = newUser.Id,
            Email = newUser.Email,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            UserRoles = responseRole.Select(r => new UserRoleResponseDto
            {
                Name = r,
                Level = role.Level
            }).ToList()
        };
        return userResponseDto;
    }

    public async Task<ActionResult<PagedUsersResponseDto>> GetAllUsersAsync(PagingParameters pagingParameters)
    {
        if (pagingParameters.PageNumber <= 0) throw new NullReferenceException("Page number must be greater than 0");
        if (pagingParameters.PageSize <= 0) throw new NullReferenceException("Page size must be greater than 0");

        // Get the queryable users list
        var users = _context.User.AsQueryable();
        users = users.Where(u => u.Deleted == false);

        // Filter users based on the search term
        if (!string.IsNullOrEmpty(pagingParameters.Search))
            users = users.Where(u =>
                u.FirstName.Contains(pagingParameters.Search) ||
                u.LastName.Contains(pagingParameters.Search) ||
                u.Id.Equals(pagingParameters.Search) ||
                u.Email.Contains(pagingParameters.Search)
            );

        // Get the total count of users
        var count = await users.CountAsync();
        if (count <= 0) count = 1;

        // Apply pagination
        users = users.Skip((pagingParameters.PageNumber - 1) * pagingParameters.PageSize)
            .Take(pagingParameters.PageSize);

        // Fetch the required users from database and map them to the DTO

        var usersList = await users.Select(user => new GetAllUsersResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Avatar = user.Avatar,
            IsBanned = user.IsBanned,
            UserRoles = user.UserRoles.Select(userRole => new UserRoleResponseDto
            {
                Id = userRole.Role.Id,
                Name = userRole.Role.Name,
                Level = userRole.Role.Level
            }).ToList()
        }).ToListAsync();


        // Prepare the paged response
        var pagedResponse = new PagedUsersResponseDto
        {
            Users = usersList,
            CurrentPage = pagingParameters.PageNumber,
            PageSize = pagingParameters.PageSize,
            TotalCount = count,
            TotalPages = (int)Math.Ceiling(count / (double)pagingParameters.PageSize)
        };

        return pagedResponse;
    }

    public async Task<GetUserResponseDto> GetUserAsync(string id)
    {
        if (id == null) throw new ArgumentNullException(nameof(id));
        var user = await _context.User.Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id).ConfigureAwait(false);
        if (user == null) throw new UserNotFoundException();
        return new GetUserResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            IsBanned = user.IsBanned,
            Avatar = user.Avatar,
            LastName = user.LastName,
            UserRoles = user.UserRoles.Select(ur => new UserRoleResponseDto
            {
                Id = ur.Role.Id,
                Name = ur.Role.Name,
                Level = ur.Role.Level
            }).ToList()
        };
    }

    public async Task UnBanUserAsync(string id, HttpContext httpContextAccessor)
    {
        var requesterId = httpContextAccessor.User.Claims.FirstOrDefault(cl => cl.Type == ClaimTypes.NameIdentifier)
            ?.Value;
        if (requesterId.IsNullOrEmpty()) throw new EmptyBodyException();
        if (requesterId.Equals(id)) throw new InsufficientPrivilegeException("You cannot unban yourself");
        var user = await _context.User.Where(user => user.Id == id)
            .Select(ur => new
            {
                User = ur,
                RoleLevel = ur.UserRoles.Select(r => r.Role.Level)
            }).FirstOrDefaultAsync().ConfigureAwait(false);
        if (user == null) throw new UserNotFoundException();

        var attemptedBanUserClaims =
            httpContextAccessor.User.Claims.Where(cl => cl.Type == "RoleLevel")?.Max(m => m.Value);
        Console.WriteLine(attemptedBanUserClaims);
        if (attemptedBanUserClaims is null) throw new ForbiddenException();

        var higherRank = int.Parse(attemptedBanUserClaims) >= user.RoleLevel.Max();
        if (!higherRank) throw new InsufficientPrivilegeException();

        user.User.IsBanned = false;
        _context.Update(user.User);
        await _context.SaveChangesAsync().ConfigureAwait(false);
    }

    public async Task DeleteUserAsync(string id, HttpContext httpContextAccessor)
    {
        if (id.IsNullOrEmpty()) throw new EmptyBodyException("Id cannot be empty");
        var requesterId = httpContextAccessor.User.Claims.FirstOrDefault(cl => cl.Type == ClaimTypes.NameIdentifier)
            ?.Value;
        if (requesterId.IsNullOrEmpty()) throw new EmptyBodyException();
        if (requesterId.Equals(id)) throw new InsufficientPrivilegeException("You cannot delete yourself silly");
        var user = await _context.User.Where(user => user.Id == id)
            .Select(ur => new
            {
                User = ur,
                RoleLevel = ur.UserRoles.Select(r => r.Role.Level)
            }).FirstOrDefaultAsync().ConfigureAwait(false);
        if (user == null) throw new UserNotFoundException();
        var attemptedBanUserClaims =
            httpContextAccessor.User.Claims.Where(cl => cl.Type == "RoleLevel")?.Max(m => m.Value);
        if (attemptedBanUserClaims is null) throw new ForbiddenException();
        var higherRank = int.Parse(attemptedBanUserClaims) >= user.RoleLevel.Max();
        if (!higherRank) throw new InsufficientPrivilegeException();
        if (user.User.Deleted)
        {
            await _userManager.DeleteAsync(user.User);
        }
        else
        {
            user.User.Deleted = true;
            user.User.DateToDelete = DateTime.UtcNow + TimeSpan.FromDays(30);
            var trashBin = new TrashBin { User = user.User };

            // Add it to the context
            _context.TrashBin.Add(trashBin);
            _context.Update(user.User);
        }

        await _context.SaveChangesAsync().ConfigureAwait(false);
    }

    public async Task BanUserAsync(string id, HttpContext httpContextAccessor)
    {
        var requesterId = httpContextAccessor.User.Claims.FirstOrDefault(cl => cl.Type == ClaimTypes.NameIdentifier)
            ?.Value;
        if (requesterId.IsNullOrEmpty()) throw new EmptyBodyException();
        if (requesterId.Equals(id)) throw new InsufficientPrivilegeException("You cannot ban yourself silly");
        var user = await _context.User.Where(user => user.Id == id)
            .Select(ur => new
            {
                User = ur,
                RoleLevel = ur.UserRoles.Select(r => r.Role.Level)
            }).FirstOrDefaultAsync().ConfigureAwait(false);
        if (user == null) throw new UserNotFoundException();

        var attemptedBanUserClaims =
            httpContextAccessor.User.Claims.Where(cl => cl.Type == "RoleLevel")?.Max(m => m.Value);
        if (attemptedBanUserClaims is null) throw new ForbiddenException();

        var higherRank = int.Parse(attemptedBanUserClaims) >= user.RoleLevel.Max();
        if (!higherRank) throw new InsufficientPrivilegeException();

        user.User.IsBanned = true;
        _context.Update(user.User);
        await _context.SaveChangesAsync().ConfigureAwait(false);
    }

    private async Task<bool> CheckEmailAsync(string email)
    {
        return await _context.User.AnyAsync(u => u.Email == email).ConfigureAwait(false);
    }

    public async Task UpdateUserAsync(User user)
    {
        _context.Update(user);
        await _context.SaveChangesAsync().ConfigureAwait(false);
    }

    public async Task UpdateUserAsync(UserUpdateDto user, HttpContext httpContextAccessor)
    {
        var requesterId = httpContextAccessor.User.Claims.FirstOrDefault(cl => cl.Type == ClaimTypes.NameIdentifier)
            ?.Value;
        if (requesterId == null) throw new InvalidDataException();
        var userToUpdate = await _context.User.FirstAsync(u => u.Id == user.Id).ConfigureAwait(false);
        if (userToUpdate == null) throw new UserNotFoundException();
        if (user.FirstName is not null) userToUpdate.FirstName = user.FirstName;
        if (user.LastName is not null) userToUpdate.LastName = user.LastName;
        if (user.Email is not null) userToUpdate.Email = user.Email;
        if (user.Avatar is not null) userToUpdate.Avatar = user.Avatar;
        if (user.IsBanned is not null)
        {
            if (requesterId.Equals(user.Id))
                throw new InsufficientPrivilegeException("You cannot ban yourself silly");
            userToUpdate.IsBanned = (bool)user.IsBanned;
        }

        if (user.Password is not null)
        {
            var hasher = _userManager.PasswordHasher;
            var hashedNewPassword = hasher.HashPassword(userToUpdate, user.Password);
            userToUpdate.PasswordHash = hashedNewPassword;
        }

        // userToUpdate.PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password);
        if (user.UserRoles is not null)
        {
            var highestRole =
                httpContextAccessor.User.Claims.Where(cl => cl.Type == "RoleLevel")?.Max(m => m.Value);
            var newHighestRole = user.UserRoles.Max(ur => ur.Level);
            if (requesterId.Equals(user.Id) && int.Parse(highestRole) > newHighestRole)
                throw new InsufficientPrivilegeException("You cannot change your own role to a lower one");
            if (requesterId.Equals(user.Id) && int.Parse(highestRole) < newHighestRole)
                throw new InsufficientPrivilegeException("You cannot change your own role to a higher one");

            // Remove existing UserRoles
            var userRolesToRemove = _context.UserRoles.Where(ur => ur.UserId == user.Id);
            _context.UserRoles.RemoveRange(userRolesToRemove);

            userToUpdate.UserRoles = user.UserRoles.Select(ur => new UserRoles
            {
                RoleId = ur.Id,
                UserId = user.Id
            }).ToList();
        }

        _context.Update(userToUpdate);


        await _context.SaveChangesAsync().ConfigureAwait(false);
    }

    public async Task RecoverUserFromTrash(string id, HttpContext httpContextAccessor)
    {
        var requesterId = httpContextAccessor.User.Claims.FirstOrDefault(cl => cl.Type == ClaimTypes.NameIdentifier)
            ?.Value;
        if (requesterId == null) throw new NullReferenceException("Invalid request from an unknown user");
        if (requesterId.Equals(id))
            throw new InsufficientPrivilegeException("You cannot recover yourself");

        // var user = await _context.User.FindAsync(id).ConfigureAwait(false);
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) throw new NullReferenceException("User is not found");
        if (user.Deleted == false) throw new NullReferenceException("User is not marked for deletion");
        user.Deleted = false;
        user.DateToDelete = null;
        _context.Update(user);
        _context.TrashBin.Remove(await _context.TrashBin.FirstAsync(tb => tb.UserId == id).ConfigureAwait(false));
        await _context.SaveChangesAsync().ConfigureAwait(false);
    }

    public async Task SetRoleMaxClaim(User user)
    {
        var userRoleNames = await _userManager.GetRolesAsync(user);
        var userRoles = _context.Role.Where(r => userRoleNames.Contains(r.Name));
        var maxLevel = userRoles.Max(r => r.Level);

        var checkClaims = await _userManager.GetClaimsAsync(user);
        var checkRoleClaimExsist = checkClaims.Where(cl => cl.Type == "RoleLevel").ToList();
        if (checkRoleClaimExsist.Count <= 0 || checkRoleClaimExsist is null)
        {
            await _userManager.AddClaimAsync(user, new Claim("RoleLevel", maxLevel.ToString()));
            return;
        }

        var isHigherThanCurrentClaim = false;
        foreach (var claim in checkRoleClaimExsist)
            if (int.Parse(claim.Value) < maxLevel)
            {
                isHigherThanCurrentClaim = true;
                await _userManager.RemoveClaimAsync(user, claim);
                break;
            }

        if (!isHigherThanCurrentClaim) return;

        await _userManager.AddClaimAsync(user, new Claim("RoleLevel", maxLevel.ToString()));
    }
}
