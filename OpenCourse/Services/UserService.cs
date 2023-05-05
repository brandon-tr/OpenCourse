using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Exceptions;
using OpenCourse.Interfaces;
using OpenCourse.Model;

namespace OpenCourse.Services;

public class UserService : IUserInterface
{
    private readonly IConfiguration _configuration;
    private readonly OpenCourseContext _context;

    public UserService(OpenCourseContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<GetUserResponseDto> GetUserAsync(int id)
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
                Name = ur.Role.Name,
                Level = ur.Role.Level
            }).ToList()
        };
    }

    public Task<GetCurrentUserResponseDto> GetCurrentUser()
    {
        throw new NotImplementedException();
    }

    public async Task<User> LoginUserAsync(UserLoginDto userLoginDto)
    {
        var user = await _context.User
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == userLoginDto.Email)
            .ConfigureAwait(false);
        if (user == null) throw new UserNotFoundException();

        if (!BCrypt.Net.BCrypt.EnhancedVerify(userLoginDto.Password, user.Password)) throw new WrongPasswordException();
        return user;
    }

    public async Task<GetUserResponseDto> RegisterUserAsync(UserRegistrationDto userRegistrationDto)
    {
        if (await CheckEmailAsync(userRegistrationDto.Email).ConfigureAwait(false))
            throw new EmailAlreadyExistsException();

        var newUser = new User
        {
            Email = userRegistrationDto.Email,
            FirstName = userRegistrationDto.FirstName,
            LastName = userRegistrationDto.LastName,
            Password = BCrypt.Net.BCrypt.EnhancedHashPassword(userRegistrationDto.Password),
            UserRoles = new List<UserRole>
            {
                new()
                {
                    RoleId = 3
                }
            }
        };

        _context.Add(newUser);
        await _context.SaveChangesAsync().ConfigureAwait(false);
        var role = await _context.Role.FirstOrDefaultAsync(r => r.Id == 3).ConfigureAwait(false);
        var userResponseDto = new GetUserResponseDto
        {
            Id = newUser.Id,
            Email = newUser.Email,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            UserRoles = newUser.UserRoles.Select(ur => new UserRoleResponseDto
            {
                Name = role.Name,
                Level = role.Level
            }).ToList()
        };
        return userResponseDto;
    }

    private async Task<bool> CheckEmailAsync(string email)
    {
        return await _context.User.AnyAsync(u => u.Email == email).ConfigureAwait(false);
    }
}