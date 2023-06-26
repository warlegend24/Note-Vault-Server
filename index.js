//requiring the installed modules:-
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
//setting up the server

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"public"));

app.use(cors());
app.use(express.json());

//setting up the database connection:-
mongoose.connect("mongodb+srv://Harman:Cricketer24@cluster0.mdmqurh.mongodb.net/?retryWrites=true&w=majority")
.then(function(res){
    console.log("Database connected successfully !!");
})
.catch(function(err){
    console.log(err);
});

const noteSchema = new mongoose.Schema({
    title:String,
    content:String
});

const Note = mongoose.model("Note",noteSchema);


//Manipulating requests made on the server :-
app.get("/",function(req,res){
    res.send("<h1><center>Click Here !!</center></h1>");
});
app.get("/notes",function(req,res){
    //we retrieve the data from the notesDB and send the documents 
    Note.find({})
    .then(function(notes){
        //if we find the notes
        console.log(notes);
        console.log("this is the get request");
        res.send(notes);
    })
    .catch(function(err){
        console.log(err);
        res.send(err);
    });
});



app.post("/NewNoteAdded",function(req,res){
    const note = req.body;
    if(note.title!==null || note.content!==null){
    //using mongoose to add this newly added note:-
    //creating a new document corresponding to the new Note added by the user on the client side
    const newNote = new Note({
        title:note.title,
        content:note.content
    });
    //now saving this document in the 'Note' model refernce 'notes' collection:-
    newNote.save()
    .then(function(res){
        console.log("newNote saved successfully in notes collection !!");
    })
    .catch(function(err){
        console.log(err);
    });

    res.send("new Note added to database successfully !!")

    }
   

});


app.delete("/deleteNote/:note_title",function(req,res){
    const noteTitle = req.params.note_title;
    Note.deleteOne({title:noteTitle})
    .then(function(deleted){
        console.log('successfully deleted :-' + deleted);
    })
    .catch(function(err){
        console.log(err);
    });

});


app.listen(3000,function(){
    console.log("Server started on port 3000");
});
