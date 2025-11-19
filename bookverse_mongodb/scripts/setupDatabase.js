const connectDB = require('../config/database');
const Author = require('../models/Author');
const Book = require('../models/Book');
const User = require('../models/User');

const setupDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Author.deleteMany({});
        await Book.deleteMany({});
        await User.deleteMany({});

        console.log('  Cleared existing data');

        // Insert sample authors
        const authors = await Author.insertMany([
            {
                name: 'J.K. Rowling',
                nationality: 'British',
                birthYear: 1965
            },
            {
                name: 'George R.R. Martin',
                nationality: 'American',
                birthYear: 1948
            },
            {
                name: 'Isaac Asimov',
                nationality: 'American',
                birthYear: 1920
            }
        ]);

        console.log(' Authors inserted:', authors.length);

        // Insert sample users
        const users = await User.insertMany([
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                joinDate: new Date('2024-01-15')
            },
            {
                name: 'Bob Smith',
                email: 'bob@example.com',
                joinDate: new Date('2024-03-20')
            },
            {
                name: 'Carol Davis',
                email: 'carol@example.com',
                joinDate: new Date('2024-06-10')
            }
        ]);

        console.log(' Users inserted:', users.length);

        // Insert sample books
        const books = await Book.insertMany([
            {
                title: "Harry Potter and the Philosopher's Stone",
                genre: 'Fantasy',
                publicationYear: 1997,
                authorId: authors[0]._id,
                ratings: [
                    { user: users[0]._id, score: 5, comment: 'Amazing book!' },
                    { user: users[1]._id, score: 4, comment: 'Great read' }
                ]
            },
            {
                title: 'A Game of Thrones',
                genre: 'Fantasy',
                publicationYear: 1996,
                authorId: authors[1]._id,
                ratings: [
                    { user: users[0]._id, score: 5, comment: 'Epic story' },
                    { user: users[2]._id, score: 4, comment: 'Complex characters' }
                ]
            },
            {
                title: 'Foundation',
                genre: 'Science Fiction',
                publicationYear: 1951,
                authorId: authors[2]._id,
                ratings: [
                    { user: users[1]._id, score: 5, comment: 'Sci-fi classic' }
                ]
            },
            {
                title: 'The Caves of Steel',
                genre: 'Science Fiction',
                publicationYear: 1954,
                authorId: authors[2]._id,
                ratings: [
                    { user: users[0]._id, score: 4, comment: 'Great detective story' },
                    { user: users[1]._id, score: 5, comment: 'Brilliant' },
                    { user: users[2]._id, score: 4, comment: 'Enjoyable read' }
                ]
            },
            {
                title: 'Harry Potter and the Chamber of Secrets',
                genre: 'Fantasy',
                publicationYear: 1998,
                authorId: authors[0]._id,
                ratings: [
                    { user: users[2]._id, score: 5, comment: 'Loved it!' }
                ]
            }
        ]);

        console.log(' Books inserted:', books.length);
        console.log(' Database setup completed successfully!');
        
        // Display inserted data
        console.log('\n Sample Data Overview:');
        console.log('Authors:', authors.map(a => a.name));
        console.log('Users:', users.map(u => u.name));
        console.log('Books:', books.map(b => b.title));

        process.exit(0);
    } catch (error) {
        console.error(' Error setting up database:', error);
        process.exit(1);
    }
};

setupDatabase();