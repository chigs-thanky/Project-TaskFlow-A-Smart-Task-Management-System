const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Todo = require("./models/Todo");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todo_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Routes
app.get("/", async (req, res) => {
    const todos = await Todo.find();
    res.render("index", { todos });
});

app.post("/add", async (req, res) => {
    const newTodo = new Todo({ task: req.body.task });
    await newTodo.save();
    res.redirect("/");
});

//  Update Task
app.post("/update/:id", async (req, res) => {
    const { task } = req.body;
    await Todo.findByIdAndUpdate(req.params.id, { task: task });
    res.redirect("/");
});


//  Delete Task
app.post("/delete/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

app.post("/toggle/:id", async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.redirect("/");
});


// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
