// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TicketToken is ERC20 {
    address public minter;

    event MinterChanged(address indexed from, address to);

    constructor() payable ERC20("Ticket Token", "TKT") {
        minter = msg.sender;
    }

    function passMinterRole(address ticketEvent) public returns (bool) {
        require(msg.sender == minter, "You cannot change minter role");
        minter = ticketEvent;
        
        emit MinterChanged(msg.sender, ticketEvent);
        return true;
    }

    function mint(address account, uint256 amount) public {
        require(msg.sender == minter, "You cannot mint a token");

        _mint(account, amount);
    }
}