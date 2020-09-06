//importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from 'cors';

//app config 
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: '1067913',
    key: '07c6d6254ce7e8640aee',
    secret: '3d9e9ef80b757938739e',
    cluster: 'eu',
    encrypted: true
  });

  const db = mongoose.connection;
  db.once('open',()=>{
      console.log("DB connected");
      const msgCollection = db.collection('messagecontents');
      const changeStream = msgCollection.watch();
       changeStream.on('change',(change)=>{
      console.log("Jawek Behi ",change);
      if(change.operationType === 'insert'){
          const messageDetails = change.fullDocument;
          pusher.trigger('messages', 'inserted',{
          name: messageDetails.name,
          message : messageDetails.message,
          timestamp: messageDetails.timestamp,
          received : messageDetails.received,
          });
      } else {
          console.log('Error triggering Pusher');
      }
  });

  });

 
//middleware to get the response json back 
app.use(express.json()); 
app.use(cors());


// Db config
const connection_url ='mongodb+srv://admin:COOL2COOL@cluster0.mwfo5.mongodb.net/whatsappdb?retryWrites=true&w=majority' 
mongoose.connect(connection_url ,{
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
})


// ???

// api routes
app.get('/',(req,res)=>res.status(200).send('hello world'));
app.get('/messages/sync', (req,res)=>{
    Messages.find((err,data)=>{
        if (err){
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }

    });
});
app.post("/messages/new",(req,res)=>{
    const dbMessage = req.body
    Messages.create(dbMessage ,(err,data)=>{
        if (err){
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
});

// listen 
app.listen(port,()=>console.log(`Listening on localhost :${port}`));