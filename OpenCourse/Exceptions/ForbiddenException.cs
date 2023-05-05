namespace OpenCourse.Exceptions;

public class ForbiddenException : Exception
{
    private const string DefaultMessage =
        "Error 403: Forbidden action. You do not have the necessary permissions to perform " +
        "this action. Please check your credentials and try again. If you believe " +
        "you have received this message in error, " +
        "please contact the system administrator for assistance.";

    public ForbiddenException() : base(DefaultMessage)
    {
    }

    public ForbiddenException(string message) : base(message ?? DefaultMessage)
    {
    }
}
