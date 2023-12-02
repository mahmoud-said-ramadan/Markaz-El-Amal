import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import express from 'express'
import initApp from './src/index.router.js'
import { initIo } from './src/utils/server.js'
import http from 'http'
const app = express()
const server = http.createServer(app)
// setup port and the baseUrl
const port = process.env.PORT || 5000
initApp(app ,express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io = initIo(server);
io.on('connection', socket => {
    console.log({ socket: socket.id });
    // socket.on('updateSocketId', async (data) => {
    //     console.log({ userId: data });
    //     await userModel.updateOne({ _id: data.id }, { socketId: socket.id });
    //     socket.emit('updateSocketId', "Done!")
    // });
});