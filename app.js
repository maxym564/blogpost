const express = require("express")
const path = require("path");
const mongoose = require("mongoose");
let Post = require("./models/postModel");
const { error } = require("console");
const methodOverride = require("method-override");

const app = express();
const port = 3000;
const db = "mongodb+srv://Maksym<password>:@cluster0.lrep59o.mongodb.net/blog";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended:false}));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("index",{title:"Main Page"});
});

app.get("/add-post", (req,res) => {
    res.render("add-post",{title:"Add new post"})
});

app.post("/add-post", (req,res) =>
{
    let {title, author} = req.body;
    let post = new Post({title,author});
    post.save()
    .then(() => res.redirect("/posts"))
    .catch((error) => {
      console.log(error);
      res.render(error);
    })
});

app.get("/posts",(req,res) =>
{
  Post.find()
  .then((posts) => res.render("posts",{title:"Posts",posts}))
  .catch((error) =>{
    console.log(error);
    res.render("error");
  })
});

app.get("/edit-post/:id",(req,res) =>
{
  const id = req.params.id;
  Post.findById(id)
  .then((post) => res.render("edit-post",{title:post.title, id: post.id, post}))
  .catch((error) => {
    console.log(error);
    res.render(error);
  })
});

app.put("/edit-post/:id", (req,res) =>
{
  const id = req.params.id;
  const {title,author} = req.body;
  Post.findByIdAndUpdate(id, {title,author})
  .then( () => res.redirect("/posts"))
  .catch((error) => {
    console.log(error);
    res.render(error);
  })
})

app.delete("/posts/:id" ,(req,res) =>
{
  let id = req.params.id;
  Post.findByIdAndDelete(id)
  .then((posts) => res.render("posts",{title:"Posts",posts}))
  .catch((error) =>{
    console.log(error);
    res.render("error");
  })
})

async function start() {
  try{
    await mongoose.connect(db);
    console.log("Connection has been provided");
    app.listen(port,()=>{
      console.log(`Listening to ${port}`);
    });
  } catch (err)
  {
    console.log("connection error",err);
  }
  
}

start();