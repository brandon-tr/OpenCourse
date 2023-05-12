using Microsoft.AspNetCore.Mvc;
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

    public async Task<ActionResult<PagedUsersResponseDto>> GetAllUsersAsync(PagingParameters pagingParameters)
    {
        // Get the queryable users list
        var users = _context.User.AsQueryable();

        // Filter users based on the search term
        if (!string.IsNullOrEmpty(pagingParameters.Search))
            users = users.Where(u => u.FirstName.Contains(pagingParameters.Search) ||
                                     u.LastName.Contains(pagingParameters.Search) ||
                                     u.Id.ToString().Equals(pagingParameters.Search) ||
                                     u.Email.Contains(pagingParameters.Search));

        // Get the total count of users
        var count = await users.CountAsync();

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

    private async Task<bool> CheckEmailAsync(string email)
    {
        return await _context.User.AnyAsync(u => u.Email == email).ConfigureAwait(false);
    }

    public async Task UpdateUserAsync(User user)
    {
        _context.Update(user);
        await _context.SaveChangesAsync().ConfigureAwait(false);
    }
}