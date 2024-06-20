// Esto sólo en los módulos nativos
// que no tienen promesas nativas
const fs = require('node:fs') // a partir de Node 16, se recomienda poner node:
const { promisify } = require('node:util')

const readFilePromise = promisify(fs.readFile)

const text = readFilePromise('./archivo.txt', 'utf-8')
console.log(text)
