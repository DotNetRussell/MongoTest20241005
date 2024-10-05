// index.js
const { MongoClient, ObjectId } = require('mongodb');

const args = process.argv.slice(2); // Slice to skip node and script path

// Check if the user provided an argument
if (args.length === 0) {
    console.log("Please provide an argument.");
    process.exit(1); // Exit with an error code
}


// Get the first argument (your input string)
const inputString = args[0];

async function main() {
  const uri = 'mongodb://localhost:27017'; // Connection URI
  const client = new MongoClient(uri, {useUnifiedTopology: true});

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('testdb');
    const usersCollection = db.collection('users');

    // Insert sample data
    await usersCollection.deleteMany({});
    const sampleUsers = [
      { _id: new ObjectId(), name: 'Alice', age: 30 },
      { _id: new ObjectId(), name: 'Bob', age: 25 },
    ];
    await usersCollection.insertMany(sampleUsers);
//    console.log('Sample users inserted.');

//    const maliciousInput = '507f1f77bcf86cd799439011'; // Valid ObjectId string
    const maliciousInput = inputString;
    try {
      // This will throw an exception if the input is invalid
      const userId = ObjectId.createFromHexString(maliciousInput);
      const user = await usersCollection.findOne({ _id: userId });
      console.log('MongoDB Command Executed:', inputString);
    } catch (err) {
      console.error('An error occurred while querying the database:', err.message);
    }
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    // Close the connection
    await client.close();
  }
}

main();
