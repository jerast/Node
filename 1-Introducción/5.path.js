const path = require('node:path')

// Barra separadora de directorios según SO
console.log(path.sep)

// Unir rutas con path.join
const filePath = path.join('content', 'subfolder', 'file.txt')
console.log(filePath)

// Return last path item
const base = path.basename('/tmp/secret-files/password.txt')
console.log(base)

// Return last path item, removing extension if it is a file
const fileName = path.basename('/tmp/secret-files/password.txt', '.txt')
console.log(fileName)

// Get a file extension
const extension = path.extname('/tmp/files/my.secret.file.avb.txt')
console.log(extension)
