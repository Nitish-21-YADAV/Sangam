import React from 'react';
import '../styles/history.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function History() {
    const [historyData, setHistoryData] = useState([]);
    const email = localStorage.getItem("email")
    
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/getUserHistory/${email}`
                const response = await fetch(url);
                const data = await response.json();        
                setHistoryData(data)
            } catch (error) {
                console.log(error);
            }
        }

        fetchHistory()

    }, [])

    
    return (
        <div className='home'>
            <nav>
                <h1><span style={{ color: "yellow" }}>S</span>angam</h1>
                <div className='nav-Lfet'>
                    <button >History</button>
                    <button onClick={() => {
                        navigate("/home")
                    }}>Home</button>
                </div>
            </nav>
            <div className='history-container'>
                <h1>History</h1>
                <p>Explore the past meetings and sessions that have shaped our journey. Each entry represents a step towards growth, collaboration, and achievement.</p>
                <div className='history-main-conatiner'>
                <table >
                    <tr>
                        <th>Meeting Code</th>
                        <th>Date</th>
                    </tr>    
                    <hr />
                </table>    
                <div className='history-data'>
                    {historyData.map((item)=>{
                        return(
                            <tr key={item._id}>
                                <td >{item.meetingCode}</td>
                                <td> {item.date}</td>
                            </tr>
                            
                        )
                    })}
                </div>
                </div>

            </div>
            


        </div>
    );
}

export default History;