require('dotenv').config()

const { Server, OPEN } = require('ws')
const fetch = require('node-fetch')
const getDifference = require('diff-array-objs')

const ACCESS_TOKEN = process.env.ACCESS_TOKEN,
const COUNT = Number(process.env.COUNT) || 10,
const REFRESH_DELAY = Number(process.env.REFRESH_DELAY) * 1000 || 20000,
const PORT = Number(process.env.PORT) || 3000,
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS !== '*' ? process.env.ALLOWED_ORIGINS.split(',') : '*',
const DEBUG_MODE = process.env.DEBUG_MODE != 1

const log = message => DEBUG_MODE && console.log(`[${new Date().toLocaleString()}] ${message}`, ...arguments)

const server = new Server({
  port: PORT,
  verifyClient: info =>
    ALLOWED_ORIGINS === '*' || ALLOWED_ORIGINS.includes(info.origin)
})

/**
 * Получение фото
 */
const fetchData = () => new Promise((resolve, reject) => {
  log(`Receiving new instagram data`)
  fetch(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${ACCESS_TOKEN}&count=${COUNT}`)
    .then(r => r.json())
    .then((result) => result.meta.code === 200 ? resolve(result.data) : reject(result)
      .catch(reject))
})

let storedData;

(async () => {
  storedData = await fetchData().catch(console.error)
})();

/**
 * Авторефреш и автоотправка новых фото клиентам
 */
const refreshAndSendData = async () => {
  try {
    let data = await fetchData()
    let difference = getDifference(data, storedData, 'id')
    if (difference.added.length || difference.removed.length) {
      log(`Sending the changes to all my clients!`)
      server.clients.forEach(client =>
        client.readyState === OPEN && client.send(JSON.stringify(data))
      )
    } else {
      log(`No changes at all!`)
    }
    storedData = [...data]
  } catch (error) {
    console.error(error)
  }
}

server.on('connection', async ws => {
  ws.send(JSON.stringify(storedData))
  ws
    .on('error', console.error)
    .on('message', message => {
      log(message)
      ws.send(JSON.stringify(storedData))
    })
})

setInterval(refreshAndSendData, REFRESH_DELAY)
