// Show Databases
// show dbs
db // prints the current database

// Switch Database
use <database_name>

// Show Collections
// show collections



// CRUD Operations

// Create
db.user.insertOne({name: "Max"})
db.user.insertMany([{name: "Max"}, {name:"Alex"}]) // Insert multiple documents
db.user.insertOne({date: ISODate()}) // Insert a document with the current date
db.user.insertOne({name: "Max"}, {"writeConcern": {"w": "majority", "wtimeout": 5000}}) // Set write concern

// Read
db.user.findOne() // Find a single document
db.user.find()    // Find all documents
db.user.find().pretty() // Find all documents and display them in a pretty format
db.user.find({name: "Max", age: 32}) // Find documents with specific conditions
db.user.find({date: ISODate("2020-09-25T13:57:17.180Z")}) // Find documents by date
db.user.find({name: "Max", age: 32}).explain("executionStats") // Explain the query execution plan
db.user.distinct("name") // Find distinct values for a field

// Count
db.user.countDocuments({age: 32}) // Count documents matching a condition
db.user.estimatedDocumentCount()  // Estimate the number of documents in the collection

// Comparison
db.user.find({"year": {$gt: 1970}}) // Find documents where "year" is greater than 1970
db.user.find({"year": {$gte: 1970}}) // Find documents where "year" is greater than or equal to 1970
db.user.find({"year": {$lt: 1970}}) // Find documents where "year" is less than 1970
db.user.find({"year": {$lte: 1970}}) // Find documents where "year" is less than or equal to 1970
db.user.find({"year": {$ne: 1970}}) // Find documents where "year" is not equal to 1970
db.user.find({"year": {$in: [1958, 1959]}}) // Find documents where "year" is in the specified array
db.user.find({"year": {$nin: [1958, 1959]}}) // Find documents where "year" is not in the specified array

// Logical
db.user.find({name:{$not: {$eq: "Max"}}}) // Find documents where "name" is not "Max"
db.user.find({$or: [{"year" : 1958}, {"year" : 1959}]}) // Find documents matching any of the conditions in $or
db.user.find({$nor: [{price: 1.99}, {sale: true}]}) // Find documents not matching any of the conditions in $nor
db.user.find({$and: [{qty: {$lt :10}}, {qty :{$gt: 50}}, {sale: true}, {price: {$lt: 5 }}]}) // Find documents matching all conditions in $and

// Element
db.user.find({name: {$exists: true}}) // Find documents where "name" field exists
db.user.find({"zipCode": {$type: 2 }}) // Find documents where "zipCode" field type is 2 (String)
db.user.find({"zipCode": {$type: "string"}}) // Find documents where "zipCode" field type is "string"

// Aggregation Pipeline
db.user.aggregate([
  {$match: {status: "A"}}, // Filter documents by status
  {$group: {_id: "$cust_id", total: {$sum: "$amount"}}}, // Group documents and calculate total amount
  {$sort: {total: -1}} // Sort documents by total amount in descending order
])

// Text search with a "text" index
db.user.find({$text: {$search: "cake"}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}) // Perform text search and sort by text score

// Regex
db.user.find({name: /^Max/})   // Find documents where "name" starts with "Max"
db.user.find({name: /^Max$/i}) // Find documents where "name" is "Max" (case insensitive)

// Array
db.user.find({tags: {$all: ["Realm", "Charts"]}}) // Find documents with all specified tags
db.user.find({field: {$size: 2}}) // Find documents where "field" array size is 2
db.user.find({results: {$elemMatch: {product: "xyz", score: {$gte: 8}}}}) // Find documents matching nested array elements

// Projections
db.user.find({"x": 1}, {"actors": 1})               // Include "actors" field with "_id" field
db.user.find({"x": 1}, {"actors": 1, "_id": 0})     // Include "actors" field without "_id" field
db.user.find({"x": 1}, {"actors": 0, "summary": 0}) // Exclude "actors" and "summary" fields

// Sort, skip, limit
db.user.find({}).sort({"year": 1, "rating": -1}).skip(10).limit(3) // Sort, skip, and limit results

// Read Concern
db.user.find().readConcern("majority") // Specify read concern

// Update

// UpdateOne
db.user.updateOne({"_id": 1}, {$set: {"year": 2016, name: "Max"}}) // Update a single document
db.user.updateOne({"_id": 1}, {$unset: {"year": 1}}) // Remove a field from a document
db.user.updateOne({"_id": 1}, {$rename: {"year": "date"} }) // Rename a field in a document
db.user.updateOne({"_id": 1}, {$inc: {"year": 5}}) // Increment a numeric field
db.user.updateOne({"_id": 1}, {$mul: {price: NumberDecimal("1.25"), qty: 2}}) // Multiply numeric fields
db.user.updateOne({"_id": 1}, {$min: {"imdb": 5}}) // Set a field to the minimum value
db.user.updateOne({"_id": 1}, {$max: {"imdb": 8}}) // Set a field to the maximum value
db.user.updateOne({"_id": 1}, {$currentDate: {"lastModified": true}}) // Set a field to the current date
db.user.updateOne({"_id": 1}, {$currentDate: {"lastModified": {$type: "timestamp"}}}) // Set a field to the current timestamp

// Array Operations
db.user.updateOne({"_id": 1}, {$push :{"array": 1}}) // Add an element to an array
db.user.updateOne({"_id": 1}, {$pull :{"array": 1}}) // Remove an element from an array
db.user.updateOne({"_id": 1}, {$addToSet :{"array": 2}}) // Add an element to an array if it doesn't already exist
db.user.updateOne({"_id": 1}, {$pop: {"array": 1}})  // Remove the last element from an array
db.user.updateOne({"_id": 1}, {$pop: {"array": -1}}) // Remove the first element from an array
db.user.updateOne({"_id": 1}, {$pullAll: {"array" :[3, 4, 5]}}) // Remove multiple elements from an array
db.user.updateOne({"_id": 1}, {$push: {"scores": {$each: [90, 92]}}}) // Add multiple elements to an array
db.user.updateOne({"_id": 2}, {$push: {"scores": {$each: [40, 60], $sort: 1}}}) // Add elements to an array and sort it

// FindOneAndUpdate
db.user.findOneAndUpdate({"name": "Max"}, {$inc: {"points": 5}}, {returnNewDocument: true}) // Find a document, update it, and return the new version

// Upsert
db.user.updateOne({"_id": 1}, {$set: {item: "apple"}, $setOnInsert: {defaultQty: 100}}, {upsert: true}) // Update a document if it exists, otherwise insert a new one

// Replace
db.user.replaceOne({"name": "Max"}, {"firstname": "Maxime", "surname": "Beugnet"}) // Replace a document with a new one

// Write concern
db.user.updateMany({}, {$set: {"x": 1}}, {"writeConcern": {"w": "majority", "wtimeout": 5000}}) // Specify write concern for an update operation

// Delete
db.user.deleteOne({name: "Max"}) // Delete a single document
db.user.deleteMany({name: "Max"}, {"writeConcern": {"w": "majority", "wtimeout": 5000}}) // Delete multiple documents
db.user.deleteMany({}) // Delete all documents in the collection
db.user.findOneAndDelete({"name": "Max"}) // Find a document, delete it, and return the deleted version

// Databases and Collections

// Drop
db.user.drop()    // Remove the collection and its index definitions
db.dropDatabase() // Delete the current database

// Create Collection
db.createCollection("user", {
   validator: {$jsonSchema: {
      bsonType: "object",
      required: ["phone"],
      properties: {
         phone: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         email: {
            bsonType: "string",
            pattern: "@mongodb\.com$",
            description: "must be a string and match the regular expression pattern"
         },
         status: {
            enum: [ "Unknown", "Incomplete" ],
            description: "can only be one of the enum values"
         }
      }
   }}
})
