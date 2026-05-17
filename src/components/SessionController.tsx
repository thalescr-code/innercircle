"use client";

import React, { useState } from "react";
import { useCircle } from "@/context/CircleContext";
import { RefreshCw, Sliders, Shield, AlertTriangle } from "lucide-react";

export const SessionController: React.FC = () => {
  const { currentUser, users, circle, toggleSimulatedUser, resetState, mounted } = useCircle();
  const [isOpen, setIsOpen] = useState(false);

  if (!mounted || !currentUser) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl">
      <div className="bg-black/90 border border-zinc-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Toggle Bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-zinc-900/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={currentUser.profilePic} 
                alt={currentUser.name} 
                className={`w-8 h-8 rounded-full object-cover border ${
                  circle.hostId === currentUser.id ? "border-amber-500" : "border-zinc-700"
                }`}
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-black animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Simulated Session</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-200">{currentUser.name}</span>
                {circle.hostId === currentUser.id && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                    Host
                  </span>
                )}
                {circle.bootedMembers.includes(currentUser.id) && (
                  <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                    Booted
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            {currentUser.strikes > 0 && !circle.bootedMembers.includes(currentUser.id) && (
              <div className="flex items-center gap-1.5 text-brand-orange bg-brand-orange/5 border border-brand-orange/20 px-2 py-1 rounded">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Strike {currentUser.strikes}/2</span>
              </div>
            )}
            <button className="text-zinc-400 hover:text-white p-1.5 rounded bg-zinc-900/80 border border-zinc-800 flex items-center gap-1.5 hover:bg-zinc-800 transition-colors">
              <Sliders className="w-3.5 h-3.5" />
              <span>{isOpen ? "Hide Console" : "Simulation Console"}</span>
            </button>
          </div>
        </div>

        {/* Console Drawer */}
        {isOpen && (
          <div className="border-t border-zinc-800/80 p-5 bg-zinc-950/40">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono mb-2.5">
                  Select User Session to Simulate:
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    const isHost = u.id === circle.hostId;
                    const isBooted = circle.bootedMembers.includes(u.id);

                    return (
                      <button
                        key={u.id}
                        onClick={() => toggleSimulatedUser(u.id)}
                        className={`relative p-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-zinc-900 border-brand-orange text-zinc-100"
                            : "bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                        }`}
                      >
                        <div className="relative mb-1">
                          <img
                            src={u.profilePic}
                            alt={u.name}
                            className={`w-10 h-10 rounded-full object-cover border-2 ${
                              isSelected
                                ? "border-brand-orange scale-105"
                                : isHost
                                ? "border-amber-500/60"
                                : "border-zinc-700"
                            }`}
                          />
                          {isBooted && (
                            <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                              <Shield className="w-4 h-4 text-red-500" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-medium truncate w-full text-center">
                          {u.name}
                        </span>
                        
                        {/* Live mini strike indicators */}
                        {!isBooted && u.strikes > 0 && (
                          <div className="flex gap-0.5 mt-1">
                            {Array.from({ length: u.strikes }).map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                            ))}
                          </div>
                        )}
                        {isBooted && (
                          <span className="text-[8px] text-red-500 font-mono font-bold mt-1">BOOTED</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Utility Panel */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-900 text-xs">
                <div className="text-zinc-500 font-mono text-[10px]">
                  * Switch users to simulate multi-user downvoting.
                </div>
                <button
                  onClick={() => {
                    resetState();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-950/40 hover:text-red-300 font-mono transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Prototype
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
