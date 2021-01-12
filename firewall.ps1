$cidr_path = './docs/cidr.txt'

$cidr_list = @(Get-Content $cidr_path)

for ($i=0; $i -lt $cidr_list.length; $i++)
{
    gcloud app firewall-rules create $($i + 10) --action=DENY --source-range=$($cidr_list[$i]) --project symphony-gamma-prod
    # Write-Output "$($i) - $($cidr_list[$i])"
}