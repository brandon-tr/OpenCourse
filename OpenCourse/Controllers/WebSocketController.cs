using System.Net.WebSockets;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using OpenCourse.Data;
using OpenCourse.Services;

namespace OpenCourse.Controllers;

[ApiController]
[Route("WebSocket")]
public class WebSocketController : ControllerBase
{
    private readonly OpenCourseContext _context;
    private readonly WebSocketService _webSocketService;

    public WebSocketController(OpenCourseContext context, WebSocketService webSocketService)
    {
        _context = context;
        _webSocketService = webSocketService;
    }

    [Authorize]
    [HttpGet("connected")]
    public async Task Connected()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            var buffer = new ArraySegment<byte>(Encoding.ASCII.GetBytes("ping"));
            while (webSocket.State == WebSocketState.Open)
            {
                await _webSocketService.AddSocket(webSocket, HttpContext);
                var received = await webSocket.ReceiveAsync(buffer, CancellationToken.None);

                if (received.MessageType == WebSocketMessageType.Close)
                    break;
                await webSocket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                await Task.Delay(TimeSpan.FromSeconds(10), CancellationToken.None); // Send a ping every 10 seconds.
            }

            await _webSocketService.RemoveSocket(HttpContext, webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    [Authorize(Roles = "Admin, Moderator")]
    [HttpGet("CountUsers")]
    public async Task CurrentUserCount()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();

            await Task.Run(async () =>
            {
                var receiveBuffer = new byte[1024 * 4];
                while (webSocket.State == WebSocketState.Open)
                {
                    var result =
                        await webSocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer), CancellationToken.None);
                    if (result.MessageType == WebSocketMessageType.Close)
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                    var sendBuffer = Encoding.ASCII.GetBytes(_context.ConnectedClients.Count().ToString());
                    await webSocket.SendAsync(sendBuffer, WebSocketMessageType.Text, WebSocketMessageFlags.EndOfMessage,
                        CancellationToken.None);
                    await Task.Delay(TimeSpan.FromSeconds(10), CancellationToken.None);
                }
            });
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    [HttpGet("ws")]
    public async Task Get()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            var buffer = new byte[4096];
            using var
                cts = new CancellationTokenSource(TimeSpan.FromSeconds(10)); // Set up cancellation after 10 seconds
            var receive = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (webSocket.State == WebSocketState.Open)
            {
                var siteSettings = await _context.SiteSetting.FirstAsync().ConfigureAwait(false);

                var newBuffer = Encoding.ASCII.GetBytes(siteSettings.ToJson());
                await webSocket.SendAsync(new ArraySegment<byte>(newBuffer, 0, receive.Count),
                    WebSocketMessageType.Text, WebSocketMessageFlags.EndOfMessage,
                    CancellationToken.None);

                try
                {
                    receive = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cts.Token);
                }
                catch (OperationCanceledException)
                {
                    // If no response was received within the timeout period, close the connection
                    if (webSocket.State == WebSocketState.Open)
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "No response received",
                            CancellationToken.None);
                    break;
                }
            }

            await webSocket.CloseAsync(
                receive.CloseStatus.Value,
                receive.CloseStatusDescription,
                CancellationToken.None);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
}
