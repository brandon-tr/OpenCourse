namespace OpenCourse.Data.DTOs.Response;

public class PagedUsersResponseDto
{
    public List<GetAllUsersResponseDto> Users { get; set; } = new();

    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

    public bool HasPrevious => CurrentPage > 1;
    public bool HasNext => CurrentPage < TotalPages;
}