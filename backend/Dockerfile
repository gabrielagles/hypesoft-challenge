FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY src/Hypesoft.sln ./
COPY src/Hypesoft.Domain/Hypesoft.Domain.csproj ./Hypesoft.Domain/
COPY src/Hypesoft.Application/Hypesoft.Application.csproj ./Hypesoft.Application/
COPY src/Hypesoft.Infrastructure/Hypesoft.Infrastructure.csproj ./Hypesoft.Infrastructure/
COPY src/Hypesoft.API/Hypesoft.API.csproj ./Hypesoft.API/

RUN dotnet restore Hypesoft.sln

COPY src/ ./
RUN dotnet build Hypesoft.sln -c Release -o /app/build

FROM build AS publish
RUN dotnet publish Hypesoft.API/Hypesoft.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]
