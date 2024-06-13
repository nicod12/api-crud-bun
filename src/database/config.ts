import mongoose from 'mongoose';


export const dbConnection = async () => {
    try {
        // Conexión dentro de la función dbConnection
        await mongoose.connect("mongodb://localhost:27017/users");
        console.log('Db online');
    } catch (error) {
        console.log("🚀 ~ file: config.js:9 ~ dbConnection ~ error:", error)
        throw new Error('Error trying to up the database');
    }
}
