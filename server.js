const WebSocket = require('ws')
const fetch = require('node-fetch')
const config = require('./config')
const getDifference = require('diff-array-objs')

const server = new WebSocket.Server({
  port: config.PORT,
  verifyClient: info =>
    config.ALLOWED_ORIGINS === '*' || config.ALLOWED_ORIGINS.includes(info.origin)
})

/**
 * Получение фото
 */
const fetchData = () =>
  new Promise ((resolve, reject) => {
    console.log(`[${new Date().toLocaleString()}] Receiving new instagram data`)
    let url = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${config.ACCESS_TOKEN}&count=${config.COUNT}`
    fetch(url)
      .then(r => r.json())
      .then(result => {
        if (result.meta.code === 200) {
          resolve(result.data)
        } else {
          reject(result)
        }
      }).catch(reject)
  })

let storedData

;(async () => {
  storedData = await fetchData().catch(console.error)
})()

/**
 * Авторефреш и автоотправка новых фото клиентам
 */
const refreshAndSendData = async () => {
  try {
    let data = await fetchData()
    let difference = getDifference(data, storedData, 'id')
    if (difference.added.length || difference.removed.length) {
      console.log(`[${new Date().toLocaleString()}] Sending the changes to all my clients!`)
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data))
        }
      })
    } else {
      console.log(`[${new Date().toLocaleString()}] No changes at all!`)
    }
    storedData = data
  } catch (error) {
    console.error(error)
  }
}

server.on('connection', async (ws, req) => {
  ws.send(JSON.stringify(storedData))
  ws
    .on('error', console.error)
    .on('message', message => {
      console.log(message)
      ws.send(JSON.stringify(storedData))
    })
})


setInterval(refreshAndSendData, config.REFRESH_DELAY)
