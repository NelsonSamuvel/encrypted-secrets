import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { renderFile } from 'ejs';
import encrypt from "mongoose-encryption";



const app = express();
const port = 3000;




app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const connectToDb = async()=>{
    try{
        await mongoose.connect("mongodb+srv://nelsonsamuvel:Durotan2572@cluster0.fgazu2m.mongodb.net/secrets");
        console.log("connected")
    }
    catch(err){
        console.log(err)
    }
}

connectToDb();



const userSchema = new mongoose .Schema({
    email : String,
    password : String,
})

const secret = process.env.SECRET_KEY;

userSchema.plugin(encrypt , {secret : secret ,encryptedFields: ['password']})


const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home.ejs")
})

app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})


app.post("/register",(req,res)=>{
    savedata();
    async function savedata(){
        const newUser = new User({
            email : req.body.username,
            password : req.body.password
        })
        await newUser.save();
        res.render("secrets.ejs")
    }

})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const findUser = async()=>{
        const userData = await User.findOne({email : username})
        if(userData){
            if(userData.password === password){
                res.render("secrets.ejs")
            }
            else{
                console.log("incorrect password")
                res.redirect("/login");
            }
        }
        else{
            console.log("No user id found please sign up")
            res.redirect("/register")
        }
    }

    
    findUser();


})




app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})





