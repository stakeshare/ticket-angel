// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./TicketToken.sol";

contract TicketEvent {
    TicketToken private token;
    string public name = "Ticket Event";
    uint public ticketEventCount = 0;
    mapping(uint => Ticket) public tickets;
    mapping(address => mapping(uint => TicketRef)) public ticketRefList;

    struct Ticket {
        uint eventId;
        string name;
        string description;
        string date;
        string location;
        uint ticketPrice;
        uint quantity;
        string imagePath;
        address payable owner;
    }

    struct TicketRef {
        uint eventId;
        address[] users;
        uint[] points;
    }

    event TicketCreated (
        uint eventId,
        string name,
        string description,
        string date,
        string location,
        uint ticketPrice,
        uint quantity,
        string imagePath,
        address payable owner
    );

    event TicketRefLog(
        uint eventId,
        address[] users,
        uint[] points
    );

    constructor(TicketToken _token) {
        token = _token;
    }

    function getUserPoint(uint _eventId, address _refer, address account) external view returns (uint){
        TicketRef storage _ticketRef = ticketRefList[_refer][_eventId];
        
        uint len = _ticketRef.users.length;
        for(uint i = 0; i < len; i++){
            if(_ticketRef.users[i] == account){
                return _ticketRef.points[i];
            }
        }
        
        return 0;
    }

    function userIsReferer(uint _eventId, address _refer, address account) external view returns (bool){
        TicketRef storage _ticketRef = ticketRefList[_refer][_eventId];
        
        uint len = _ticketRef.users.length;
        for(uint i = 0; i < len; i++){
            if(_ticketRef.users[i] == account){
                return true;
            }
        }
        
        return false;
    }

    function createEvent(string memory _name, string memory _description, string memory _date, string memory _location, uint _ticketPrice, uint _quantity, string memory _imagePath) external {
        ticketEventCount++;

        tickets[ticketEventCount] = Ticket(ticketEventCount, _name, _description, _date, _location, _ticketPrice, _quantity, _imagePath, payable(msg.sender));
        emit TicketCreated(ticketEventCount, _name, _description, _date, _location, _ticketPrice, _quantity, _imagePath, payable(msg.sender));
    }

    // a user sign up for refer
    function createReferer(uint _eventId) external {
        ticketRefList[msg.sender][_eventId] = TicketRef(_eventId, new address[](0), new uint[](0));
        ticketRefList[msg.sender][_eventId].users.push(msg.sender);
        ticketRefList[msg.sender][_eventId].points.push(0);
        emit TicketRefLog(_eventId, ticketRefList[msg.sender][_eventId].users, ticketRefList[msg.sender][_eventId].points);
    }
    
    // friend of friend sign up for refer
    function addReferer(uint _eventId, address referLink) external {
        TicketRef storage _ticketRef = ticketRefList[referLink][_eventId];
        _ticketRef.users.push(msg.sender);
        _ticketRef.points.push(0);
        ticketRefList[referLink][_eventId] = _ticketRef;
        emit TicketRefLog(_eventId, _ticketRef.users, _ticketRef.points);
    }
    
    function sendPoints(uint _eventId, address referLink, address referer) public {
        TicketRef storage _ticketRef = ticketRefList[referLink][_eventId];
        uint len = _ticketRef.points.length;
        for(uint i = 0; i < len; i++){
            if( _ticketRef.users[i] == referer){
                _ticketRef.points[i] += 1000000000000000000;
            }
            else{
                _ticketRef.points[i] += 500000000000000000;
            }
        }
        ticketRefList[referLink][_eventId] = _ticketRef;
        emit TicketRefLog(_eventId, _ticketRef.users, _ticketRef.points);
    }

    function withdrawTokens(uint _eventId, address _referLink, address _referer) external {
        TicketRef storage _ticketRef = ticketRefList[_referLink][_eventId];
        uint len = _ticketRef.points.length;
        
        for(uint i = 0; i < len; i++){
            if( _ticketRef.users[i] == _referer){
                token.mint(msg.sender, _ticketRef.points[i]);
                _ticketRef.points[i] = 0;
                emit TicketRefLog(_eventId, _ticketRef.users, _ticketRef.points);
            }
        }

        ticketRefList[_referLink][_eventId] = _ticketRef;
    }
    
}