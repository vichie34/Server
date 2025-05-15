// server/index.js
require('dotenv').config(); // Add this at the top of server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const createEngine = require('./rpcEngine');

const app = express();
const PORT = 3001;

const engine = createEngine();

app.use(bodyParser.json());

// POST /rpc - send JSON-RPC requests
app.get('/', (req, res) => {
    res.send('✅ Backend is running!');
});

app.post('/rpc', (req, res) => {
    engine.handle(req.body, (err, result) => {
        if (err) {
            console.error("RPC Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 RPC server listening at http://localhost:${PORT}`);
});
