const {
  default: makeWASocket,
  useSingleFileAuthState,
  makeInMemoryStore,
} = require("@adiwajshing/baileys");
const pino = require("pino");
const qrcode = require("qrcode-terminal");

const { state, saveState } = useSingleFileAuthState("./session.json");
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

const startBot = async () => {
  const sock = await makeWASocket({
    printQRInTerminal: false,
    auth: state,
  });
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    console.log(connection);
  });
  sock.ev.on("creds.update", saveState);
};

startBot();
