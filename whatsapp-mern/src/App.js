import React , {useEffect, useState} from 'react';

import './App.css';
import Sidebar from './Sidebar'
import Chat from './Chat';
import Pusher from "pusher-js";
import axios from "./axios";


function App() {
  const [messages, setMessages]= useState([]);


useEffect(() => {
  axios.get('/messages/sync').then(response=>{
    console.log(response.data)
    setMessages(response.data)
  });

 
}, [])  ;
  useEffect(() => {
    var pusher = new Pusher('07c6d6254ce7e8640aee', {
      cluster: 'eu'
    });

    var channel = pusher.subscribe('messages');
    channel.bind('inserted',(data)=> {
     
      setMessages([...messages, data]);
    });

    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);
  console.log(messages)
  return (
    <div className="app">
      <div className="app__body">   
      
      <Sidebar/>
      <Chat messages={messages} />
     
      
      </div>
     
      
      
    </div>
  );
}

export default App;
