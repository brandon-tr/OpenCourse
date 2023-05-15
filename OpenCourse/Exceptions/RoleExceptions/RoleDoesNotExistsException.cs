namespace OpenCourse.Exceptions;

public class RoleDoesNotExistException : Exception
{
    private const string DefaultMessage =
        "Sorry, the role you entered does not match any role in our system. Please check the role or create a new.";

    public RoleDoesNotExistException() : this(DefaultMessage)
    {
    }

    public RoleDoesNotExistException(string message) : base(message ?? DefaultMessage)
    {
    }

    public RoleDoesNotExistException(string message, Exception inner) : base(message ?? DefaultMessage, inner)
    {
    }
}