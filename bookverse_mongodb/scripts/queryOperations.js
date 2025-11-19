const connectDB = require('../config/database');
const Book = require('../models/Book');
const Author = require('../models/Author');
const User = require('../models/User');

const queryOperations = async () => {
    try {
        await connectDB();

        console.log('🔍 Starting Query Operations...\n');

        // 1. Retrieve all books published after 2015
        console.log('1. Books published after 2015:');
        const recentBooks = await Book.find({ publicationYear: { $gt: 2015 } });
        if (recentBooks.length > 0) {
            recentBooks.forEach(book => {
                console.log(`   - ${book.title} (${book.publicationYear})`);
            });
        } else {
            console.log('   No books found published after 2015');
        }

        // 2. Find authors who have written books in "Fantasy" genre
        console.log('\n2. Authors of Fantasy books:');
        const fantasyAuthors = await Author.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'authorId',
                    as: 'books'
                }
            },
            {
                $match: {
                    'books.genre': 'Fantasy'
                }
            }
        ]);
        
        fantasyAuthors.forEach(author => {
            console.log(`   - ${author.name}`);
        });

        // 3. Retrieve users who joined within last 6 months
        console.log('\n3. Users who joined in last 6 months:');
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const recentUsers = await User.find({
            joinDate: { $gte: sixMonthsAgo }
        });
        
        recentUsers.forEach(user => {
            console.log(`   - ${user.name} (joined: ${user.joinDate.toDateString()})`);
        });

        // 4. Find books with average rating greater than 4
        console.log('\n4. Books with average rating > 4:');
        const highlyRatedBooks = await Book.aggregate([
            {
                $addFields: {
                    avgRating: { $avg: '$ratings.score' }
                }
            },
            {
                $match: {
                    avgRating: { $gt: 4 }
                }
            }
        ]);

        highlyRatedBooks.forEach(book => {
            const avg = book.avgRating.toFixed(2);
            console.log(`   - ${book.title} (Avg Rating: ${avg})`);
        });

        console.log('\n All query operations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error(' Error in query operations:', error);
        process.exit(1);
    }
};

queryOperations();