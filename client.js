const WebSocket = require('ws');
const readline = require('readline');

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let name = '';

  console.log("Connection successful! Please type 'exit' when you want to disconnect.")
  rl.question('Enter your name: ', (enteredName) => {
    name = enteredName;
    ws.send(name);

    // Start reading messages from the server
    ws.onmessage = (message) => {
      const data = message.data.toString();
      console.log(data);
      if (data === "Server is shutting down."){
        rl.close();
      }
    };

    // Continuously read user input and send messages to the server
    rl.setPrompt('');
    rl.prompt();
    rl.on('line', (input) => {
      if (input === 'exit') {
        rl.close();
      } else {
        ws.send(`${name}: ${input}`);
        console.log(`Me: ${input}`)
        rl.prompt();
      }
    });

    rl.on('close', () => {
      console.log('Connection closed.');
      process.exit(0);
    });
  });
};
