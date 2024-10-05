const { MongoClient } = require('mongodb');

// MongoDB connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'myDatabase';

// MongoClient options with useUnifiedTopology to prevent deprecation warnings
const client = new MongoClient(url, { useUnifiedTopology: true });

// Get the command-line arguments
const args = process.argv.slice(2); // Slice to skip node and script path

// Check if the user provided an argument
if (args.length === 0) {
    console.log("Please provide an argument.");
    process.exit(1); // Exit with an error code
}

// Get the first argument (your input string)
const inputString = args[0];


const matchCriteria = { inputString };


async function main() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected successfully to MongoDB");

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection('myCollection');

        // Check if the collection contains any documents
        const documentCount = await collection.countDocuments();
        if (documentCount === 0) {
            console.log("Collection is empty, inserting sample data...");

            // Insert sample data into the collection
            const sampleData = [
                { name: "John Doe", status: "active", age: 28 },
                { name: "Jane Smith", status: "inactive", age: 34 },
                { name: "Alice Johnson", status: "active", age: 25 },
                { name: "Bob Brown", status: "active", age: 42 }
            ];

            await collection.insertMany(sampleData);
            console.log("Sample data inserted.");
        } 

        // Aggregation pipeline using $match
        const pipeline = [
            { $match: matchCriteria }
        ];

        // Run the aggregation pipeline
        const results = await collection.aggregate(pipeline).toArray();

        // Log the matched documents
        console.log("Matched documents:", results);
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
}

main();
