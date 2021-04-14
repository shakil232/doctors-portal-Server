const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const Object = require('mongodb').ObjectID;
const fileUpload = require('express-fileupload');
require('dotenv').config();
const port = process.env.PORT || 4300;


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());


const uri = `mongodb+srv://${ process.env.DB_USER}:${ process.env.DB_PASS}@cluster0.9cu5v.mongodb.net/${ process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
    res.send('Hello World!')
});


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const AppointmentCollection = client.db(`${process.env.DB_NAME}`).collection(`${ process.env.DB_COLLECTION }`);

    app.post('/addAppointment' , (req,res)=>{
        const Appointment = req.body;
        console.log(Appointment )
        AppointmentCollection.insertOne(Appointment)
        .then( result =>{
            res.send( result.insertedCount < 0 )
        })
    });

    app.post('/appointmentsByDate' , (req,res)=>{
        const date = req.body;
        console.log(date.date)
        AppointmentCollection.find({date: date.date})
        .toArray( (error, documents) =>{
            res.send( documents )
        })
    });

    app.post('/addDoctors' , (req,res)=>{
        const file = req.files.file;
        const email = req.files.email;
        const name  = req.files.name;
        
        console.log(file,email,name)
        // AppointmentCollection.find({date: date.date})
        // .toArray( (error, documents) =>{
        //     res.send( documents )
        // })
    })


});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})