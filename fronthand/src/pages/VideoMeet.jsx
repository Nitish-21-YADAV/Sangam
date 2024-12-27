import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { TextField, Button, IconButton, Badge, Tooltip } from '@mui/material';
import '../styles/VideoComponent.css'
import { io } from "socket.io-client";
import VideoCamIcon from '@mui/icons-material/Videocam'
import VideoCamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import '../styles/Polling.css'
import MoreVertIcon from '@mui/icons-material/MoreVert';

let server_url = `${import.meta.env.VITE_BACKEND_URL}`;

var connections = {}
const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}
function VideoMeetComponent() {

    const navigate = useNavigate()
    var socketRef = useRef();
    let socketIdRef = useRef()

    let localVideoRef = useRef()
    let [videoAvailable, setVideoAvailable] = useState(true)
    let [audioAvailable, setAudioAvailable] = useState(true)
    let [video, setVideo] = useState([])
    let [audio, setAudio] = useState([])
    let [screen, setScreen] = useState()
    let [showModal, setShowModal] = useState(true)
    let [screenAvailable, setSecreenAvailable] = useState()
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("")
    let [newMessages, setNewMessages] = useState(0)
    let [askForUsername, setAskForUsername] = useState(true)
    let [username, setUsername] = useState("")
    let [showChat, setShowChat] = useState(true)

    //
    const [pollName, setPollName] = useState("")
    const [options, setOptions] = useState([" ", " "])
    const [isCreated, setIscreated] = useState(true)
    const [pollingData, setPollingData] = useState(null)
    const [selectedOption, setSelectedOption] = useState('');
    const [createdNewPollData, setCreatedNewPollData] = useState([])
    const [createdPoll, setCreatedPoll] = useState([])
    const [vote, setVote] = useState({})
    let [pollingResults, setPollingResults] = useState([]);
    //
    const videoRef = useRef([])
    let [videos, setVideos] = useState([])
    const [polling, setPolling] = useState(false)
    let routeTo = useNavigate();

    const getPermissions = async () => {
        try {
            const videoPermissions = await navigator.mediaDevices.getUserMedia({ video: true })
            if (video) {
                setVideoAvailable(true)
            }
            else {
                setVideoAvailable(false)
            }
            const audioPermissions = await navigator.mediaDevices.getUserMedia({ audio: true })
            if (audio) {
                setAudioAvailable(true)

            }
            else {
                setAudioAvailable(false)

            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setSecreenAvailable(true)
            }
            else {
                setSecreenAvailable(false)
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable })
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream
                    }
                }
            }

        } catch (error) {
            console.log(error);

        }
    }
   
    useEffect(() => {
        getPermissions();
    }, [])

    let getUserMediaSuccess = (stream) => {
        try {
            if (window.localStream && window.localStream.getTracks) {
                window.localStream.getTracks().forEach(track => track.stop());
            } else {
                console.warn("No active local stream to stop.");
            }


        }
        catch (e) {
            console.log(e);

        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }
        stream.getTracks().forEach(track => track.onended = () => {
            setAudio(false)
            setVideo(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())

            } catch (error) {
                console.log(error);
            }

            // BlackSilance
            let balckSilance = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = balckSilance();
            localVideoRef.current.srcObject = window.localStream;



            for (let id in connections) {
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))         //incomp-------------
                        })
                })
            }
        })
    }


    let silence = () => {
        let ctx = new AudioContext()
        let oscilator = ctx.createOscillator();

        let dis = oscilator.connect(ctx.createMediaStreamDestination());

        oscilator.start();
        ctx.resume()
        return Object.assign(dis.stream.getAudioTracks()[0], { enabled: false })
    }
    // balcksilance
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });

        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }


    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then((getUserMediaSuccess))
                .then((stream) => {})
                .catch((e) => {
                    console.log("error in if getUsermedia: ", e);
                })
        }
        else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            } catch (error) {
                console.log("error in usermedia", error);

            }
        }
    }

    useEffect(() => {
        if ((video !== undefined) && (audio !== undefined)) {
            getUserMedia();
        }
    }, [audio, video])

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)
        
        if (!connections[fromId]) {
            connections[fromId] = new RTCPeerConnection(peerConfigConnections);
        }
        
        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === "offer") {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                            }).catch(error => console.log(error))
                        }).catch(error => console.log(error))
                    }
                }).catch(error => console.log(error))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }

    }

    let addMessage = (data, sender, scoektIdSender) => {

        setMessages((prevMessages) => [
            ...prevMessages,

            { sender: sender, data: data }


        ])

        if (scoektIdSender !== socketIdRef.current) {
            setNewMessages((prevMessages) => prevMessages + 1)
        }
    }

    let pollMessage = (pollData, sneder) => {

        setCreatedNewPollData((prevPolls) => [
            ...prevPolls,
            { sneder: sneder, pollData: pollData }
        ])
    }

    let pollResults = (pollId, updatedResults) => {
       setPollingResults((prevResults) => ({
            ...prevResults,
            [pollId]: updatedResults,
        }));
    };


    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on("poll-data", pollMessage)

            socketRef.current.on("poll-results", pollResults)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }


                    connections[socketListId].onaddstream = (event) => {
                       
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {

                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };



                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) {
                            console.log("--Error in--  :", e);

                        }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let getmedia = () => {
        setVideo(videoAvailable)
        setAudio(audioAvailable)
        connectToSocketServer();
    }

    let connect = () => {
        setAskForUsername(false)
        getmedia()
    }

    let handleVideo = () => {
        setVideo(!video)
    }

    let handleAudio = () => {
        setAudio(!audio)
    }

    let getDisplayMediaSuccess = (stream) => {

        try {
            window.localStream.getTracks().forEach(track => track.stop())

        } catch (error) {
            console.log(error);

        }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;


        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)
            connections[id].createOffer().then((description) => [
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch(e => console.log(e)
                    )
            ])
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())

            } catch (error) {
                console.log(error);
            }

            // BlackSilance
            let balckSilance = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = balckSilance();
            localVideoRef.current.srcObject = window.localStream;

            getUserMedia();


        })


    }


    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .then((stream) => { })
                    .catch(e => console.log(e))
            }
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia()
        }
    }, [screen])

    let handleScreen = () => {
        setScreen(!screen)
    }

    let handlesendMessage = () => {
        socketRef.current.emit("chat-message", message, username)
        setMessage('')
    }



    let handleCreatePolling = () => {

        setIscreated(false)
        const pollData = {
            pollName: pollName,
            optionValue: options.filter(option => option.trim() !== ""),
            pollId: Date.now().toString()
        }

        setCreatedPoll(pollData)
        socketRef.current.emit("create-poll", pollData, username)
    }

    // 

    let handleEndcall = () => {
        try {

            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop())

        } catch (error) {
            console.log(error);
        }
        routeTo("/home")

    }
    let handleChat = () => {
        setShowModal((prev) => !prev);
        setShowChat((prevState) => !prevState);
    }
    let handleHistory = () => {
        navigate("/history")
    }

    let handlePolling = () => {
        setPolling(!polling)
        setIscreated(true);
    }

    // 
    const handleRemove = (index) => {

        const newOptionArray = options.filter((_, i) => i !== index)
        setOptions(newOptionArray)
    }

    let handleAddOptions = () => {
        setOptions([...options, ""])
    }

    let updateValue = (index, value) => {

        const updatedOptions = [...options]
        updatedOptions[index] = value;
        setOptions(updatedOptions)
    }

    const handleVote = (option, pollId) => {
        setVote((prevVotes) => ({
            ...prevVotes,
            [option]: (prevVotes[option] || 0) + 1,
        }));

        socketRef.current.emit("vote", option, pollId);
    }

    return (
        <div className='home'>
            <nav>
                <h2><span style={{ color: "yellow" }}>S</span>angam</h2>
                <div className='nav-Lfet'>
                    <button onClick={handleHistory}>History</button>
                    <button onClick={() => {
                        localStorage.removeItem("token:")
                        localStorage.removeItem("email")
                        navigate("/")
                    }}>LogOut</button>
                </div>

            </nav>
            {(askForUsername) === true ?
                <div className='home-MainContent'>
                    <div className="left-com">
                        <div className='inner-left-com'>
                            <h1><span style={{ color: "yellow" }}>S</span>angam:Your Personalized Video Call</h1><hr />
                            <h2>Seamless Video Communication</h2>
                            <p>Connect with your loved ones or collaborate with your team in high-definition video calls.</p>
                            <h2>Enter in Lobby </h2>
                            <div className="joinCall-conatiner">
                                <TextField id="outlined-search" label="UserName" value={username} onChange={e => setUsername(e.target.value)} sx={{ color: "white", backgroundColor: "white", width: "70%", border: "none" }} />
                                <Button variant="contained" onClick={connect} >Connect</Button>
                            </div>
                        </div>
                    </div>
                    <div className="right-com" style={{ height: "60%", margin: "auto 0" }}>
                        <video ref={localVideoRef} autoPlay muted style={{ height: "100%" }}></video>
                    </div>

                </div> :
                <div className={`meetVideoContainer ${showModal ? 'uservideo-open' : ''}`}>
                    <div className={`chatromm-conference-conatiner ${showChat ? 'chat-open' : ''}`}>

                        {showModal ? (<div className='chatRoom' style={{ color: "black" }}>
                            <div className='chatContainer' >
                                <h1 style={{ color: "black" }}>Chat</h1>
                                <div className='chattingDisplay'>

                                    {messages.length > 0 ? messages.map((item, index) => {
                                        return (<div key={index} style={{ marginBottom: "20px", color: "black" }}>
                                            <p style={{ fontWeight: "bold", color: "black" }}>{item.sender}</p>
                                            <p style={{ color: "black" }}>{item.data}</p>
                                        </div>)
                                    }) : <p style={{ color: "black" }}>Start To Chat</p>}
                                    {/* {polling === true ?<Polling/> :<></>} */}
                                    {polling === true ?
                                        (<>
                                            <div className='Polling-Conatiner'>
                                                <div className='Polling-Main-Conatiner'>
                                                    {isCreated === true ? (
                                                        <>
                                                            <div class="mb-3">
                                                                <input type="text" onChange={(e) => setPollName(e.target.value)} value={pollName} className="form-control" id="exampleFormControlInput1" placeholder="Title" />
                                                            </div>

                                                            {options.map((option, index) => (
                                                                // return(
                                                                <div key={index} className='seleceAddValue'>
                                                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value={option} />
                                                                    <input type="text" value={option} className="form-control" id="exampleFormControlInput1" placeholder="Add Option"
                                                                        onChange={(e) => updateValue(index, e.target.value)}
                                                                    />
                                                                    <button onClick={() => { handleRemove(index) }}>X</button>
                                                                    
                                                                </div>
                                                            ))}
                                                            <div className='Polling-Button'>
                                                                <button onClick={handleAddOptions}>+ Add</button>
                                                                <button onClick={() => setIscreated(false)}>View</button>
                                                                <button onClick={handleCreatePolling}>Submit</button>
                                                            </div>
                                                        </>
                                                    ) :
                                                        (
                                                            <>
                                                                {createdNewPollData.length > 0 ? (
                                                                    <>
                                                                        {createdNewPollData.map((pollDataItem, index) => (
                                                                            <div key={index} className="Polling-Main-Conatiner">
                                                                                <div className='Output-conatiner'>
                                                                                <h3>{pollDataItem.pollData.pollName}</h3>
                                                                                {pollDataItem.pollData.optionValue.map((option, index) => (
                                                                                    <div key={index} className="option-Conatiner-poll">
                                                                                            <input
                                                                                            className="form-check-input"
                                                                                            type="radio"
                                                                                            name="pollOptions"
                                                                                            id={`radio${index}`}
                                                                                            value={option}
                                                                                            checked={selectedOption === option}
                                                                                            onChange={() => handleVote(option, pollDataItem.pollData.pollId)}
                                                                                        />
                                                                                        {option} - {pollingResults[pollDataItem.pollData.pollId]?.find(
                                                                                            (result) => result.optionName === option
                                                                                        )?.timeOfOptions || 0} votes

                                                                                    </div>
                                                                                ))}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                ) : (<></>)
                                                                }
                                                            </>
                                                        )
                                                    }
                                                </div>

                                            </div>
                                        </>) : <></>}
                                </div>
                                <div className='chattingArea'>
                                    <Tooltip title="Polling" arrow>
                                        <IconButton onClick={handlePolling}>
                                            <MoreVertIcon sx={{ backgroundColor: "black" }} />
                                        </IconButton>
                                    </Tooltip>
                                    <TextField value={message} onChange={(e) => {
                                        setMessage(e.target.value)
                                    }}
                                        id="filled-basic" label="Enter Your Message" variant="outlined"
                                        sx={{
                                            width: '100%',
                                            height: '90%',
                                            marginBottom: '0px', padding: '0px'
                                        }}
                                    />
                                    <Button variant="contained" onClick={handlesendMessage}>Send</Button>
                                </div>
                            </div>
                        </div>) : <></>}
                        <div className='conferenceView'>

                            {videos.map((video) => (

                                <div key={video.socketId} style={{ height: "20%" }}>
                                    {/* <h2>SocktId: {video.socketId}</h2> */}
                                    <video
                                        style={{ height: "100%" }}
                                        data-socket={video.socketId}
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream
                                            }
                                        }}
                                        autoPlay
                                    ></video>
                                </div>

                            ))}
                        </div>
                    </div>

                    <div className='buttonContainers'>
                        <IconButton onClick={handleVideo}>
                            {video === true ? <VideoCamIcon /> : <VideoCamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleAudio}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndcall} style={{ backgroundColor: "red" }}>
                            <CallEndIcon />
                        </IconButton>
                        {screenAvailable === true ? (
                            <IconButton onClick={handleScreen}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton>) : <></>

                        }
                        <Badge badgeContent={newMessages} max={999} color='orange'>
                            <IconButton onClick={handleChat}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                        
                    </div>

                    <video className='meetUserVideo' ref={localVideoRef} autoPlay muted></video>


                </div>
            }
        </div >
    );
}

export default VideoMeetComponent;