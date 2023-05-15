namespace OpenCourse.Exceptions;

public class UserNotFoundException : Exception
{
    private const string DefaultMessage = "Sorry, the user account you are trying to access does not exist in our " +
                                          "system. Please check the username or email address you entered or " +
                                          "create a new account if you haven't already.";

    public UserNotFoundException()
        : this(DefaultMessage)
    {
    }

    public UserNotFoundException(string message)
        : base(message ?? DefaultMessage)
    {
    }

    public UserNotFoundException(string message, Exception inner)
        : base(message ?? DefaultMessage, inner)
    {
    }
}
