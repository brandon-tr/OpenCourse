namespace OpenCourse.Exceptions;

public class DatabaseFailedConnectionException : Exception
{
    private const string DefaultMessage =
        "Failed to connect to the database, please try again later";

    public DatabaseFailedConnectionException() : base(DefaultMessage)
    {
    }

    public DatabaseFailedConnectionException(string message) : base(message ?? DefaultMessage)
    {
    }
}