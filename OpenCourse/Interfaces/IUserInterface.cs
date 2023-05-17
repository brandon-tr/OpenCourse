using Microsoft.AspNetCore.Mvc;
using OpenCourse.Data;
using OpenCourse.Data.DTOs.Response;
using OpenCourse.Model;

namespace OpenCourse.Interfaces;

public interface IUserInterface
{
    Task<GetUserResponseDto> RegisterUserAsync(UserRegistrationDto userRegistrationDto);
    Task<User> LoginUserAsync(UserLoginDto userLoginDto);
    Task<GetUserResponseDto> GetUserAsync(int id);
    Task<GetCurrentUserResponseDto> GetCurrentUser();
    Task<ActionResult<PagedUsersResponseDto>> GetAllUsersAsync(PagingParameters getAllUsersDto);
    Task BanUserAsync(int id, HttpContext httpContext);
}