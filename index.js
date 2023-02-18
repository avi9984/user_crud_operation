const express=require('express')
const bodyParser=require('body-parser')
const mongoose = require('mongoose')
const db=require('./config/db')
const route = require('./routes/router');
const app = express();
const multer=require('multer')
const dotenv=require('dotenv')
const PORT=process.env.PORT || 3000

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())

mongoose.set('strictQuery', true); 
db();
// mongoose.connect("mongodb+srv://Avi9984:JM6hnTiQIRViVdA3@cluster0.qfc4n.mongodb.net/user_crud_operation",{
//     useNewUrlParser:true
// }).then(()=>console.log("MongoDB is connected"))
// .catch((error)=>{
//     console.log(error)
// })

app.use('/', route);

app.listen(PORT,()=>{
    console.log(`Server is running on the port : ${PORT}`)
})