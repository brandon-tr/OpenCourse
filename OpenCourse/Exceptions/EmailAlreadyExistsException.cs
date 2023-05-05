namespace OpenCourse.Exceptions;

public class EmailAlreadyExistsException : Exception
{
    private const string DefaultMessage =
        "Sorry, the email you entered is already registered in our system. " +
        "Please try logging in or use a different email address to create a new account.";

    public EmailAlreadyExistsException() : this(DefaultMessage)
    {
    }

    public EmailAlreadyExistsException(string message) : base(message ?? DefaultMessage)
    {
    }

    public EmailAlreadyExistsException(string message, Exception inner) : base(message ?? DefaultMessage, inner)
    {
    }
}
