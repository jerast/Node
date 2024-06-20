const process = require('node:process')

// argumentos de entrada
console.log(process.argv)

// podemos controlar eventos del proceso
process.on('exit', () => {
  // limpiar los recursos...
  console.log('bye')
})

// current working directory
console.log(process.cwd())

// obtener variables de entorno
console.log(process.env.PEPITO)

// controlar el proceso y su salida
process.exit()
