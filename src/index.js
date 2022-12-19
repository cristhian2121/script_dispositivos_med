require('dotenv').config()
const fs = require("fs")
const { parse } = require("csv-parse")
const run = require("./mongoDb.js")
console.log('run: ', run);

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


const cleanFile = (row) => {
  if (row.precioVentaBase && row.precioVentaBase.includes("parametrizar")){
    return
  }

  if (row["TARIFA SAVIA SALUD"] && row["TARIFA SAVIA SALUD"].includes("parametrizar")){
    return 
  }

  return row
}

async function updateRow(data) {
  console.log('data: ', data.length);
  // Add connection
  const client = await run();
  const database = client.db('hisPruebasDb');
  const dispositivosMedicos = database.collection('dispositivosMedicos');
  let notExists = 0
  // recoring connection
  for (let i = 0; i < data.length; i++) {
    if(data[i]._id) {
      const register = await dispositivosMedicos.findOne({ _id: data[i]._id })
      if(register.precioVentaBase != data[i].precioVentaBase){
        console.log("!=", data[i]._id, data[i].precioVentaBase, register.precioVentaBase);
      }
      // update precioVentaBase
      if(data[i].precioVentaBase) {
        register.precioVentaBase = +data[i].precioVentaBase
      }
      // update descripción
      if(data[i].descripcion) {
        register.descripcion = data[i].descripcion
      }

      if(data[i]._id == "WgzbPtzJXLv368Nok"){
        await dispositivosMedicos.updateOne(
          { _id: data[i]._id },
          { $set: register }
        )
      }

    } else {
      notExists++
      console.log("it's not exits", data[i]._id, data[i].codigo);
    }
  }

  console.log("Total no exists", notExists);

  // close connection
  await client.close() 
}

