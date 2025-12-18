'use client';
import { useState, useEffect } from 'react';
import { players } from '@/data/players';

export default function DisplayPage() {
  const [currentId, setCurrentId] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [status, setStatus] = useState('WAITING');

  useEffect(() => {
    // Listen for updates from the Admin page
    const bc = new BroadcastChannel('auction_channel');
    
    bc.onmessage = (event) => {
      if (event.data.type === 'UPDATE') {
        setCurrentId(event.data.data.playerId);
        setCurrentBid(event.data.data.bid);
        setStatus(event.data.data.status);
      }
    };

    return () => bc.close();
  }, []);

  const currentPlayer = players.find(p => p.id === currentId);

  if (!currentPlayer) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-5xl font-bold tracking-widest animate-pulse">IPL AUCTION 2025</h1>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white flex overflow-hidden">
      
      {/* Left: Player Image */}
      <div className="w-1/2 flex items-center justify-center p-10 relative">
        <div className="absolute inset-0 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
        {/* Replace with <Image> tag in real code */}
        <div className="w-[400px] h-[400px] bg-gray-700 rounded-full flex items-center justify-center border-4 border-yellow-500 z-10 text-xl">
           {/* If you have images, use: <img src={currentPlayer.image} className="w-full h-full object-cover rounded-full" /> */}
           [ Player Image Placeholder ]
        </div>
      </div>

      {/* Right: Stats and Bid */}
      <div className="w-1/2 flex flex-col justify-center p-12 space-y-8">
        
        <div>
          <h2 className="text-2xl text-yellow-400 font-semibold tracking-wide uppercase mb-2">{currentPlayer.role}</h2>
          <h1 className="text-6xl font-bold font-serif mb-4">{currentPlayer.name}</h1>
          <div className="flex gap-4 text-gray-300">
            {Object.entries(currentPlayer.stats).map(([key, value]) => (
              <span key={key} className="bg-white/10 px-3 py-1 rounded uppercase text-sm">
                {key}: {value}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Bid Section */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
          <p className="text-gray-400 uppercase text-sm tracking-widest mb-1">Current Bid</p>
          <div className="text-7xl font-mono font-bold text-yellow-500">
            ₹ {currentBid} <span className="text-4xl">Lakhs</span>
          </div>
        </div>

        {/* Sold/Unsold Stamp */}
        {status === 'SOLD' && (
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-8 border-green-500 text-green-500 text-9xl font-black p-4 uppercase tracking-tighter opacity-90 animate-bounce">
             SOLD
           </div>
        )}
        
        {status === 'UNSOLD' && (
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-8 border-red-500 text-red-500 text-9xl font-black p-4 uppercase tracking-tighter opacity-90">
             UNSOLD
           </div>
        )}

      </div>
    </div>
  );
}
