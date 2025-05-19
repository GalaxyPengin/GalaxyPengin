// server.js
import express from 'express'
import fs from 'fs'
import path from 'path'

const app = express()
app.set('trust proxy', true)            // so req.ip is real client IP
const DATA = path.resolve('visitors.json')

// bootstrap storage
let store = { ips: [], count: 0 }
if (fs.existsSync(DATA)) {
  store = JSON.parse(fs.readFileSync(DATA, 'utf-8'))
}

// on each hit, check IP, persist if new
app.get('/api/visitors', (req, res) => {
  const ip = req.ip
  if (!store.ips.includes(ip)) {
    store.ips.push(ip)
    store.count++
    fs.writeFileSync(DATA, JSON.stringify(store), 'utf-8')
  }
  res.json({ count: store.count })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on ${port}`))
