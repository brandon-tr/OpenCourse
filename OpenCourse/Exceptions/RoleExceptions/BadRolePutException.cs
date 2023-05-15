namespace OpenCourse.Exceptions;

public class BadRolePutException : Exception
{
    private const string DefaultMessage =
        "Failed to update role: The role update request is invalid and or is missing data";

    public BadRolePutException() : this(DefaultMessage)
    {
    }

    public BadRolePutException(string message) : base(message ?? DefaultMessage)
    {
    }

    public BadRolePutException(string message, Exception inner) : base(message ?? DefaultMessage, inner)
    {
    }
}