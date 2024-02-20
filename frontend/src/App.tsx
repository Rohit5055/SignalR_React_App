import React, { useEffect, useState } from 'react';
import './App.css';
import Connector from './signalr-connection';



function App() {
  const { newMessage,loginStatus, events } = Connector();
  const [message, setMessage] = useState("initial value");
  const [isEven, setIsEven] = useState<boolean | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  const [name, setName] = useState("Guest");
  const [csip, setCsip] = useState("0");
  const [connectivity, setConnectivity] = useState("local");
  const [logStatus, setlogStatus] = useState("Send Login request to Server");
 

  useEffect(() => {
    events(
      // (_, receivedMessage) => setMessage(receivedMessage),
      (userName, receivedMessage) => {
        console.log("Received username is:", userName);
        setMessage(receivedMessage)
      },
      (result) => setIsEven(result),
      (userName,accessLevel,connectivity,message) =>{
        console.log(" Login status from server is: ", message);
        setName(userName);
        setCsip(accessLevel);
        setConnectivity(connectivity);
        setlogStatus(message);
      },
      (message)=>{
        console.log(message);
        setName("Guest");
        setCsip("0");
        setConnectivity("local");
        setlogStatus("Send Login request to Server");
      }
    );
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      newMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleSendLoginMessage = () => {
    console.log("Sending login request");
    loginStatus("Login request from client");
  }

  // console.log({ isEven });
  return (
    <div className="wrapper">
      <div className="App">
        <h1>Message from SignalR</h1>
        <h2>(Client to Server and Server to Client communication)</h2>
        <div className="message-box">
          <p>{message}</p>
        </div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send Message to Server</button>
        <div className="server-update">
          <p>
            Server to Client async Login Update is{' '}
            <span style={{ color: '#61dafb' }}>{isEven !== null ? isEven.toString() : ''}</span>
          </p>
        </div>
      </div>

      {/* form ka ba */}
      <div className="App formProperties">
        <form>
          <label>User name:  </label>
          <input
            type="text"
            id='userName'
            value={name}
            // onChange={(e) => setName(e.target.value)}
          />
          <label>Access Level:  </label>
          <input
            type="text"
            id='csip'
            value={csip}
            // onChange={(e) => setCsip(e.target.value)}
          />
          <label>Connectivity Mode:  </label>
          <input
            type="text"
            id='connectivity'
            value={connectivity}
            // onChange={(e) => setConnectivity(e.target.value)}
          />
         
        </form>
        <button className='submit' onClick={handleSendLoginMessage}>{logStatus}</button>
      </div>
    </div>
  );
}

export default App;
