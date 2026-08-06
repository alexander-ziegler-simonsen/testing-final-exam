FROM mcr.microsoft.com/dotnet/sdk:10.0 as build
WORKDIR /src

COPY *.csproj ./
RUN dotnet restore hospitalApi.csproj

COPY . .
RUN dotnet publish hospitalApi.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 as runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:5028

CMD ["dotnet", "hospitalApi.dll"]
