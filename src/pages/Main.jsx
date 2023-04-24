import React,{ useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

function Main({ ticketEventBlockchain, }) {
    const [ticketEvents, setTicketEvents] = useState([]);

    useEffect(() => {
        const getTicketEvents = async () => {
            let temp = [];

            const ticketEventCount = await ticketEventBlockchain.ticketEventCount();

            for(let i = 0; i < ticketEventCount; i++){
                const event = await ticketEventBlockchain.tickets(i + 1);
                temp.push(event);
            }

            setTicketEvents(temp);
        }
        if(ticketEventBlockchain) getTicketEvents();
    }, [ticketEventBlockchain])

    
    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <h1>List of Events</h1>
                <Link to="/eventregistration" className="btn btn-danger btn-lg my-3">
                    Register Event
                </Link>
            </div>
           

            { ticketEvents.map(ticketEvent => (
                <div className="card" key={ticketEvent.eventId}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-6" >
                                <h2><Link to={`/event/${ticketEvent.eventId}`}>{ticketEvent.name}</Link></h2>
                                <p><strong>Start Date:</strong> {ticketEvent.date} {ticketEvent.time}</p>
                                <p><strong>Location: </strong>{ticketEvent.location}</p>
                                <p><strong>Cost: </strong>{ethers.utils.formatEther(ticketEvent.ticketPrice.toString())} BIT</p>
                            </div>
                            <div className="col-sm-6 d-flex flex-column align-items-end">
                                <Link className="btn btn-outline-warning btn-lg mt-4 mb-2" style={{ width: '250px'}} to={`/event/${ticketEvent.eventId}`}>
                                    See Event Detail
                                </Link>
                                <Link className="btn btn-outline-danger btn-lg" style={{ width: '250px'}} to={`/event/${ticketEvent.eventId}`}>
                                    Earn Promotion Reward
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Main;
