// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');

//  Connect to your existing BookVerseDB
// Connect using your environment variable
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(" Connected to MongoDB"))
    .catch(err => console.error(" Connection error:", err));


//  Define schema
const authorSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    nationality: String,
    birthYear: Number
}, { collection: 'Authors' }); // Force exact collection name (uppercase)

//  Use the same model name but specify the existing collection
const Author = mongoose.model('Authors', authorSchema);

//  Insert new Indian authors (will add to existing Authors collection)
Author.insertMany([
    { _id: 6, name: "Ravindra Singh", nationality: "Indian", birthYear: 1974 },
    { _id: 7, name: "Durjoy Dutta", nationality: "Indian", birthYear: 1906 }
])
    .then(() => console.log(" New authors inserted into existing 'Authors' collection!"))
    .catch(err => console.error(" Error inserting authors:", err))
    .finally(() => mongoose.connection.close());
