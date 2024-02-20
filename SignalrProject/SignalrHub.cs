using Microsoft.AspNetCore.SignalR;
using System.Timers;
using Timer = System.Timers.Timer;

public class SignalrHub : Hub
{
    public async Task NewMessage(string user, string message)
    {
        await Clients.All.SendAsync("messageReceived", user, message);
    }

    // New function to periodically send messages to clients
    public async Task LoginStatus(string message)
    {
        Console.WriteLine(message);
        await Clients.All.SendAsync("loginStatusReceived", "user: RK","2","Internet", "Login Success");
        Console.WriteLine("Logging off automatically in next 15 seconds");
        // Delay 30 Seconds
        await Task.Delay(15000);
        await Clients.All.SendAsync("logoffStatus", "User Logged Out");
        Console.WriteLine("Logged off");
    }

}