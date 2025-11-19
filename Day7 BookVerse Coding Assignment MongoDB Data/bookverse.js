/*
==============================================
                USERSTORY 1
==============================================
*/

// 1. Authors collection
db.Authors.insertMany([
    { _id: 1, name: "Isaac Asimov", nationality: "American", birthYear: 1920 },
    { _id: 2, name: "J.K. Rowling", nationality: "British", birthYear: 1965 },
    { _id: 3, name: "George R.R. Martin", nationality: "American", birthYear: 1948 }
])

// 2. Books collection
db.Books.insertMany([
    {
        _id: 1,
        title: "Foundation",
        genre: "Science Fiction",
        publicationYear: 1951,
        authorId: 1,
        ratings: [
            { user: "Alice Johnson", score: 5, comment: "Brilliant classic!" },
            { user: "Bob Smith", score: 4, comment: "Great read" }
        ]
    },
    {
        _id: 2,
        title: "Harry Potter and the Sorcerer’s Stone",
        genre: "Fantasy",
        publicationYear: 1997,
        authorId: 2,
        ratings: [
            { user: "Carol White", score: 5, comment: "Magical story!" }
        ]
    },
    {
        _id: 3,
        title: "A Game of Thrones",
        genre: "Fantasy",
        publicationYear: 1996,
        authorId: 3,
        ratings: [
            { user: "Bob Smith", score: 5, comment: "Epic world-building!" }
        ]
    },
    {
        _id: 4,
        title: "The Caves of Steel",
        genre: "Science Fiction",
        publicationYear: 1953,
        authorId: 1,
        ratings: []
    },
    {
        _id: 5,
        title: "Fantastic Beasts",
        genre: "Fantasy",
        publicationYear: 2016,
        authorId: 2,
        ratings: []
    }
])

// 3. Users collection
db.Users.insertMany([
    { _id: 1, name: "Alice Johnson", email: "alice@example.com", joinDate: ISODate("2025-02-15") },
    { _id: 2, name: "Bob Smith", email: "bob@example.com", joinDate: ISODate("2025-07-01") },
    { _id: 3, name: "Carol White", email: "carol@example.com", joinDate: ISODate("2024-12-10") }
])

// 4. Verify Collections and Data

db.Authors.find().pretty()
db.Books.find().pretty()
db.Users.find().pretty()

// 5. Validate Relationships
db.Books.aggregate([
    {
        $lookup: {
            from: "Authors",
            localField: "authorId",
            foreignField: "_id",
            as: "AuthorDetails"
        }
    },
    { $project: { title: 1, "AuthorDetails.name": 1, _id: 0 } }
])

/*
==============================================
                USERSTORY 2
==============================================
*/

// 1. Insert new users and books
db.Users.insertMany([
    { _id: 4, name: "David King", email: "david@example.com", joinDate: ISODate("2025-09-05") },
    { _id: 5, name: "Emma Brown", email: "emma@example.com", joinDate: ISODate("2025-10-12") }
])

db.Books.insertMany([
    {
        _id: 6,
        title: "Robots and Empire",
        genre: "Science Fiction",
        publicationYear: 1985,
        authorId: 1,
        ratings: []
    },
    {
        _id: 7,
        title: "The Casual Vacancy",
        genre: "Drama",
        publicationYear: 2012,
        authorId: 2,
        ratings: []
    }
])

// 2. Retrieve all books of genre “Science Fiction”
db.Books.find({ genre: "Science Fiction" }, { _id: 0, title: 1, genre: 1, publicationYear: 1 })

// 3. Update the publication year of one book
db.Books.updateOne(
    { title: "Foundation" },
    { $set: { publicationYear: 1952 } }
)

// 4. Delete one user record
db.Users.deleteOne({ name: "Bob Smith" })

// 5. Add a new rating to a book using $push
db.Books.updateOne(
    { title: "Fantastic Beasts" },
    { $push: { ratings: { user: "David King", score: 5, comment: "Loved the magical creatures!" } } }
)

/*
==============================================
                USERSTORY 3
==============================================
*/

// 1. Retrieve all books published after 2015
db.Books.find(
    { publicationYear: { $gt: 2015 } },
    { _id: 0, title: 1, publicationYear: 1 }
)

// 2. Find authors who have written books in the “Fantasy” genre
db.Books.aggregate([
    { $match: { genre: "Fantasy" } },
    {
        $lookup: {
            from: "Authors",
            localField: "authorId",
            foreignField: "_id",
            as: "authorDetails"
        }
    },
    { $project: { title: 1, "authorDetails.name": 1, _id: 0 } }
])

// 3. Retrieve all users who joined within the last 6 months
db.Users.find(
    {
        joinDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
    },
    { _id: 0, name: 1, email: 1, joinDate: 1 }
)

// 4. Find books with an average rating greater than 4
db.Books.aggregate([
    { $unwind: "$ratings" },
    {
        $group: {
            _id: "$title",
            avgRating: { $avg: "$ratings.score" }
        }
    },
    { $match: { avgRating: { $gt: 4 } } },
    { $project: { _id: 0, title: "$_id", avgRating: 1 } }
])

/*
==============================================
                Bonus
==============================================
*/

// 1. Top 3 Most-Rated Books
db.Books.aggregate([
    { $project: { title: 1, ratingCount: { $size: "$ratings" } } },
    { $sort: { ratingCount: -1 } },
    { $limit: 3 }
])

