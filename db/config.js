const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to DB...');
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`MongoDb Connected: ${conn.connection.host}`);
    } catch (err) {
        console.log('Connection failed');
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;