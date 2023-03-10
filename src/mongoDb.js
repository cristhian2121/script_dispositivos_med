const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = process.env.MONGO_DB
console.log('uri: ', uri);
  
let client;
let dispositivosMedicos;
async function run() {
  try {
    if(!client) {
      client = new MongoClient(uri);
    }
    return client;
  } catch (err) {
    console.log('err: ', err);
    await client.close()
  }
}

module.exports = run