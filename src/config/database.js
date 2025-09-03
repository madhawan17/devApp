const mongoose = require('mongoose');


const connectDB = async () => {
    await  mongoose.connect(
    'mongodb+srv://aryamadhawan_db_user:madhawansnew@cluster0.3lyij3p.mongodb.net/devtinder'
 );
};

module.exports = connectDB;