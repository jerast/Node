const process = require('node:process')
const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  switch (req.url) {
    case '/':
      res.end('<h1>Bienvenido a mi página de inicio</h1>')
      break

    case '/image':
      fs.readFile('./image.png', (err, data) => {
        if (err) {
          res.statusCode = 500
          res.end('<h1>Internal Server Error</h1>')
          return
        }

        res.setHeader('Content-Type', 'image/png')
        res.end(data)
      })
      break

    case '/contacto':
      res.end('<h1>Contacto</h1>')
      break

    default:
      res.statusCode = 404 // Not Found
      res.end('404 - Not Found')
      break
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`server listening on port http://localhost:${desiredPort}`)
})

// PORT=4000 node 9.http.js
