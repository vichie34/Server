const { JsonRpcEngine } = require('json-rpc-engine');
const { createAsyncMiddleware } = require('json-rpc-engine');
const fetch = require('node-fetch');

const walletURL = process.env.INFURA_ID;
if (!walletURL) {
    throw new Error("INFURA_ID is not defined in environment variables");
}

const createEngine = () => {
    const engine = new JsonRpcEngine();

    engine.push(createAsyncMiddleware(async (req, res, next) => {
        const response = await fetch(`https://mainnet.infura.io/v3/${walletURL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
        });

        const json = await response.json();
        Object.assign(res, json);
        next();
    }));

    return engine;
};

module.exports = createEngine;
