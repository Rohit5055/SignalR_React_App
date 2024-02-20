import * as signalR from "@microsoft/signalr";
const URL = process.env.HUB_ADDRESS ?? "https://localhost:5001/hub"; //or whatever your backend port is

/// This class represents a connection to the SignalR hub.
class Connector {
  // connection: Represents the SignalR connection object.
  private connection: signalR.HubConnection;

  //events: A function that takes a callback function
  //(onMessageReceived) as a parameter and sets up an event listener for the "messageReceived" event.
  public events: (
    onMessageReceived: (username: string, message: string) => void,
    onRandomNumberResult: (isEven: boolean) => void,
    onloginStatusReceived: (
      userName: string,
      accessLevel: string,
      connectivity: string,
      message: string
    ) => void,
    onlogoffStatus: (message: string) => void,
  ) => void;

  static instance: Connector;
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL)
      .withAutomaticReconnect()
      .build();
    this.connection.start().catch((err) => document.write(err));

    this.events = (
      onMessageReceived,
      onRandomNumberResult,
      onloginStatusReceived,
      onlogoffStatus,
    ) => {
      console.log("Connection Established");

      this.connection.on("messageReceived", (username, message) => {
        onMessageReceived(username, message);
      });

      // Handle "randomNumberResult" events
      this.connection.on("randomNumberResult", (isEven) => {
        onRandomNumberResult(isEven);
      });

      this.connection.on(
        "loginStatusReceived",
        (userName, accessLevel, connectivity, message) => {
          onloginStatusReceived(userName, accessLevel, connectivity, message);
        }
      );

      this.connection.on("logoffStatus", (message) =>{
        onlogoffStatus(message);
      })
    };
  }
  // newMessage: A function to send a new message to the server using the SignalR connection.
  public newMessage = (messages: string) => {
    this.connection
      .send("newMessage", "foo", messages)
      .then((x) => console.log("sent"));
  };

  public loginStatus = (messages: string) => {
    this.connection
      .send("loginStatus", messages)
      .then((x) => console.log("Login message sent to server"));
  };

  public startReceivingRandomNumbers = () => {
    // No need to explicitly start receiving random numbers from the client side
    // Server initiates the process
  };

  // getInstance: A static method to get a singleton instance of the Connector class.
  public static getInstance(): Connector {
    if (!Connector.instance) Connector.instance = new Connector();
    return Connector.instance;
  }
}

export default Connector.getInstance;
