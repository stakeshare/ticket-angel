import React,{ useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { db } from '../ticketData';

function Main({ ticketEventBlockchain, }) {
    const [ticketEvents, setTicketEvents] = useState([]);

    useEffect(() => {
        const getTicketEvents = async () => {
            const { data } = await db.collection("Ticket").get();
            setTicketEvents(data);
        }
        getTicketEvents();
    }, [])

    
    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <h1>List of Events</h1>
                <Link to="/eventregistration" className="btn btn-danger btn-lg my-3">
                    Create Event
                </Link>
            </div>
           

            { ticketEvents.map(ticketEvent => (
                <div className="card" key={ticketEvent.data.id}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-6" >
                                <h2><Link to={`/event/${ticketEvent.data.id}`}>{ticketEvent.data.name}</Link></h2>
                                <p><strong>Start Date:</strong> {ticketEvent.data.startDate}</p>
                                <p><strong>Location: </strong>{ticketEvent.data.location}</p>
                                <p><strong>Cost: </strong>{ticketEvent.data.weiAmount} BIT</p>
                            </div>
                            <div className="col-sm-6 d-flex flex-column align-items-end">
                                <Link className="btn btn-outline-warning btn-lg mt-4 mb-2" style={{ width: '250px'}} to={`/event/${ticketEvent.data.id}`}>
                                    See Event Detail
                                </Link>
                                <Link className="btn btn-outline-danger btn-lg" style={{ width: '250px'}} to={`/event/${ticketEvent.data.id}`}>
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
