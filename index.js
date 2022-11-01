const {
  default: makeWASocket,
  fetchLatestBaileysVersion,
  DisconnectReason,
  useMultiFileAuthState,
} = require("@adiwajshing/baileys");
const P = require("pino");
const { unlink } = require("fs");
const fs = require("fs");
const { config } = require("process");

const botUpdate = (botSock) => {
  botSock.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("© BOT-ZDG - Qrcode: ", qr);
    }
    if (connection === "close") {
      const botReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (botReconnect) botConnection();
      console.log(
        `© BOT-ZDG - CONEXÃO FECHADA! RAZÃO: ` +
          DisconnectReason.loggedOut.toString()
      );
      if (botReconnect === false) {
        fs.rmSync("vex", { recursive: true, force: true });
        const removeAuth = "sessions";
        unlink(removeAuth, (err) => {
          if (err) throw err;
        });
      }
    }
    if (connection === "open") {
      console.log("© BOT-ZDG - CONECTADO");
    }
  });
};

const botConnection = async () => {
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState("sessions");
  const config = {
    auth: state,
    logger: P({ level: "error" }),
    printQRInTerminal: true,
    version,
    connectTimeoutMs: 60_000,
    async getMessage(key) {
      return { conversation: "sessions" };
    },
  };
  const botSock = makeWASocket(config, { auth: state });
  botUpdate(botSock.ev);
  botSock.ev.on("creds.update", saveCreds);

  botSock.ev.on("messages.upsert", (m) => {
    console.log(m);
  });
};

botConnection();
