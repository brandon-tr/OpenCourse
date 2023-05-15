namespace OpenCourse.Exceptions;

public class UserAlreadySignedInException : Exception
{
    private const string DefaultMessage = "Sorry, you are already signed in.";

    public UserAlreadySignedInException()
        : this(DefaultMessage)
    {
    }

    public UserAlreadySignedInException(string message)
        : base(message ?? DefaultMessage)
    {
    }

    public UserAlreadySignedInException(string message, Exception inner)
        : base(message ?? DefaultMessage, inner)
    {
    }
}
