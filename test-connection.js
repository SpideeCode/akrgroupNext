
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local manually
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/"/g, '').trim();
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/"/g, '').trim();

console.log('Testing connection to:', supabaseUrl);
console.log('Using Key (first 10 chars):', supabaseKey?.substring(0, 10));

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('Attempting to fetch a public resource or check health...');
        // We'll just try to get the session to check if the key is accepted (even if no session)
        // Or better, a simple select if we knew a table. But auth.getSession is safe.
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Connection failed with error:', error.message);
            console.error('Full Error:', error);
        } else {
            console.log('Connection successful!');
            console.log('Session data:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
