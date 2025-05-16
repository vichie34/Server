const { JsonRpcEngine, createAsyncMiddleware } = require('json-rpc-engine');
const fetch = require('node-fetch');

const infuraProjectId = process.env.INFURA_ID;
if (!infuraProjectId) {
    throw new Error("INFURA_ID is not defined in environment variables");
}

const createEngine = () => {
    const engine = new JsonRpcEngine();

    engine.push(createAsyncMiddleware(async (req, res) => {
        try {
            const response = await fetch(`https://mainnet.infura.io/v3/${infuraProjectId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req),
            });

            const json = await response.json();
            Object.assign(res, json);
        } catch (error) {
            res.error = {
                code: -32603,
                message: "Internal error: failed to fetch from Infura",
                data: error.message,
            };
        }
    }));

    return engine;
};

module.exports = createEngine;
