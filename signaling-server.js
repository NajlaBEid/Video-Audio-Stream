
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9003 });

let clients = {}; 

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    const clientId = Math.random().toString(36).substring(2, 15);
    clients[clientId] = ws;

    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);

            data.clientId = clientId;

            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Error parsing JSON message:', error);
        }
    });

    ws.on('close', () => {
        delete clients[clientId];
    });
});
