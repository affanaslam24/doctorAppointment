//config file to make connection to the database
import mongoose from 'mongoose';

const connectDb = async () =>{
    mongoose.connection.on('connected', () => {
        console.log("Database connected successfully");
      });
      await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);

}


export default connectDb