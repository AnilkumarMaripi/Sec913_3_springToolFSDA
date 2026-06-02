import express from "express";
import dotenv from "dotenv"
dotenv.config();

const app = express();
app.use(express.json());

app.get("/" ,(req ,  res) => {
    res.json({"code" : 200 , "Message" : "Server is running"})
})
const PORT = process.env.PORT || 8000;
 app.listen(PORT , ()=>{console.log(`Server Running on Port ${PORT}`)});