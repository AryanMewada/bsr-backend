const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// यह तुम्हारी वेबसाइट को ब्लॉक होने से बचाएगा
app.use(cors());
app.use(express.json());

// तुम्हारा Supabase Connection
const supabaseUrl = 'https://popqfjpredtwtzeennrz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvcHFmanByZWR0d3R6ZWVubnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDU2MDEsImV4cCI6MjA4ODgyMTYwMX0.EEdp_Qr4YsTSNp9zeN5NmWIyRmZBaJ1UNzle48DbmcA';
const supabase = createClient(supabaseUrl, supabaseKey);

// चेक करने के लिए कि सर्वर चल रहा है या नहीं
app.get('/', (req, res) => {
    res.send("BSR Backend is Running Live 24/7! 🚀");
});

// Download Count बढ़ाने का API Route
app.get('/api/increment', async (req, res) => {
    const appName = req.query.app;
    
    if (!appName) {
        return res.status(400).json({ error: "App name is required" });
    }

    try {
        // 1. Database से current count निकालो
        const { data: selectData, error: selectError } = await supabase
            .from('downloads')
            .select('download_count')
            .eq('app_name', appName)
            .single();

        if (selectError || !selectData) {
            return res.status(404).json({ error: "App not found or RLS issue" });
        }

        const newCount = selectData.download_count + 1;
        
        // 2. Count अपडेट करो और कन्फर्मेशन लो
        const { data: updateData, error: updateError } = await supabase
            .from('downloads')
            .update({ download_count: newCount })
            .eq('app_name', appName)
            .select();

        if (updateError) {
            return res.status(500).json({ error: updateError.message });
        }
            
        return res.json({ success: true, newCount: updateData[0].download_count });
        
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
});

// Vercel Serverless के लिए एक्सपोर्ट (यह बहुत ज़रूरी है)
module.exports = app;
