const connectDB = require('../config/database');
const Book = require('../models/Book');
const mongoose = require('mongoose');

const bonusChallenge = async () => {
    try {
        await connectDB();

        console.log(' Starting Bonus Challenges...\n');

        // 1. Top 3 most-rated books
        console.log('1. Top 3 most-rated books:');
        const mostRatedBooks = await Book.aggregate([
            {
                $addFields: {
                    ratingCount: { $size: '$ratings' }
                }
            },
            {
                $sort: { ratingCount: -1 }
            },
            {
                $limit: 3
            },
            {
                $project: {
                    title: 1,
                    ratingCount: 1,
                    avgRating: { $avg: '$ratings.score' }
                }
            }
        ]);

        mostRatedBooks.forEach((book, index) => {
            const avg = book.avgRating ? book.avgRating.toFixed(2) : 'N/A';
            console.log(`   ${index + 1}. ${book.title}`);
            console.log(`      Ratings: ${book.ratingCount}, Average: ${avg}`);
        });

        console.log('\n Bonus challenges completed!');
        process.exit(0);
    } catch (error) {
        console.error(' Error in bonus challenges:', error);
        process.exit(1);
    }
};

bonusChallenge();