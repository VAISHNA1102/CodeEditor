import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const generateRoomID = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Room Id generated");
  }

  const joinRoom = () => {
    if(!roomId || !username){
        toast.error("Room Id and Username required");
        return;
    }
    navigate(`/editor/${roomId}`, { 
        state: {
            username,
        },
    });
    toast.success("Room is Created");
};


const handleInputEnter = (e) => {
    if(e.code === 'Enter'){
        joinRoom();
    }
}
  return (
    <div className='container-fluid'>
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-2 mb-5 bg-secondry rounded">
            <div className="card-body text-center bg-dark">
              <img
                className='img-fluid mx-auto d-block'
                src="/code-sync.png"
                alt="Code-Editor Logo"
                style={{ maxWidth: "150px" }}
              />
              <h4 className='text-light'>
                Enter the Room Id
              </h4>
              <div className="form-group">
                <input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  type="text"
                  className='form-control mb-2'
                  placeholder="RoomId" 
                  onKeyUp={handleInputEnter}
                  />
              </div>
              <div className="form-group">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className='form-control mb-2'
                  placeholder="Username"
                  onKeyUp={handleInputEnter}
                />
              </div>
              <button 
              className='btn btn-success btn-lg btn-block'
              onClick={joinRoom}
              >
                Join
              </button>
              <p className='mt-3 text-light'>
                Don't have a room Id?{" "}
                <span
                  className='text-success p-2'
                  style={{ cursor: "pointer" }}
                  onClick={generateRoomID}
                >
                  New Room
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
