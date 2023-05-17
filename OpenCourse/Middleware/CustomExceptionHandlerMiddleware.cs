using System.Net;
using OpenCourse.Exceptions;

namespace OpenCourse.Middlewares;

public class CustomExceptionHandlerMiddleware
{
    private static readonly Dictionary<Type, HttpStatusCode> ExceptionStatusCodes = new()
    {
        { typeof(UserNotFoundException), HttpStatusCode.NotFound },
        { typeof(ArgumentNullException), HttpStatusCode.BadRequest },
        { typeof(EmptyBodyException), HttpStatusCode.BadRequest },
        { typeof(UserAlreadySignedInException), HttpStatusCode.BadRequest },
        { typeof(EmailAlreadyExistsException), HttpStatusCode.BadRequest },
        { typeof(WrongPasswordException), HttpStatusCode.Unauthorized },
        { typeof(UnauthorizedException), HttpStatusCode.Unauthorized },
        { typeof(ForbiddenException), HttpStatusCode.Forbidden },
        { typeof(RoleNotFoundException), HttpStatusCode.NotFound },
        { typeof(DatabaseFailedConnectionException), HttpStatusCode.ServiceUnavailable },
        { typeof(ConcurrencyException), HttpStatusCode.Conflict },
        { typeof(BadRolePutException), HttpStatusCode.BadRequest },
        { typeof(RoleDoesNotExistException), HttpStatusCode.BadRequest },
        { typeof(RoleExistsException), HttpStatusCode.BadRequest },
        { typeof(InsufficientPrivilegeException), HttpStatusCode.Forbidden }
    };


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

        if (ExceptionStatusCodes.TryGetValue(exception.GetType(), out var statusCode))
        {
            context.Response.StatusCode = (int)statusCode;
            await context.Response.WriteAsJsonAsync(new { error = exception.Message }).ConfigureAwait(false);
        }
        else
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            Console.WriteLine(exception.Message);
            await context.Response.WriteAsJsonAsync(new
            {
                error = "An unexpected error has occurred. Our team has been notified of the issue, " +
                        "and we apologize for the inconvenience. " +
                        "Please try again later or contact our support team for further assistance."
            }).ConfigureAwait(false);
        }
    }
}