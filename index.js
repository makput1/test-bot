const { makeWASocket, useSingleFileAuthState, makeInMemoryStore } = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal")
const pino = require("pino")

const store = makeInMemoryStore({
  logger: pino().child({level: "silent", stream: "store"})
})
const {state, saveState} = useSingleFileAuthState("./session.json")

const startBot = async () => {
  const sock = await makeWASocket({
    printQRInTerminal: false,
    auth: state
  })


}