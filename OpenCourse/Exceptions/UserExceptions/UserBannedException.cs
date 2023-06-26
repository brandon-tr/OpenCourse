namespace OpenCourse.Exceptions;

public class UserBannedException : Exception
{
    private const string DefaultMessage = "This user is banned.";

    public UserBannedException() : this(DefaultMessage)
    {
    }

    public UserBannedException(string message) : base(message ?? message)
    {
    }

    public UserBannedException(string message, Exception inner) : base(message ?? DefaultMessage, inner)
    {
    }
}
