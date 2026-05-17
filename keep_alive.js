const https = require('https');
const path = require('path');
const fs = require('fs');

// Intentar leer las variables de entorno de .env.local
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
    const lines = envFile.split('\n');
    lines.forEach(line => {
        if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
        if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
    });
} catch (e) {
    console.error('No se pudo leer .env.local. Asegúrate de que existe.');
    process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan credenciales de Supabase.');
    process.exit(1);
}

// Configurar la petición HTTP
const options = {
    hostname: supabaseUrl.replace('https://', '').replace('/', ''),
    path: '/rest/v1/paises?limit=1', // Una petición muy ligera a la tabla de paises
    method: 'GET',
    headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
    }
};

console.log('Enviando ping a Supabase para mantenerla activa...');

const req = https.request(options, res => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`✅ Éxito! Supabase ping status: ${res.statusCode}`);
        console.log(`Hora: ${new Date().toLocaleString()}`);
    } else {
        console.log(`⚠️ Advertencia: Status ${res.statusCode}`);
    }
});

req.on('error', error => {
    console.error('❌ Error al hacer el ping:', error);
});

req.end();
