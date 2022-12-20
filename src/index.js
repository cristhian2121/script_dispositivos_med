require('dotenv').config()
const fs = require("fs")
const { parse } = require("csv-parse")
const run = require("./mongoDb.js")

const data = []

fs.createReadStream("./src/dispositivosMedicosStent.csv")
  .pipe(parse({ delimiter: ",", columns: true }))
  .on("data", function (row) {
    if(row) {
      data.push(row)
    }
  })
  .on("end", function(){
    updateRow(data)
  })
  .on("error", function (err) {
    console.log(err);
  })

async function updateRow(data) {
  console.log('Total registros a registrar: ', data.length);
  // Add connection
  const client = await run();
  const database = client.db('hisPruebasDb');
  const dispositivosMedicos = database.collection('dispositivosMedicos');
  let notExists = 0
  // recoring connection
  for (let i = 0; i < data.length; i++) {
    if(data[i]._id) {
      const register = await dispositivosMedicos.findOne({ _id: data[i]._id })
      let newDescripcion = ""
      let newPrecioBase = 0
      // update precioVentaBase
      if(data[i].precioVentaBase && (register.precioVentaBase != data[i].precioVentaBase)) {
        newPrecioBase = +data[i].precioVentaBase
      }
      // update descripción
      if(data[i].descripcion && (register.descripcion != data[i].descripcion)) {
        newDescripcion = data[i].descripcion
      }

      if(newDescripcion || newPrecioBase){

        const newDevice = {
          ...register,
          precioVentaBase: newPrecioBase || data[i].precioVentaBase,
          descripcion: newDescripcion || data[i].descripcion
        }

        await dispositivosMedicos.updateOne(
          { _id: data[i]._id },
          { $set: newDevice }
        )
      }

    } else {
      notExists++
      console.log("it's not exits", data[i]._id, data[i].codigo);
    }
  }

  console.log("Total Registered", data.length - notExists)
  console.log("Total no exists", notExists);

  // close connection
  await client.close() 
}

