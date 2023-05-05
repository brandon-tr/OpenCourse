using System.Net;
using OpenCourse.Exceptions;

namespace OpenCourse.Middlewares;

public class CustomExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;

    public CustomExceptionHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        if (exception is UserNotFoundException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            await context.Response.WriteAsJsonAsync(new { error = exception.Message }).ConfigureAwait(false);
        }
        else if (exception is ArgumentNullException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await context.Response.WriteAsJsonAsync(new { error = exception.Message }).ConfigureAwait(false);
        }
        else if (exception is UserAlreadySignedInException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await context.Response.WriteAsJsonAsync(new { error = exception.Message }).ConfigureAwait(false);
        }
        else if (exception is EmailAlreadyExistsException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await context.Response.WriteAsJsonAsync(new { error = exception.Message }).ConfigureAwait(false);
        }
        else if (exception is WrongPasswordException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.WriteAsJsonAsync(new { error = exception.Message }).ConfigureAwait(false);
        }
        else if (exception is UnauthorizedException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.WriteAsJsonAsync(new { error = exception.Message }).ConfigureAwait(false);
        }
        else if (exception is ForbiddenException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
            await context.Response.WriteAsJsonAsync(new { error = exception.Message }).ConfigureAwait(false);
        }
        else
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "An unexpected error has occurred. Our team has been notified of the issue, " +
                        "and we apologize for the inconvenience. " +
                        "Please try again later or contact our support team for further assistance."
            }).ConfigureAwait(false);
        }
    }
}
