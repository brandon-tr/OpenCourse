using System.Net.WebSockets;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using OpenCourse.Data;
using OpenCourse.Model;

namespace OpenCourse.Services;

public class WebSocketService
{
    private readonly OpenCourseContext _context;

    public WebSocketService(OpenCourseContext context)
    {
        _context = context;
    }

    public async Task AddSocket(WebSocket socket, HttpContext httpContext)
    {
        var id = httpContext.User.Claims.FirstOrDefault(cl => cl.Type == ClaimTypes.NameIdentifier).Value;
        //Check if user is already connected
        var checker = await _context.ConnectedClients.FirstOrDefaultAsync(cc => cc.UserId.Equals(id))
            .ConfigureAwait(false);
        if (checker != null) return;

        // Save to database
        var connection = new ConnectedClients
        {
            UserId = id
        };

        try
        {
            await _context.ConnectedClients.AddAsync(connection).ConfigureAwait(false);
            await _context.SaveChangesAsync().ConfigureAwait(false);
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    public async Task RemoveSocket(HttpContext httpContext, WebSocket socket)
    {
        var id = int.Parse(httpContext.User.Claims.FirstOrDefault(cl => cl.Type == ClaimTypes.NameIdentifier).Value);
        await socket.CloseAsync(WebSocketCloseStatus.NormalClosure,
            "Closed by the WebSocketService",
            CancellationToken.None);

        // Remove from database
        var connection = await _context.ConnectedClients.FirstOrDefaultAsync(us => us.UserId.Equals(id))
            .ConfigureAwait(false);
        if (connection != null)
        {
            _context.ConnectedClients.Remove(connection);
            await _context.SaveChangesAsync().ConfigureAwait(false);
        }
    }

    public async Task UpdateFailedPong(HttpContext httpContext, WebSocket socket)
    {
        var id = int.Parse(httpContext.User.Claims.FirstOrDefault(cl => cl.Type == ClaimTypes.NameIdentifier).Value);
        await socket.CloseAsync(WebSocketCloseStatus.NormalClosure,
            "Closed by the WebSocketService",
            CancellationToken.None);

        var user = await _context.ConnectedClients.FirstOrDefaultAsync(user => user.UserId.Equals(id))
            .ConfigureAwait(false);
        if (user != null)
        {
            user.FailedPong++;
            await _context.SaveChangesAsync().ConfigureAwait(false);
        }
    }

    public async Task ResetPong(HttpContext httpContext, WebSocket socket)
    {
        var id = int.Parse(httpContext.User.Claims.FirstOrDefault(cl => cl.Type == ClaimTypes.NameIdentifier).Value);
        await socket.CloseAsync(WebSocketCloseStatus.NormalClosure,
            "Closed by the WebSocketService",
            CancellationToken.None);

        var user = await _context.ConnectedClients.FirstOrDefaultAsync(user => user.UserId.Equals(id))
            .ConfigureAwait(false);
        if (user != null)
        {
            if (user.FailedPong == 0) return;
            user.FailedPong = 0;
            await _context.SaveChangesAsync().ConfigureAwait(false);
        }
    }
}
