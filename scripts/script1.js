//my app id is 9aa44abb331b4e4ea20cedc4c14ff30d
/**
 * @name handleFail
 * @param err - error thrown by any function
 * @description Helper function to handle errors
 */


 var handleFail = function (err) {
   console.log("Error : ", err);
 };
 
 /**
  * @name addVideoStream
  * @param streamId
  * @description Helper function to add the video stream to "remote-container"
  */
 function addVideoStream(streamId) {
   let streamDiv = document.createElement("div"); // Create a new div for every stream
   streamDiv.id = streamId; // Assigning id to div
   streamDiv.style.transform = "rotateY(180deg)"; // Takes care of lateral inversion (mirror image)
   remoteContainer.appendChild(streamDiv); // Add new div to container
 }
 /**
  * @name removeVideoStream
  * @param evt - Remove event
  * @description Helper function to remove the video stream from "remote-container"
  */
 function removeVideoStream(evt) {
   let stream = evt.stream;
   stream.stop();
   //let remDiv = document.getElementById(stream.getId());
  // remDiv.parentNode.removeChild(remDiv);
   console.log("Remote stream is removed " + stream.getId());
 }
 

 
 // Client Setup
 // Defines a client for RTC
 //import AgoraRTM from 'agora-rtm-sdk';
 var client;
 function waitForElement(){
    if(typeof AgoraRTC !== "undefined"){
        
        client = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
        });
        
        // Client Setup
        // Defines a client for Real Time Communication
        client.init(
        "21eebf7968594b1da9343ef9b294fff6",
        () => console.log("AgoraRTC client initialized"),
        handleFail
        );
        
        // The client joins the channel
        client.join(
        null,
        "expertconnect",
        null,
        (uid) => {
            // Stream object associated with your web cam is initialized
            let localStream = AgoraRTC.createStream({
            streamID: uid,
            audio: true,
            video: false,
            screen: false,
            });
        
            // Associates the stream to the client
            localStream.init(function () {
            //Plays the localVideo
            localStream.play("me");
        
            //Publishes the stream to the channel
            client.publish(localStream, handleFail);
            }, handleFail);
        },
        handleFail
 );
    }
    else{
        setTimeout(waitForElement, 250);
    }
}
 waitForElement();
 //When a stream is added to a channel
 client.on("stream-added", function (evt) {
   console.log("stream added");
   client.subscribe(evt.stream, handleFail);
 });
 //When you subscribe to a stream
 client.on("stream-subscribed", function (evt) {
   let stream = evt.stream;
   console.log("stream added");
   console.log(stream.getId());
   //addVideoStream(stream.getId());
   stream.play(String(stream.getId()));
 });
 //When a person is removed from the stream
 client.on("stream-removed", removeVideoStream);
 client.on("peer-leave", removeVideoStream);
 

 