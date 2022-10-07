var rtc = {
    localAudioTrack: null,
    client: null
};

var options = {
    // Pass your App ID here.
    appId: "21eebf7968594b1da9343ef9b294fff6",
    // Set the channel name.
    channel: "test",
    // Pass your temp token here.
    token: null,
    // Set the user ID.
    uid: 123456
};

let muted=false;

async function startBasicCall() {
    if(typeof AgoraRTC !== "undefined")
    {
        console.log("startbasiccall called");
    // Create an AgoraRTCClient object.
        rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        
        // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
        rtc.client.on("user-published", async (user, mediaType) => {
            // Subscribe to the remote user when the SDK triggers the "user-published" event
            console.log("subscribe starting..........");
            await rtc.client.subscribe(user, mediaType);
            console.log("subscribe success!");

            // If the remote user publishes an audio track.
            if (mediaType === "audio") {
                // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
                const remoteAudioTrack = user.audioTrack;
                //remoteAudioTrack.setVolume(100);
                // Play the remote audio track.
                remoteAudioTrack.play();
            }

            // Listen for the "user-unpublished" event
            rtc.client.on("user-unpublished", async (user) => {
                // Unsubscribe from the tracks of the remote user.
                await rtc.client.unsubscribe(user);
            });

        });
    } 
    else
    {
        setTimeout(startBasicCall, 250);
    }
    //window.onload = function () {
// }
}   
startBasicCall();


async function Join() {
    console.log("join called in script js");
    // Join an RTC channel.
    console.log("rtc client:"+rtc.client);
    await rtc.client.join(options.appId, options.channel, options.token);
    // Create a local audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    //rtc.localAudioTrack.setVolume(200);
    // Publish the local audio tracks to the RTC channel.
    await rtc.client.publish([rtc.localAudioTrack]);

    console.log("publish success!");
}

async function Leave() {
    console.log("leave called in script js");
    // Destroy the local audio track.
    rtc.localAudioTrack.close();

    // Leave the channel.
    await rtc.client.leave();
}
function MuteAudio()
{
    if(!muted)
    {
        rtc.localAudioTrack.setEnabled(false);
        console.log("Audio Muted.");
        muted=true;
    } 
    else 
    {
        //localTracks.audioTrack.setEnabled(true);
        rtc.localAudioTrack.setEnabled(true);
        console.log("Audio Unmuted.");
        muted=false;
    }
}

window.Join = Join;
window.Leave = Leave;
window.MuteAudio=MuteAudio;
