const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors()); // Ye hamari website ko block hone se bachayega
app.use(express.json());

// Tumhara Supabase Connection
const supabaseUrl = 'https://popqfjpredtwtzeennrz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvcHFmanByZWR0d3R6ZWVubnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDU2MDEsImV4cCI6MjA4ODgyMTYwMX0.EEdp_Qr4YsTSNp9zeN5NmWIyRmZBaJ1UNzle48DbmcA';
const supabase = createClient(supabaseUrl, supabaseKey);

// API Route: Download Count Badhane ke liye
app.get('/api/increment', async (req, res) => {
    const appName = req.query.app;
    
    if (!appName) {
        return res.status(400).json({ error: "App name is required" });
    }

    try {
        // 1. Current count nikalo
        const { data, error } = await supabase
            .from('downloads')
            .select('download_count')
            .eq('app_name', appName)
            .single();

        if (data) {
            const newCount = data.download_count + 1;
            
            // 2. Count update karo
            await supabase
                .from('downloads')
                .update({ download_count: newCount })
                .eq('app_name', appName);
                
            return res.json({ success: true, newCount: newCount });
        } else {
            return res.status(404).json({ error: "App not found in database" });
        }
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
});

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`BSR Backend is running on port ${PORT} 🚀`);
});
