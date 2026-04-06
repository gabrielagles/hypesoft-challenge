using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using Hypesoft.Infrastructure.Configuration;

namespace Hypesoft.Infrastructure.Services;

public interface IJwtService
{
    Task<ClaimsPrincipal?> ValidateTokenAsync(string token);
    Task<string?> GetPublicKeyAsync();
}

public class KeycloakJwtService : IJwtService
{
    private readonly HttpClient _httpClient;
    private readonly KeycloakOptions _options;
    private readonly ILogger<KeycloakJwtService> _logger;

    public KeycloakJwtService(HttpClient httpClient, KeycloakOptions options, ILogger<KeycloakJwtService> logger)
    {
        _httpClient = httpClient;
        _options = options;
        _logger = logger;
    }

    public async Task<ClaimsPrincipal?> ValidateTokenAsync(string token)
    {
        try
        {
            var jwksUri = new Uri($"{_options.Url}/realms/{_options.Realm}/protocol/openid-connect/certs");
            
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            
            var tenant = jwtToken.Audiences.FirstOrDefault() ?? _options.Realm;
            
            var keys = await GetJwksAsync(jwksUri);
            
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuers = new[] { $"{_options.Url}/realms/{_options.Realm}" },
                ValidateAudience = true,
                ValidAudience = _options.ClientId,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(5),
                IssuerSigningKeys = keys
            };

            var principal = handler.ValidateToken(token, validationParameters, out _);
            return principal;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Token validation failed");
            return null;
        }
    }

    public async Task<string?> GetPublicKeyAsync()
    {
        try
        {
            var jwksUri = new Uri($"{_options.Url}/realms/{_options.Realm}/protocol/openid-connect/certs");
            var response = await _httpClient.GetAsync(jwksUri);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch public key from Keycloak");
            return null;
        }
    }

    private async Task<IEnumerable<SecurityKey>> GetJwksAsync(Uri jwksUri)
    {
        var response = await _httpClient.GetAsync(jwksUri);
        var content = await response.Content.ReadAsStringAsync();
        var jwks = JsonDocument.Parse(content);
        
        var keys = new List<SecurityKey>();
        
        if (jwks.RootElement.TryGetProperty("keys", out var keysArray))
        {
            foreach (var key in keysArray.EnumerateArray())
            {
                if (key.TryGetProperty("kty", out var kty) && kty.GetString() == "RSA")
                {
                    if (key.TryGetProperty("n", out var n) && key.TryGetProperty("e", out var e))
                    {
                        var rsaParams = new RSAParameters
                        {
                            Modulus = Base64UrlDecode(n.GetString()!),
                            Exponent = Base64UrlDecode(e.GetString()!)
                        };
                        keys.Add(new RsaSecurityKey(rsaParams));
                    }
                }
            }
        }
        
        return keys;
    }

    private static byte[] Base64UrlDecode(string input)
    {
        var output = input.Replace('-', '+').Replace('_', '/');
        switch (output.Length % 4)
        {
            case 0: break;
            case 2: output += "=="; break;
            case 3: output += "="; break;
            default: throw new ArgumentException("Invalid base64 url string");
        }
        return Convert.FromBase64String(output);
    }
}
