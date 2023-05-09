using Microsoft.AspNetCore.Authorization;
using OpenCourse.Exceptions;

public class AnonymousOnlyAuthorizationHandler : AuthorizationHandler<AnonymousOnlyRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
        AnonymousOnlyRequirement requirement)
    {
        if (context.User.Identity?.IsAuthenticated == true) throw new UserAlreadySignedInException();

        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}

public class AnonymousOnlyRequirement : IAuthorizationRequirement
{
}