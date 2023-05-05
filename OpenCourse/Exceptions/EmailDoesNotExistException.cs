namespace OpenCourse.Exceptions;

public class EmailDoesNotExistException : Exception
{
    public EmailDoesNotExistException()
    {
    }

    public EmailDoesNotExistException(string message) : base(message)
    {
    }

    public EmailDoesNotExistException(string message, Exception inner) : base(message, inner)
    {
    }
}