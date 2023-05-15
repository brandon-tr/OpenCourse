namespace OpenCourse.Exceptions;

public class RoleNotFoundException : Exception
{
    private const string DefaultMessage =
        "The requested role does not exist, please try again with a different parameter";

    public RoleNotFoundException() : this(DefaultMessage)
    {
    }

    public RoleNotFoundException(string message) : base(message ?? DefaultMessage)
    {
    }

    public RoleNotFoundException(string message, Exception inner) : base(message ?? DefaultMessage, inner)
    {
    }
}