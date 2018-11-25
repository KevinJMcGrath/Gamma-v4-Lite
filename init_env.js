import fs from 'fs';

fs.copyFile('.env_dev', '.env', (err) => {
    if (err) throw err;

    console.log('Pre-dev: .env_dev copied to .env')
})