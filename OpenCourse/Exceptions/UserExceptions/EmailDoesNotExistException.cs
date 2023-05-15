namespace OpenCourse.Exceptions;

public class EmailDoesNotExistException : Exception
{
    private const string DefaultMessage = "Sorry, the email you entered does not match any account " +
                                          "in our system. Please check the email address or create a new " +
                                          "account if you haven't already.";

    public EmailDoesNotExistException()
        : this(DefaultMessage)
    {
    }

    public EmailDoesNotExistException(string message)
        : base(message ?? DefaultMessage)
    {
    }

    public EmailDoesNotExistException(string message, Exception inner)
        : base(message ?? DefaultMessage, inner)
    {
    }
}
