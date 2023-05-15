namespace OpenCourse.Exceptions;

public class RoleExistsException : Exception
{
    private const string DefaultMessage =
        "Failed to create role: The role already exists in the database";

    public RoleExistsException() : this(DefaultMessage)
    {
    }

    public RoleExistsException(string message) : base(message ?? DefaultMessage)
    {
    }

    public RoleExistsException(string message, Exception inner) : base(message ?? DefaultMessage, inner)
    {
    }
}