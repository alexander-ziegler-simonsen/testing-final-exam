# to build
dotnet run build

# to run 
dotnet run

# to force a new openAPI file - one of the 2
dotnet build --no-incremental
dotnet clean && dotnet build
dotnet clean -p api/hospitalApi.csproj && dotnet build -p api/hospitalApi.csproj


# do this one in the root folder
dotnet clean -p api && dotnet build -p api