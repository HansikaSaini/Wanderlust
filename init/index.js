const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL ='mongodb://127.0.0.1:27017/wanderlust';
main().then(()=>{
    console.log("Connected to DB");
})
.catch((err) => { console.log(err)});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb =async()=>{
     await Listing.deleteMany({}); //isko humne islye use kia h taki agr db m phle se koi data h to vo delete ho jaee
     initData.data= initData.data.map((obj)=>({...obj , owner:"66a4ece6e814e6fa74b52cbd"}));
     await Listing.insertMany(initData.data); //initdata apne ap m ek object h data js m jisme se humne data key ko access krna h 
     console.log("data was initialised");

};
initDb();