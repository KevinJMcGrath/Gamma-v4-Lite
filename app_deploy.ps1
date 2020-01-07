param (
    [Parameter(Mandatory=$true)][string]$deploy_type)

if ($deploy_type.ToLower() -eq 'uat')
{
    $project_name = 'symphony-gamma-poc'
    $env_filename = '.env_uat'
    $app_yaml = 'app_uat.yaml'
}
elseif ($deploy_type.ToLower() -eq 'prod') 
{
    $project_name = 'symphony-gamma-prod'
    $env_filename = '.env_prod'
    $app_yaml = 'app_prod.yaml'
}
else {
    Write-Output "Invalid deployment type"
    exit
}

Write-Output "Replacing .env file..."
Copy-Item -path $env_filename -Destination ".env" -Force

Write-Output "Changing project..."
gcloud app deploy $app_yaml --project $project_name
