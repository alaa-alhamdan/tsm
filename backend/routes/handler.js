const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv/config');

const aa = require('express-async-await');
const asyncHandler = require('express-async-handler')
const { json } = require('express');
const app = aa(express())

var distance = require('google-distance-matrix');
distance.key('AIzaSyC1QAymcINjIAuP8b-p1TIWd9xJwzh77oY');



mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then( () => {
    console.log('DB Connected!');
})
.catch( (err) => {
    console.log(err);
});

const usersdata = new mongoose.Schema({
    createdOn: {
        type: Date,
        immutable: true,
        required: true,
        default: () => Date.now()
    },
    username: {
        type: String,
        immutable: true,
        required: true
    },
    Fname: {
        type: String,
        immutable: true,
        required: true
    },
    Lname : {
        type: String,
        immutable: true,
        required: true
    },
    password: {
        type: [Number],
        immutable: true,
        required: true 
    },
    mobile : {
        type: [Number],
        immutable: true,
        required: true 
    },
    path: {
        type: String ,
        immutable: true,
       required: false
    }
})


const profiles = mongoose.model('profiles', usersdata)


const buses = new mongoose.Schema({
    createdOn: {
        type: Date,
        immutable: true,
        required: true,
        default: () => Date.now()
    },
    path: {
        type: String,
        immutable: true,
        required: true
    },
    time: {
        type: String,
        immutable: true,
        required: true
    },
    
  
    username: {
        type: String ,
        immutable: true,
       required: false
    }
})


const busesdb = mongoose.model('buses', buses)


const cars = new mongoose.Schema({
    createdOn: {
        type: Date,
        immutable: true,
        required: true,
        default: () => Date.now()
    },
    station: {
        type: String,
        immutable: true,
        required: true
    },
    time: {
        type: String,
        immutable: true,
        required: true
    },
    
    username: {
        type: String ,
        immutable: true,
       required: false
    }
})

const cardb = mongoose.model('cars', cars)


const est = new mongoose.Schema({
    
    estforbus: {
        type: [Number],
        immutable: true,
        required: true
    },
    estforcar: {
        type: [Number],
        immutable: true,
        required: true
    },
    
    tripID: {   // for cars 
        type: [Number],
        immutable: true,
        required: true  
    },
    ticketID: {    // for buses 
        type: [Number],
        immutable: true,
        required: true 
    },
    
 
})

const esttime = mongoose.model('est', usersdata)

router.get('/', (req, res) => {
    res.render('index')
})


router.post('/test', (req, res) => {
    let newUser = {
        id: Date.now(),
        username: req.body.username,
        password: req.body.password,
        mobile : req.body.mobile,
        Fname :  req.body.Fname,
        Lname :  req.body.Lname,
    };
    
    console.log('User list', newUser );
    res.send('test')
})



router.post('/home/login', async (req, res) => {
  
 
    try{
        let foundUser = profiles.find((data) => req.body.username === data.username);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                // list the user tickets..... to be updated 
                res.json(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                res.json("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }


});

router.post('/home/register',  (req, res) => {
   
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                password: req.body.password,
                mobile : req.body.mobile,
                Fname :  req.body.Fname,
                Lname :  req.body.Lname,
            } 
            let result = " registeration is complate , you can book a ticket or trip "
            res.send({"result": result})
            const newuser1  = new  profiles ({
         
                id: Date.now(),
                username: req.body.username,
                password: req.body.password,
                mobile : req.body.mobile,
                Fname :  req.body.Fname,
                Lname :  req.body.Lname,
            });
          

            profiles.insertMany([newuser1])
            .then( data => console.log("Data saved: ", data) )
            .catch( err => console.log("Error: ", err) )
        
        
            
        });

router.post('/home/Bus/book', (req, res) => {

    let newticket = {
        id: Date.now(),
        path: req.body.path,
        username: req.body.username,
        time : req.body.time,
        
    } 
    let result = " Congrats you booked the ticket! "
    res.send({"result": result})
    const newticket1  = new  busesdb ({
        id: Date.now(),
        path: req.body.path,
        username: req.body.username,
        time : req.body.time,
    });
  
    busesdb.insertMany([newticket1])
    .then( data => console.log("Data saved: ", data) )
    .catch( err => console.log("Error: ", err) )
});


router.get('/home/bus/stations', (req, res) => {
   
    //return from DB list of stations 
    res.json({})
});


router.post('/home/cars/book', (req, res) => {

    
    let newticket = {
        id: Date.now(),
        station: req.body.station,
        username: req.body.username,
        time : req.body.time,
        
    } 
    let result = " Congrats you booked the trip! "
    res.send({"result": result})
    const newticket1  = new  cardb ({
        id: Date.now(),
        station: req.body.station,
        username: req.body.username,
        time : req.body.time,
    });
  
    cardb.insertMany([newticket1])
    .then( data => console.log("Data saved: ", data) )
    .catch( err => console.log("Error: ", err) )

  


});
router.get('/home/cars/stations', (req, res) => {
   
    //return from DB list of stations 
    res.json({})
});

router.post('/profile',  async  (req, res) => {

    let filterbuses = { username: req.body.username }
            const busesfi  =    busesdb.find(filterbuses)
             .then( data =>  console.log("Data found: ", data))
              
              .catch( err => console.log("Error: ", err) )
          
             // console.log(" filterd data :" , busesfi)
              res.send({"posts": busesfi})

  


});

router.post('/test',    (req, res) => {


    var origins = [ 42.30432,-73.4389 ];
    var destinations = [ 42.30432,-73.4389 ];
 
     distance.matrix(origins, destinations, function (err, distances) {
    if (!err)
        console.log("  Distance metrix :  ",distances);
        res.send( distances)


})


});



module.exports = router;