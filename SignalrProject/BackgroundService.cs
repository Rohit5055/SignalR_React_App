using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalrProject
{
    public class BackgroundTaskServices : BackgroundService
    {
        private readonly ILogger<BackgroundService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public BackgroundTaskServices(ILogger<BackgroundService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("BackgroundService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<SignalrHub>>();
                    var random = new Random();
                    bool isEven = random.Next() % 2 == 0;
                   Console.WriteLine(isEven);
                    await hubContext.Clients.All.SendAsync("randomNumberResult", isEven);
                }

                // Wait for 5 seconds before generating the next random number
                await Task.Delay(5000);
            }

            _logger.LogInformation("BackgroundService is stopping.");
        }
    }
}