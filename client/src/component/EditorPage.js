import React, { useEffect, useRef, useState } from 'react'
import Client from './Client'
import Editor from './Editor'
import { initSocket } from '../socket';
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
    const [clients, setClient] = useState([]);
    const location = useLocation();
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const { roomId } = useParams();
    const navigate = useNavigate();

    const handleError = (err) => {
        console.log('Socket error', err);
        toast.error("Socket connection Failed");
        navigate("/");
    };

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleError);
            socketRef.current.on('connect_failed', handleError);
    
            socketRef.current.emit('join', {
                roomId,
                username: location.state?.username,
            });   
            socketRef.current.on('joined', ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined`);
                }
            
                // Create a Set to store unique client names
                const uniqueClients = new Set(clients.map(client => client.username));
                
                // Add the new client name to the Set
                uniqueClients.add(username);
            
                // Convert the Set back to an array of objects
                const updatedClients = Array.from(uniqueClients).map(username => ({
                    socketId: clients.find(client => client.username === username)?.socketId || null,
                    username
                }));
            
                // Update the state with the modified array
                setClient(updatedClients);
                socketRef.current.emit('sync-code', {
                    code: codeRef.current,
                    socketId,
                });
            });
            //  disconnected
            socketRef.current.on('disconnected',({socketId,username})=>{
                toast.success(`${username} leave`);
                setClient((prev)=>{
                    return prev.filter(
                        (client) => client.socketId !== socketId
                    )
                })
            })          
            
        }
        init();
    
        // Cleanup function
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect(); // Check if socketRef.current is not null before calling disconnect
                socketRef.current.off('joined');
                socketRef.current.off('disconnected');
            }
        };
    }, [roomId, location.state?.username, navigate]);
    

    if(!location.state){
        return <Navigate to="/"/>
    }

    const copyRoomId = async () => {
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success("Room Id is Copied");
        }
        catch(error){
            toast.error("Unable to copy roomId");
        }
    }

    const leaveRoom = () =>{
        navigate("/");
    }

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-md-2 bg-dark text-light d-flex flex-column h-100" style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.1)" }}>
                    <img
                        src="/code-sync.png"
                        alt="Img not found"
                        className='img-fluid mx-auto'
                        style={{ maxWidth: "150px", marginTop: "4px" }}
                    />
                    <hr />
                    {/* Client List Container */}
                    <div className="d-flex flex-column overflow-auto">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>

                    {/* button */}
                    <div className="mt-auto">
                        <hr />
                        <button onClick={copyRoomId} className='btn btn-success'>Copy Room Id</button>
                        <button onClick={leaveRoom} className='btn btn-danger mt-2 mb-2 px-3 btn-block'>
                            Leave Room
                        </button>
                    </div>
                </div>
                <div className="col-md-10 text-light d-flex flex-column h-100">
                    <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>codeRef.current = code}/>
                </div>
            </div>
        </div>
    )
}

export default EditorPage;
