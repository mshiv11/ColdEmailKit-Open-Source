import fs from 'fs';
import fs from 'fs';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n').filter(line => line.includes('SUPABASE'));
    fs.writeFileSync(path.join(process.cwd(), 'scripts', 'env_dump.txt'), lines.join('\n'));
} else {
    console.log(".env file not found");
}
