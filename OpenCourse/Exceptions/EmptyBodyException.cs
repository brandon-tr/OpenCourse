namespace OpenCourse.Exceptions;

public class EmptyBodyException : Exception
{
    private const string DefaultMessage =
        "The request body is empty, please try again with the required parameters";

    public EmptyBodyException() : base(DefaultMessage)
    {
    }

    public EmptyBodyException(string message) : base(message ?? DefaultMessage)
    {
    }
}