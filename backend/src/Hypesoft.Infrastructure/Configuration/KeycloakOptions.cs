namespace Hypesoft.Infrastructure.Configuration;

public class KeycloakOptions
{
    public string Url { get; set; } = "http://localhost:8080";
    public string Realm { get; set; } = "hypesoft";
    public string ClientId { get; set; } = "hypesoft-api";
}
