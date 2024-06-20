const fs = require('node:fs/promises')
const path = require('node:path')
const pc = require('picocolors')

const folder = process.argv[2] ?? '.'

async function ls(folder) {
  let files
  try {
    files = await fs.readdir(folder)
  } catch (error) {
    console.error(pc.red(`No se pudo leer el directorio ${folder}`))
    process.exit(1)
  }

  const filePromises = files.map(async file => {
    const filePath = path.join(folder, file)

    let stats
    try {
      stats = await fs.stat(filePath)
    } catch (error) {
      console.error(pc.red(`No se pudo leer el archivo ${filePath}`))
    }

    const isDirectory = stats.isDirectory()
    const fileType = isDirectory ? 'd' : 'f'
    const fileSize = stats.size
    const fileModified = stats.mtime.toLocaleString()

    // return {
    //    'type': fileType,
    //    'name': file,
    //    'size': fileSize,
    //    'last modified': fileModified,
    // }
    return `${pc.white(fileType)} ${pc.blue(file.slice(-25).padEnd(25))} ${pc.green(fileSize.toString().padStart(10))} ${pc.yellow(fileModified)}`
  })

  const filesInfo = await Promise.all(filePromises)

  filesInfo.forEach(file => console.log(file))
  // console.table(filesInfo)
}

ls(folder)

// fs.readdir(folder)
//    .then(files => {
//       files.forEach(file => {
//          const filePath = path.join(folder, file)

//          fs.stat(filePath)
//       })
//    })
//    .catch(error => {
//       if (error) {
//          console.log('Error al leer el directorio: ', error)
//          return;
//       }
//    })
