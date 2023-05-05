using Bogus;
using OpenCourse.Model;

namespace OpenCourse.Data;

public class UserDataGenerator
{
    public static readonly List<User> Users = new();
    private readonly Faker<User> userModelFake;

    public UserDataGenerator()
    {
        var rand = new Random();

        userModelFake = new Faker<User>()
            .RuleFor(u => u.Id, f => -(f.IndexFaker + 1))
            .RuleFor(u => u.LastLoginIp, f => rand.Next(1, 3) == 1 ? f.Internet.IpAddress() : f.Internet.Ipv6Address())
            .RuleFor(u => u.FirstName, f => f.Person.FirstName)
            .RuleFor(u => u.LastName, f => f.Person.LastName)
            .RuleFor(u => u.Email, f => f.Person.Email)
            .RuleFor(u => u.Password, f => f.Internet.Password())
            .RuleFor(u => u.IsBanned, f => f.Random.Bool())
            .RuleFor(u => u.TimeOut, f => f.Date.Future().ToUniversalTime())
            .RuleFor(u => u.LastLogIn, f => f.Date.Past().ToUniversalTime())
            .RuleFor(u => u.Avatar, f => f.Image.PicsumUrl())
            .RuleFor(u => u.CreatedAt,
                f => rand.Next(1, 3) == 1 ? f.Date.Past().ToUniversalTime() : f.Date.Future().ToUniversalTime())
            .RuleFor(u => u.UpdatedAt,
                f => rand.Next(1, 3) == 1 ? f.Date.Past().ToUniversalTime() : f.Date.Future().ToUniversalTime());
    }

    public List<User> GenerateUsers()
    {
        try
        {
            var users = userModelFake.Generate(1000).ToList();
            return users;
        }
        catch (Exception e)
        {
            Console.WriteLine("An Error Has Occured During Generation of Fake Users");
            Console.WriteLine(e.Message);
            throw;
        }
    }
}