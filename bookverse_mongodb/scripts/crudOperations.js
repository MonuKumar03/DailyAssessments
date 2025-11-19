const connectDB = require('../config/database');
const Book = require('../models/Book');
const User = require('../models/User');

const crudOperations = async () => {
    try {
        await connectDB();

        console.log(' Starting CRUD Operations...\n');

        // 1. Insert new user
        console.log('1. Inserting new user...');
        const newUser = await User.create({
            name: 'David Wilson',
            email: 'david@example.com',
            joinDate: new Date()
        });
        console.log(' New user created:', newUser.name);

        // 2. Insert new book
        console.log('\n2. Inserting new book...');
        const authors = await require('../models/Author').find();
        const newBook = await Book.create({
            title: 'Dune',
            genre: 'Science Fiction',
            publicationYear: 1965,
            authorId: authors[2]._id,
            ratings: []
        });
        console.log(' New book created:', newBook.title);

        // 3. Retrieve all books of genre "Science Fiction"
        console.log('\n3. Retrieving Science Fiction books...');
        const sciFiBooks = await Book.find({ genre: 'Science Fiction' });
        console.log(' Science Fiction Books:');
        sciFiBooks.forEach(book => {
            console.log(`   - ${book.title} (${book.publicationYear})`);
        });

        // 4. Update publicationYear of a book
        console.log('\n4. Updating book publication year...');
        const bookToUpdate = await Book.findOne({ title: 'Dune' });
        const updatedBook = await Book.findByIdAndUpdate(
            bookToUpdate._id,
            { publicationYear: 1966 },
            { new: true }
        );
        console.log(` Updated publication year for "${updatedBook.title}" to ${updatedBook.publicationYear}`);

        // 5. Delete a user
        console.log('\n5. Deleting a user...');
        const userToDelete = await User.findOne({ name: 'Bob Smith' });
        await User.findByIdAndDelete(userToDelete._id);
        console.log(` Deleted user: ${userToDelete.name}`);

        // 6. Add a new rating to a book using $push
        console.log('\n6. Adding new rating to a book...');
        const users = await User.find();
        const bookToRate = await Book.findOne({ title: 'Dune' });
        
        await Book.findByIdAndUpdate(
            bookToRate._id,
            {
                $push: {
                    ratings: {
                        user: users[0]._id,
                        score: 5,
                        comment: 'Masterpiece of sci-fi!'
                    }
                }
            }
        );
        console.log(` Added rating to "${bookToRate.title}"`);

        console.log('\n All CRUD operations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error in CRUD operations:', error);
        process.exit(1);
    }
};

crudOperations();