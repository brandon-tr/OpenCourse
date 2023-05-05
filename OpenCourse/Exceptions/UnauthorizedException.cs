namespace OpenCourse.Exceptions;

public class UnauthorizedException : Exception
{
    private const string DefaultMessage = "Error 401: Unauthorized. You do not have the necessary " +
                                          "permissions to perform this action. Please check your " +
                                          "credentials and try again. If you believe you have received " +
                                          "this message in error, please contact the system " +
                                          "administrator for assistance.";

    public UnauthorizedException() : base(DefaultMessage)
    {
    }

    public UnauthorizedException(string message) : base(message ?? DefaultMessage)
    {
    }
}
