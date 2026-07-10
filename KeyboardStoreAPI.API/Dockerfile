FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["KeyboardStoreAPI.API/KeyboardStoreAPI.API.csproj", "KeyboardStoreAPI.API/"]
RUN dotnet restore "KeyboardStoreAPI.API/KeyboardStoreAPI.API.csproj"

COPY KeyboardStoreAPI.API/ KeyboardStoreAPI.API/

WORKDIR /src/KeyboardStoreAPI.API

RUN dotnet publish \
    "KeyboardStoreAPI.API.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet","KeyboardStoreAPI.API.dll"]