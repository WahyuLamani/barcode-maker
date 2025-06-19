const WebSocket = require("ws");
const { exec } = require("child_process");
const fs = require("fs");

const wss = new WebSocket.Server({ port: 6025 });
// const PRINTER_NAME = "ZDesigner ZD220-203dpi ZPL"; // Ganti dengan nama printer kamu
const PRINTER_NAME = "zebra";

wss.on("connection", function connection(ws) {
  console.log("Printer connected!");

  ws.on("message", function incoming(message) {
    console.log("Received:", message);

    try {
      const data = JSON.parse(message);
      const zplCommand = data.data;

      const filename = "print.zpl";
      fs.writeFileSync(filename, zplCommand);

      // Perintah cetak via lpr
      const printCommand = `lpr -S localhost -P "${PRINTER_NAME}" ${filename}`;

      exec(printCommand, (err, stdout, stderr) => {
        if (err) {
          console.error(`Print error: ${err}`);
          ws.send(JSON.stringify({ status: "error", message: err.message }));
        } else {
          console.log("Printed successfully.");
          ws.send(JSON.stringify({ status: "success" }));
        }
      });
    } catch (e) {
      console.error("Invalid message format", e);
      ws.send(
        JSON.stringify({ status: "error", message: "Invalid JSON format" })
      );
    }
  });
});
