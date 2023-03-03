//Mitchell McCoard

//IS final

//This is a web App that displays data from a database and allows users to edit, sort, and delete the data.

//Create a node app in the express environment
const express = require("express");

let path = require("path");

const port = 3000;

/*
Not really sure what this is, or if I need it, so i commented it out
const { prepareValue } = require("pg/lib/utils");
const { runInNewContext } = require("vm");
*/

let app = express();

//Allow all types of JavaSCript objects
app.use(express.urlencoded({extended: true}));


//Set the view engine to EJS
app.set("view engine", "ejs");

//connect to database
const knex = require("knex")({
    client: "pg",
    connection: {
        host : "localhost",
        user : "postgres",
        password : "Gr@ft1ng",
        database : "postgres",
        port : 5432
    }
});


//Root route. This is where you display the table
app.get("/", (req, res) => {
    knex.select().from(
            "drink"
    ).then(entireTable =>{
        res.render("index", {records : entireTable})
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

//Display Drinks route
app.get("/displayDrinks", (req, res) => {
    knex.select().from(
            "drink"
    ).then(entireTable =>{
        res.render("displayDrinks", {records : entireTable})
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});


//Delete a record route
app.post("/deleteRecord/:drink_id", (req, res) => {
    knex("drink").where("drink_id", parseInt(req.params.drink_id)).del().then(dell => {
        res.redirect("/confPage");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

//Confirmation page route
app.get("/confPage", (req, res) => {
   let spec = "action";
    res.render("confPage", {action : spec }).catch(err => {
        console.log(err);
        res.status(500).json({err});

    })
    });


//Update a record route

//The get is used first to gather the needed info to update
//Make sure line 69 matches on the index.ejs file on line 55 in the form
app.get("/editDrink", (req, res) => {       
    knex.select().from("drink").where(
        "drink_id", req.query.drink_id
    ).then(record => {
        console.log (record);
        res.render("editDrink", {drink: record});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });    
});

//Then the post is used to actually update the database (i.e. push the changes)
//The values are the names of the inputs in updateRecord.ejs THe keys match the table column names
app.post("/editDrink", (req, res) => {
    knex("drink").where("drink_id", parseInt(req.body.drink_id)).update({
        drink_name: req.body.drink_name,
        drink_ingredients: req.body.drink_ingredients,
        drink_price: req.body.drink_price,
        drink_ranking: req.body.drink_ranking,
        drink_sweetness: req.body.drink_sweetness,
        tasted: req.body.tasted
    }).then(list => {
        res.redirect("/confPage");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });    
});

//Add a record route

//First the get method to take you to a page with a form to enter the data in
app.get("/addDrink", (req, res) => {
    res.render("addDrink").catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

//Then when the data is entered they are directed to this post through the submit button which adds the new record using the data that was passed to them.
app.post("/addDrink", (req, res) => {
    knex("drink").insert({
        drink_name: req.body.drink_name,
        drink_ingredients: req.body.drink_ingredients,
        drink_price: req.body.drink_price,
        drink_ranking: req.body.drink_ranking,
        drink_sweetness: req.body.drink_sweetness,
        tasted: req.body.tasted
    }).then(newRecord => {
        res.redirect("/confPage/added");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});


//Sorting routes

app.get("/sortRating", (req, res) => {
    knex
      .select()
      .from("drink")
      .orderBy("drink.drink_rating")
      .then(entireTable =>{
        res.render("displayDrinks", {records : entireTable})
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});


app.get("/sortDesc", (req, res) => {
    knex
      .select()
      .from("drink")
      .orderBy("drink.drink_name")
      .then(entireTable =>{
        res.render("displayDrinks", {records : entireTable})
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

//Start listening
app.listen(port, () => console.log("Go, Fight, Win!"));