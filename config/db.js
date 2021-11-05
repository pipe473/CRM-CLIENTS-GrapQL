const mongoose = require('mongoose');

require('dotenv').config({ path: 'conf.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true

        });
        console.log('MongoDB Database Connected!!');        
    } catch (error) {
        console.log('Hubo un error');
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;