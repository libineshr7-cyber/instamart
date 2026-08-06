import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, MapPin, Phone, ShieldCheck, X, PackageCheck, Bike, Home } from 'lucide-react';

const STAGES = [
  { id: 'PLACED', title: 'Order Confirmed', desc: 'Sent to local Dark Store #204', icon: CheckCircle2 },
  { id: 'PACKING', title: 'Packing at Dark Store', desc: 'Items checked for fresh quality', icon: PackageCheck },
  { id: 'ASSIGNED', title: 'Executive Assigned', desc: 'Rider Ramesh M assigned', icon: ShieldCheck },
  { id: 'OUT_FOR_DELIVERY', title: 'Out for Express Delivery', desc: 'Rider on the way via EV bike', icon: Bike },
  { id: 'DELIVERED', title: 'Order Delivered', desc: 'Handed over at your door', icon: Home }
];

export const OrderTrackerModal = () => {
  const { activeOrderTracker, setActiveOrderTracker } = useShop();

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(600); // 10 mins

  useEffect(() => {
    if (!activeOrderTracker) return;

    // Reset stages
    setCurrentStageIdx(0);
    setEtaSeconds(600);

    // Simulate 5 stage step progression every 4 seconds for demonstration!
    const stepInterval = setInterval(() => {
      setCurrentStageIdx(prev => {
        if (prev < STAGES.length - 1) {
          const next = prev + 1;
          if (next === STAGES.length - 1) {
            // Trigger celebration confetti on final step!
            try {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } catch (e) {
              console.error(e);
            }
          }
          return next;
        }
        return prev;
      });
    }, 4000);

    // Timer countdown
    const timerInterval = setInterval(() => {
      setEtaSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(timerInterval);
    };
  }, [activeOrderTracker]);

  if (!activeOrderTracker) return null;

  const order = activeOrderTracker;
  const currentStage = STAGES[currentStageIdx];

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-gray-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">
              LIVE DARK STORE TRACKER
            </span>
            <h2 className="text-xl font-black mt-1">Order #{order.orderId}</h2>
            <p className="text-xs text-gray-300">Target ETA: 10 Minutes</p>
          </div>
          <button
            onClick={() => setActiveOrderTracker(null)}
            className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* ETA Hero Display */}
          <div className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-200 rounded-2xl p-4 text-center relative overflow-hidden">
            <div className="flex justify-center mb-1">
              <Clock className="w-8 h-8 text-red-600 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="text-3xl font-black text-gray-900 font-mono tracking-tight">
              {currentStageIdx === 4 ? 'ARRIVED!' : formatTimer(etaSeconds)}
            </div>
            <div className="text-xs font-bold text-red-600 mt-1">
              {currentStageIdx === 4 ? 'Order successfully delivered to your door' : 'Arriving in 10 Mins or Free!'}
            </div>
          </div>

          {/* Dark Store Graphic Map Simulation */}
          <div className="relative h-28 bg-slate-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-between px-6">
            <div className="flex flex-col items-center z-10">
              <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                🏪
              </div>
              <span className="text-[10px] font-black text-gray-700 mt-1">Dark Store #204</span>
            </div>

            {/* Path */}
            <div className="flex-1 mx-4 h-1 bg-gray-300 relative rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-1000"
                style={{ width: `${(currentStageIdx / (STAGES.length - 1)) * 100}%` }}
              />
            </div>

            <div className="flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                currentStageIdx === 4 ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
              }`}>
                🏡
              </div>
              <span className="text-[10px] font-black text-gray-700 mt-1">Your Doorstep</span>
            </div>
          </div>

          {/* Delivery Rider Details (Visible when stage >= 2) */}
          {currentStageIdx >= 2 && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 text-yellow-400 rounded-full flex items-center justify-center font-black text-lg">
                  🛵
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900">Ramesh M (Vaccinated Partner)</h4>
                  <span className="text-[11px] text-green-600 font-bold">⚡ Instamart Express Delivery</span>
                </div>
              </div>
              <button
                onClick={() => alert("Connecting call to delivery partner Ramesh...")}
                className="p-2 bg-green-600 text-white rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-green-700"
              >
                <Phone className="w-3.5 h-3.5 fill-white" /> Call
              </button>
            </div>
          )}

          {/* 5-Stage Stepper Progress */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Live Status Timeline</h4>
            <div className="space-y-3">
              {STAGES.map((stg, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                const Icon = stg.icon;

                return (
                  <div key={stg.id} className="flex items-start gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-red-600 text-white ring-4 ring-red-100 scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className={`font-extrabold text-xs ${isPassed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {stg.title}
                      </div>
                      <div className="text-[11px] text-gray-500">{stg.desc}</div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded animate-pulse">
                        IN PROGRESS
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Item Summary */}
          <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span>{order.items.length} Items</span>
              <span className="font-extrabold text-gray-900">Total Paid: ₹{order.grandTotal}</span>
            </div>
            <div className="text-[11px] text-gray-500 truncate">
              {order.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
