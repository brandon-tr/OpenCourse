namespace OpenCourse.Exceptions;

public class WrongPasswordException : Exception
{
    private const string DefaultMessage =
        "Sorry, the password you entered is incorrect. Please check your password and try again. " +
        "If you have forgotten your password, you can reset it using the 'forgot password' link.";

    public WrongPasswordException()
    {
    }

    public WrongPasswordException(string message) : base(message)
    {
    }

    public WrongPasswordException(string message, Exception inner) : base(message, inner)
    {
    }
}
