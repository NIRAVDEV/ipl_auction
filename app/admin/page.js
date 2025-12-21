'use client';
import { useState, useEffect } from 'react';
import { players } from '../data/players';
import { teams } from '../data/teams';

export default function AdminPage() {
  const [channel, setChannel] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [currentBidder, setCurrentBidder] = useState(null); // Which team holds the bid
  const [status, setStatus] = useState('WAITING');

  useEffect(() => {
    const bc = new BroadcastChannel('auction_channel');
    setChannel(bc);
    return () => bc.close();
  }, []);

  // Helper to sync data
  const broadcastUpdate = (playerId, bid, bidder, statusText) => {
    if (channel) {
      channel.postMessage({
        type: 'UPDATE',
        data: { playerId, bid, bidder, status: statusText }
      });
    }
  };

  const playSound = (type) => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play().catch(e => console.log("Audio play failed", e));
  };

  const selectPlayer = (id) => {
    const player = players.find(p => p.id === id);
    setCurrentId(id);
    setCurrentBid(player.basePrice);
    setCurrentBidder(null); // Reset bidder
    setStatus('ACTIVE');
    broadcastUpdate(id, player.basePrice, null, 'ACTIVE');
  };

  const increaseBid = (amount) => {
    const newBid = currentBid + amount;
    setCurrentBid(newBid);
    // Note: We keep the same bidder when raising price, 
    // or you can force admin to re-select team. Keeping same is faster.
    broadcastUpdate(currentId, newBid, currentBidder, 'ACTIVE');
  };

  const assignBidder = (team) => {
    setCurrentBidder(team);
    broadcastUpdate(currentId, currentBid, team, 'ACTIVE');
  };

  const markSold = () => {
    setStatus('SOLD');
    playSound('sold');
    broadcastUpdate(currentId, currentBid, currentBidder, 'SOLD');
  };

  const markUnsold = () => {
    setStatus('UNSOLD');
    playSound('unsold');
    broadcastUpdate(currentId, currentBid, null, 'UNSOLD'); // No winner
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex gap-4">
      {/* 1. Player List Sidebar */}
      <div className="w-1/4 bg-white p-4 rounded shadow h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Players</h2>
        {players.map((p) => (
          <div 
            key={p.id} 
            onClick={() => selectPlayer(p.id)}
            className={`p-2 border-b cursor-pointer hover:bg-blue-50 text-sm ${currentId === p.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
          >
            <span className="font-bold">{p.name}</span> <span className="text-gray-500">({p.basePrice}L)</span>
          </div>
        ))}
      </div>

      {/* 2. Main Control Area */}
      <div className="w-3/4 flex flex-col gap-4">
        
        {/* Top: Current Status */}
        <div className="bg-white p-6 rounded shadow flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{currentId ? players.find(p => p.id === currentId).name : 'Select Player'}</h1>
            <p className="text-gray-500">Current Bid: <span className="text-3xl font-mono text-green-600 font-bold">{currentBid} L</span></p>
          </div>
          <div className="text-right">
             <p className="text-gray-400 text-sm uppercase">Current Bidder</p>
             {currentBidder ? (
               <div className={`text-xl font-bold px-4 py-2 rounded text-white ${currentBidder.color}`}>
                 {currentBidder.name}
               </div>
             ) : (
               <div className="text-gray-300 italic">None</div>
             )}
          </div>
        </div>

        {/* Middle: Team Selector Grid */}
        <div className="bg-white p-6 rounded shadow">
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase">Assign Bid To Team</h3>
            <div className="grid grid-cols-5 gap-3">
                {teams.map((team) => (
                    <button 
                        key={team.id}
                        onClick={() => assignBidder(team)}
                        className={`p-3 rounded border-2 flex flex-col items-center justify-center hover:bg-gray-50 transition-all
                            ${currentBidder?.id === team.id ? 'border-green-500 bg-green-50 shadow-md transform scale-105' : 'border-gray-200'}
                        `}
                    >
                        {/* Placeholder for Logo */}
                        <div className={`w-8 h-8 rounded-full mb-1 ${team.color}`}></div> 
                        <span className="font-bold text-sm">{team.name}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Bottom: Bid Controls */}
        <div className="bg-white p-6 rounded shadow grid grid-cols-2 gap-8">
            <div>
                <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase">Raise Bid</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[5, 10, 20, 50, 100].map((amt) => (
                        <button key={amt} onClick={() => increaseBid(amt)} className="py-3 bg-gray-100 hover:bg-gray-200 font-bold rounded">
                            + {amt} L
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex flex-col justify-end gap-3">
                <button onClick={markSold} disabled={!currentBidder} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded disabled:opacity-50 disabled:cursor-not-allowed">
                    SOLD
                </button>
                <button onClick={markUnsold} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded">
                    UNSOLD
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
