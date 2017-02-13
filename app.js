var express = require("express"),
methodOverride = require("method-override"),   //to allow us to use PUT request....it kind of overrides the POST request.
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
app = express();

mongoose.connect("mongodb://localhost/restful_blog_app");   //creating a new database named restful_blog_app
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({     //schema of the collection in the database created by mongoose
    title : String,
    image : String,
    body : String,
    created : {type : Date, default : Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);         //this creates a new collection named blogs in the database restful_blogs_app

//Restful Routes

app.get("/", function(req, res) {
    res.redirect("/blogs");
})
//INDEX
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){         //Blog is basically db.blogs
        if(err){
            console.log("error!");
        } else {
            res.render("index", {blogs : blogs});
        }
    })
})
//NEW
app.get("/blogs/new", function(req, res) {
    res.render("new");
})
//CREATE
app.post("/blogs", function(req,res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/blogs")
        }
    })
})

//SHOW ROUTE - More information about one item
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){         //Blog is basically db.blogs
        if(err){
            console.log("errorrrr!");
        } else {
            res.render("show", {blog : foundBlog});
        }
    })    
})

//EDIT AND UPDATE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err)
        } else {
            res.render("edit", {blog : foundBlog});
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    // Blog.findByIdAndUpdate(id, newData, callback function)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log("err");
        } else {
            res.redirect("/blogs/" + updatedBlog._id);
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err)
        } else {
            res.redirect("/blogs");
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog Server Running!");
})
