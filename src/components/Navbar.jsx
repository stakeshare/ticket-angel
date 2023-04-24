import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

import { TicketEventABI, TicketEventAddress } from '../contract';

function Navbar({ account, setAccount, tokens, setTicketEventBlockchain }) {
    const openWithMetaMask = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = ethers.utils.getAddress(accounts[0]);
        setAccount(currentAccount);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(TicketEventAddress, TicketEventABI, signer);
        setTicketEventBlockchain(contract);
    }
    
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand mb-0 h1 p-0" to="/">
                   <p>Ticket Angel</p>
                </Link>
                <div className="d-flex align-items-center">
                    {account && <p className="badge mt-3 mr-3">
                    {window.web3.utils?.fromWei(tokens.toString(), 'Ether')} TST
                    </p>}
                    
                    <button
                        className="btn btn-warning my-2 my-sm-0 ml-2"
                        onClick={openWithMetaMask}
                    >
                        {account ? account.substring(0, 7) + '...' + account.substring(35, 42) : 'Open Wallet'}
                    </button>
                </div>
                
            </div>
            
        </nav>
    )
}

export default Navbar;
