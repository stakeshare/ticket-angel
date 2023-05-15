import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { db } from '../ticketData';

function EventRegistration({ ticketEventBlockchain, account }) {
    const history = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [filePath, setFilePath] = useState('');

    const createEvent = async (e) => {
        try{
            e.preventDefault();
            const startDate = date + ' ' + time;
            const weiAmount = new ethers.utils.parseUnits(ticketPrice, 'ether');
            const transaction = await ticketEventBlockchain.createEvent(name, description, startDate, location, weiAmount, quantity, filePath);
            const tx = await transaction.wait();
            await db.collection("Ticket").create(["1", name, description, startDate, location, ticketPrice, quantity, filePath]); 
            
            history('/');
        }
        catch(err){
            console.error(err);
        }
    }

    async function upload(){
       
    }

    return (
        <div className="container">
            <div className="card mt-3" style={{ maxWidth: '600px', margin: 'auto'}}>
                <div className="card-body">
                    <h2 className="card-title text-center text-warning">Event Registration</h2>

                    <form className="mt-3" onSubmit={createEvent}>
                        <div className="form-group">
                            <label className="font-weight-bold">Name of your event</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="font-weight-bold">Description</label>
                            <textarea
                                className="form-control"
                                type="text"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}></textarea>    
                        </div>

                        <div className="form-group">
                            <label className="font-weight-bold">Event URL</label>
                            <input
                                type="text"
                                className="form-control"
                                value={filePath}
                                onChange={(e) => setFilePath(e.target.value)} />
                        </div>

                        {/* <div className="form-group mb-3">
                            <label className="font-weight-bold">Image</label>
                            <br />
                            <input
                                onChange={(e) => upload(e)} 
                                type="file"
                                id="files" />
                        </div> */}

                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label className="font-weight-bold">Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}/>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label className="font-weight-bold">Time</label>
                                    <input
                                        className="form-control"
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        

                        <div className="form-group">
                            <label className="font-weight-bold">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)} />
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label className="font-weight-bold">Ticket Price (In BNB)</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        value={ticketPrice}
                                        min="0"
                                        step="0.1"
                                        onChange={(e) => setTicketPrice(e.target.value)} />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label className="font-weight-bold">Available Quantity</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center">
                            <button className="btn btn-danger btn-lg" type="submit" disabled={!account}>
                                Register Event
                            </button>
                            <p className="text-muted mt-3 ml-2">
                                * Registration Cost: 0.1 BNB
                            </p>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EventRegistration;
