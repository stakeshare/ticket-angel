import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';

import Background from '../assets/background.png';

function EventDetail({ ticketEventBlockchain, getBalance, account }) {
    const { id, referLink, referer } = useParams();
    const [ticketEvent, setTicketEvent] = useState({});
    const [isReferer, setIsReferer] = useState(false);
    const [point, setPoint] = useState('0');

    useEffect(() => {
        const getTicketEvents = async () => {
            const event = await ticketEventBlockchain.tickets(id);
            setTicketEvent(event);
        }

        const getUserReward = async () => {
            const reward = await ticketEventBlockchain.getUserPoint(id, referLink || account, account);
            setPoint(reward);
        }

        const checkUserIsReferer = async () => {
            const isReferer = await ticketEventBlockchain.userIsReferer(id, referLink || account, account);
            setIsReferer(isReferer);
        }

        if(ticketEventBlockchain){
            getTicketEvents();
            checkUserIsReferer();
            getUserReward()
        }

    }, [ticketEventBlockchain, id, account, referLink])

    console.log(ticketEvent)

    const createReferer = async () => {
        if(referLink){
            const transaction = await ticketEventBlockchain.addReferer(id, referLink);
            const tx = await transaction.wait();
        }
        else{
            const transaction = await ticketEventBlockchain.createReferer(id);
            const tx = await transaction.wait();
        }

        setIsReferer(true);
    }
    
    const purchaseTicket = async () => {
        const transaction = await ticketEventBlockchain.sendPoints(id, referLink, referer || referLink );
        const tx = await transaction.wait();
        console.log(tx);

        const reward = await ticketEventBlockchain.getUserPoint(id, referLink || account, account);
        console.log(reward)
        setPoint(reward);
    }

    const copyRefererLink = () => {
        if(referer){
            navigator.clipboard.writeText(`${window.location.href}/${account}/${referer}`);
        }
        else{
            navigator.clipboard.writeText(`${window.location.href}/${account}`);
        }
    }

    const claimToken = async () => {
        try{
            await ticketEventBlockchain.methods.withdrawTokens(id, referLink || account, account).send({ from: account });
            setPoint(0);
            getBalance();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="container">
            <div className="row mt-4">
                <div className="col-sm-12 col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <h2 className="text-warning">{ticketEvent?.name}</h2>
                                <button className="btn btn-danger mb-4" onClick={purchaseTicket}>
                                    Purchase Ticket
                                </button>
                            </div>
                            <p>Start at {ticketEvent?.date}</p>
                            <p>Location: {ticketEvent?.location}</p>
                            <p>{ticketEvent?.description}</p>
                            <h4>
                                Ticket Price: {ticketEvent?.ticketPrice && ethers.utils.formatEther(ticketEvent.ticketPrice.toString())} BIT
                            </h4>
                            
                            <p></p>
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 col-md-4">
                    <img className="img-fluid" src={ticketEvent?.imagePath || Background} alt="Event" />
                </div>
            </div>
            <h2 className="mt-3">Promote Event to earn reward tokens</h2>
            { isReferer ? (
                <>
                    <button className="btn btn-success" onClick={copyRefererLink}>
                        Copy Link
                    </button>
                    
                </>
            ) : <button className="btn btn-success" onClick={createReferer}>
                    Create Referer Link
                </button>
            }
            <p className="mt-3"><strong>Your reward:</strong> {ethers.utils.formatEther(point.toString())} TSH</p>
            {point != 0 && <button className="btn btn-warning" onClick={claimToken}>
                Claim TST
            </button> }
        </div>
    )
}

export default EventDetail;
