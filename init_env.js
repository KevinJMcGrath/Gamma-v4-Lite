const fs = require('fs')

const args = process.argv.slice(2)

console.log(args)

let source_env_filename = '.env_dev'

if (args[0] == 'uat' || args[0] == 'staging')
    source_env_filename = '.env_staging'

fs.copyFile(source_env_filename, '.env', (err) => {
    if (err) throw err;

    console.log(source_env_filename + ' copied to .env')
})