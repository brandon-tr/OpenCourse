using Microsoft.AspNetCore.Mvc;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Model;

namespace OpenCourse.Interfaces;

public interface IUserInterface
{
    Task<GetUserResponseDto> RegisterUserAsync(UserRegistrationDto userRegistrationDto);
    Task<User> LoginUserAsync(UserLoginDto userLoginDto);
    Task<GetUserResponseDto> GetUserAsync(string id);
    Task<GetCurrentUserResponseDto> GetCurrentUser();
    Task<ActionResult<PagedUsersResponseDto>> GetAllUsersAsync(PagingParameters getAllUsersDto);
    Task BanUserAsync(string id, HttpContext httpContext);
    Task UnBanUserAsync(string id, HttpContext httpContextAccessor);
    Task DeleteUserAsync(string id, HttpContext httpContextAccessor);
}
