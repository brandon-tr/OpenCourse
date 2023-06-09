﻿using OpenCourse.Data.DTOs.Request;

namespace OpenCourse.Data.DTOs.Response;

public class PagedTrashBinResponseDto
{
    public List<TrashBinDto> Data { get; set; } = new();

    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

    public bool HasPrevious => CurrentPage > 1;
    public bool HasNext => CurrentPage < TotalPages;
}
