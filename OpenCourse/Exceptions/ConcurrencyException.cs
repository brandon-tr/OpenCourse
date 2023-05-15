namespace OpenCourse.Exceptions;

public class ConcurrencyException : Exception
{
    private const string DefaultMessage =
        "The requested resource has been modified by another user, please try again with a different parameter or " +
        "wait a few seconds and try again";

    public ConcurrencyException() : base(DefaultMessage)
    {
    }

    public ConcurrencyException(string message) : base(message ?? DefaultMessage)
    {
    }
}