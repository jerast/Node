// A diferencia de CommonJS, ES Modules si permite await directamente en el archivo
// Esto es llamado 'top-level await'

import { readFile } from 'node:fs/promises'

console.log('Leyendo el primer archivo...')
const text = await readFile('./archivo.txt', 'utf-8')
console.log('primer texto:', text)
console.log('--> Hacer cosas mientras lee el archivo...')

console.log('Leyendo el segundo archivo...')
const secondText = await readFile('./archivo2.txt', 'utf-8')
console.log('segundo texto:', secondText)
