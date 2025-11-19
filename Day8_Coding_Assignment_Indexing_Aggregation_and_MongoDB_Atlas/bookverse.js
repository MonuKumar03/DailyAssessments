/*
====================================================================
            userstory1 - Indexing & Query Optimization
====================================================================
*/

/*
    1. Pick frequently queried fields
    Typical: genre, authorId, ratings.score.
*/


//  2. Show an example query and explain("executionStats") before creating indexes

//  Example query that will be optimized
const query = { genre: "Fantasy" }

//  Explain before index
db.Books.find(query).explain("executionStats")

//  Note: Check executionStats.executionTimeMillis and executionStats.totalKeysExamined / totalDocsExamined.


//  3. Create indexes

//  Index on genre
db.Books.createIndex({ genre: 1 }, { name: "idx_genre_1" })

//  Index on authorId
db.Books.createIndex({ authorId: 1 }, { name: "idx_authorId_1" })

//  Index on ratings.score (array field index)
db.Books.createIndex({ "ratings.score": 1 }, { name: "idx_ratings_score_1" })


//  4. Run the same explain after creating indexes and compare

//  After index
db.Books.find(query).explain("executionStats")

//  What to compare: executionTimeMillis and number of documents/keys examined — should be lower after index.


//  5. Drop an unnecessary index and measure effect

//  Drop index by name
db.Books.dropIndex("idx_ratings_score_1")

//  Re-run explain for a query that previously used it
db.Books.find({ "ratings.score": { $gt: 4 } }).explain("executionStats")

//  Note: Dropping may increase executionTimeMillis for queries that used that index.


/*
======================================================================
            userstory2 - Aggregation Framework
=====================================================================
*/

//  1. Average rating per book
db.Books.aggregate([
    { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true } },
    {
        $group: {
            _id: { bookId: "$_id", title: "$title" },
            avgRating: { $avg: "$ratings.score" },
            ratingCount: { $sum: { $cond: [{ $ifNull: ["$ratings.score", false] }, 1, 0] } }
        }
    },
    { $project: { _id: 0, bookId: "$_id.bookId", title: "$_id.title", avgRating: { $round: ["$avgRating", 2] }, ratingCount: 1 } },
    { $sort: { avgRating: -1 } }
])


//  2. Top 3 highest-rated books
db.Books.aggregate([
    { $unwind: "$ratings" },
    { $group: { _id: { id: "$_id", title: "$title" }, avgRating: { $avg: "$ratings.score" } } },
    { $project: { _id: 0, bookId: "$_id.id", title: "$_id.title", avgRating: { $round: ["$avgRating", 2] } } },
    { $sort: { avgRating: -1 } },
    { $limit: 3 }
])


//  3. Count number of books published per genre
db.Books.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $project: { _id: 0, genre: "$_id", count: 1 } },
    { $sort: { count: -1 } }
])


//  4. Find authors who have more than 2 books published
db.Books.aggregate([
    { $group: { _id: "$authorId", booksCount: { $sum: 1 } } },
    { $match: { booksCount: { $gt: 2 } } },
    {
        $lookup: {
            from: "Authors",
            localField: "_id",
            foreignField: "_id",
            as: "author"
        }
    },
    { $unwind: "$author" },
    { $project: { _id: 0, authorId: "$_id", authorName: "$author.name", booksCount: 1 } }
])


//  5. Display total reward points (sum of all ratings) received by each author
db.Books.aggregate([
    { $unwind: "$ratings" },
    {
        $group: {
            _id: "$authorId",
            totalPoints: { $sum: "$ratings.score" },
            avgRating: { $avg: "$ratings.score" },
            ratingCount: { $sum: 1 }
        }
    },
    {
        $lookup: {
            from: "Authors",
            localField: "_id",
            foreignField: "_id",
            as: "author"
        }
    },
    { $unwind: "$author" },
    { $project: { _id: 0, authorId: "$_id", authorName: "$author.name", totalPoints: 1, avgRating: { $round: ["$avgRating", 2] }, ratingCount: 1 } },
    { $sort: { totalPoints: -1 } }
])



db.Books.createIndex({ genre: 1, publicationYear: -1 }, { name: "idx_genre_pubYear_compound" })


/*
======================================================================
            bonus challenge
=====================================================================
*/

//  1. Create a compound index { genre: 1, publicationYear: -1 } and analyze
db.Books.createIndex({ genre: 1, publicationYear: -1 }, { name: "idx_genre_pubYear_compound" })

// Test a query that can use the compound index:
db.Books.find({ genre: "Science Fiction", publicationYear: { $gt: 1950 } }).explain("executionStats")


//  2. Build a stored aggregation query to return the top-rated author by average book score
db.createView("topRatedAuthorView", "Books", [
    // unwind ratings
    { $unwind: "$ratings" },
    // group to compute sum & count per author across all books
    {
        $group: {
            _id: "$authorId",
            avgAuthorRating: { $avg: "$ratings.score" },
            totalPoints: { $sum: "$ratings.score" },
            ratingCount: { $sum: 1 }
        }
    },
    // lookup author info
    {
        $lookup: {
            from: "Authors",
            localField: "_id",
            foreignField: "_id",
            as: "author"
        }
    },
    { $unwind: "$author" },
    // project useful fields
    {
        $project: {
            _id: 0,
            authorId: "$_id",
            authorName: "$author.name",
            avgAuthorRating: { $round: ["$avgAuthorRating", 2] },
            totalPoints: 1,
            ratingCount: 1
        }
    },
    // sort highest avg rating first
    { $sort: { avgAuthorRating: -1, ratingCount: -1 } },
    { $limit: 1 }
]);

// Now query the view:
db.topRatedAuthorView.find()