'use client';
import { useState, useEffect } from 'react';
import { players } from '@/data/players';

export default function AdminPage() {
  const [channel, setChannel] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [status, setStatus] = useState('WAITING'); // WAITING, ACTIVE, SOLD, UNSOLD

  // 1. Setup Broadcast Channel on Mount
  useEffect(() => {
    const bc = new BroadcastChannel('auction_channel');
    setChannel(bc);
    return () => bc.close();
  }, []);

  // 2. Helper to send updates to the Display Page
  const broadcastUpdate = (playerId, bid, statusText) => {
    if (channel) {
      channel.postMessage({
        type: 'UPDATE',
        data: { playerId, bid, status: statusText }
      });
    }
  };

  // 3. Actions
  const selectPlayer = (id) => {
    const player = players.find(p => p.id === id);
    setCurrentId(id);
    setCurrentBid(player.basePrice);
    setStatus('ACTIVE');
    broadcastUpdate(id, player.basePrice, 'ACTIVE');
  };

  const increaseBid = (amount) => {
    const newBid = currentBid + amount;
    setCurrentBid(newBid);
    broadcastUpdate(currentId, newBid, 'ACTIVE');
  };

  const markSold = () => {
    setStatus('SOLD');
    broadcastUpdate(currentId, currentBid, 'SOLD');
  };

  const markUnsold = () => {
    setStatus('UNSOLD');
    broadcastUpdate(currentId, currentBid, 'UNSOLD');
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex gap-6">
      {/* Sidebar: Player List */}
      <div className="w-1/3 bg-white p-4 rounded shadow h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Select Player</h2>
        {players.map((p) => (
          <div 
            key={p.id} 
            onClick={() => selectPlayer(p.id)}
            className={`p-3 border-b cursor-pointer hover:bg-blue-50 ${currentId === p.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
          >
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-gray-500">{p.role} - {p.basePrice}L</p>
          </div>
        ))}
      </div>

      {/* Main Control Panel */}
      <div className="w-2/3 bg-white p-6 rounded shadow flex flex-col items-center justify-center">
        {currentId ? (
          <>
            <h1 className="text-3xl font-bold mb-2">{players.find(p => p.id === currentId).name}</h1>
            <p className="text-gray-500 text-xl mb-6">Current Status: <span className="font-bold text-blue-600">{status}</span></p>
            
            <div className="text-6xl font-mono font-bold text-green-600 mb-8">
              ₹ {currentBid} L
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <button onClick={() => increaseBid(5)} className="p-4 bg-green-100 text-green-800 rounded hover:bg-green-200 font-bold">+ 5 Lakhs</button>
              <button onClick={() => increaseBid(20)} className="p-4 bg-green-100 text-green-800 rounded hover:bg-green-200 font-bold">+ 20 Lakhs</button>
              <button onClick={() => increaseBid(50)} className="p-4 bg-green-100 text-green-800 rounded hover:bg-green-200 font-bold">+ 50 Lakhs</button>
              <button onClick={() => increaseBid(100)} className="p-4 bg-green-100 text-green-800 rounded hover:bg-green-200 font-bold">+ 1 Crore</button>
            </div>

            <div className="flex gap-4 mt-8 w-full max-w-md">
              <button onClick={markUnsold} className="flex-1 p-4 bg-red-500 text-white font-bold rounded hover:bg-red-600">UNSOLD</button>
              <button onClick={markSold} className="flex-1 p-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">SOLD</button>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Select a player from the list to start.</p>
        )}
      </div>
    </div>
  );
}
