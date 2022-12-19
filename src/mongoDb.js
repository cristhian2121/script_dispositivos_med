const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = process.env.MONGO_DB
  
let client;
let dispositivosMedicos;
async function run() {
  try {
    if(!client) {
      client = new MongoClient(uri);
      console.log("*New client*");
    }
    return client;

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await dispositivosMedicos.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    console.log("priii");
    // await client.close();
  }
}

module.exports = run