'use client';
import { useState, useEffect } from 'react';
import { players } from '../data/players';

export default function DisplayPage() {
  const [currentId, setCurrentId] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [currentBidder, setCurrentBidder] = useState(null);
  const [status, setStatus] = useState('WAITING');

  useEffect(() => {
    const bc = new BroadcastChannel('auction_channel');
    bc.onmessage = (event) => {
      if (event.data.type === 'UPDATE') {
        const { playerId, bid, bidder, status } = event.data.data;
        setCurrentId(playerId);
        setCurrentBid(bid);
        setCurrentBidder(bidder);
        setStatus(status);
      }
    };
    return () => bc.close();
  }, []);

  const currentPlayer = players.find(p => p.id === currentId);

  if (!currentPlayer) return <div className="h-screen bg-black" />;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black text-white flex overflow-hidden relative">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-20"></div>

      {/* LEFT: Player Info */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10 z-10">
        <div className="w-[350px] h-[350px] bg-gray-800 rounded-lg mb-8 shadow-2xl border-4 border-gray-700 flex items-center justify-center overflow-hidden">
             {/* Player Image */}
             <div className="text-gray-500 text-2xl">[ IMAGE ]</div>
        </div>
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">{currentPlayer.name}</h1>
        <h2 className="text-3xl text-yellow-400 font-serif">{currentPlayer.role}</h2>
      </div>

      {/* RIGHT: Auction Status */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10 z-10">
        
        {/* Current Bid Display */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl w-full max-w-lg text-center shadow-2xl">
            <p className="text-blue-300 uppercase tracking-widest text-sm mb-4">Current Bid</p>
            <div className="text-8xl font-mono font-bold text-white mb-2">
                {currentBid}
            </div>
            <p className="text-xl text-gray-400">Lakhs</p>
        </div>

        {/* Current Bidder Team Logo */}
        <div className="mt-10 h-32 flex items-center justify-center">
            {currentBidder ? (
                <div className="flex flex-col items-center animate-pulse">
                    <p className="text-sm text-gray-400 mb-2 uppercase">With Team</p>
                    {/* Replace div below with <img src={currentBidder.logo} /> */}
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xs ${currentBidder.color} shadow-lg border-4 border-white`}>
                        {currentBidder.name}
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 uppercase tracking-widest">Waiting for bid...</p>
            )}
        </div>

        {/* SOLD Overlay */}
        {status === 'SOLD' && currentBidder && (
           <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
               <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">SOLD</h1>
               <div className="text-4xl text-white mb-4">to</div>
               {/* Winner Logo Large */}
               <div className={`w-48 h-48 rounded-full flex items-center justify-center text-white text-3xl font-bold ${currentBidder.color} border-8 border-white shadow-[0_0_50px_rgba(255,255,255,0.5)]`}>
                  {currentBidder.name}
               </div>
               <div className="mt-8 text-5xl font-mono text-yellow-400 font-bold">₹ {currentBid} Lakhs</div>
           </div>
        )}

        {/* UNSOLD Overlay */}
        {status === 'UNSOLD' && (
           <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
               <div className="border-[20px] border-red-600 text-red-600 text-[10rem] font-black p-10 rotate-[-10deg] opacity-80 uppercase tracking-widest">
                   UNSOLD
               </div>
           </div>
        )}

      </div>
    </div>
  );
}
