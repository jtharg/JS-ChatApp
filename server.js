const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Store connected clients
const clients = [];

console.log("Server is running...");

wss.on('connection', (ws) => {
  let clientName = null; // Initialize client name

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    if (!clientName) {
      // Set the client name if it hasn't been set yet
      clientName = message;
      console.log(`Client connected: ${clientName}`);
      broadcast(`${clientName} has connected.`, ws);
    } else {
      // Broadcast the message to all connected clients except the sender
      broadcast(`${clientName}: ${message}`, ws, true);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    if (clientName) {
      console.log(`Client disconnected: ${clientName}`);
      broadcast(`${clientName} has disconnected.`, ws);
    }
  });

  // Helper function to broadcast a message to all connected clients except the sender
  function broadcast(message, sender, excludeSenderName) {
    clients.forEach((client) => {
      if (client !== sender) {
        if (excludeSenderName) {
          client.send(message.substring(clientName.length + 2));
        } else {
          client.send(message);
        }
      }
    });
  }

  // Add new client to the list
  clients.push(ws);
});

process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    const disconnectMessage = 'Server is shutting down.';
  
    // Send disconnect message to all clients
    clients.forEach((client) => {
      client.send(disconnectMessage);
      client.close();
    });
  
    process.exit();
  });
  
  
  
  
  
  
