namespace OpenCourse.Exceptions;

public class InsufficientPrivilegeException : Exception
{
    private const string DefaultMessage = "Sorry, you do not have the necessary permissions to perform " +
                                          "this action. Please check your credentials and try again. If you " +
                                          "believe you have received this message in error, " +
                                          "please contact the system administrator for assistance.";

    public InsufficientPrivilegeException()
        : this(DefaultMessage)
    {
    }

    public InsufficientPrivilegeException(string message)
        : base(message ?? DefaultMessage)
    {
    }

    public InsufficientPrivilegeException(string message, Exception inner)
        : base(message ?? DefaultMessage, inner)
    {
    }
}