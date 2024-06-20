const fs = require('node:fs')

console.log('Leyendo el primer archivo...') // < Sync
fs.readFile('./archivo2.txt', 'utf-8', (err, text) => { // < Async
  if (err) {
    return
  }
  console.log('primer texto:', text)
})

console.log('--> Hacer cosas mientras lee el archivo...') // < Sync

console.log('Leyendo el segundo archivo...') // < Sync
fs.readFile('./archivo.txt', 'utf-8', (err, text) => { // < Async
  if (err) {
    return
  }
  console.log('segundo texto:', text)
})
