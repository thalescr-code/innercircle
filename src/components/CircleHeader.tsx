"use client";

import React from "react";
import { useCircle } from "@/context/CircleContext";
import { Users, Camera, Zap, ShieldAlert, UserPlus } from "lucide-react";

interface CircleHeaderProps {
  onOpenRoster: () => void;
  onOpenUpload: () => void;
  onOpenInvite: () => void;
}

export const CircleHeader: React.FC<CircleHeaderProps> = ({ onOpenRoster, onOpenUpload, onOpenInvite }) => {
  const { circle, activeMembers, logs, currentUser, mounted } = useCircle();

  if (!mounted) return null;

  const isBooted = currentUser ? circle.bootedMembers.includes(currentUser.id) : false;
  const isHost = currentUser ? circle.hostId === currentUser.id : false;

  return (
    <header className="sticky top-0 z-40 w-full bg-film-black/85 backdrop-blur-md border-b border-zinc-900 px-4 py-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo and Event Status */}
        <div className="flex items-center gap-3">
          {/* Custom Minimalist Viewfinder Aperture Logo */}
          <div className="shrink-0 text-brand-orange bg-zinc-950/60 p-1.5 rounded-xl border border-zinc-900 shadow-md">
            <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" className="opacity-30" />
              <circle cx="50" cy="50" r="32" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
              <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="2" className="opacity-75" />
              <circle cx="50" cy="50" r="5" fill="currentColor" className="opacity-90" />
              <line x1="50" y1="5" x2="50" y2="18" stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
              <line x1="50" y1="82" x2="50" y2="95" stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
              <line x1="5" y1="50" x2="18" y2="50" stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
              <line x1="82" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-[0.2em] select-none">
              INNER CIRCLE
            </span>
            <span className="hidden sm:block h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium tracking-wide">
                {circle.name}
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950/20 border border-red-900/10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest select-none">
                  LIVE ROLL
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Invite Button (Host Only) */}
          {isHost && !isBooted && (
            <button
              onClick={onOpenInvite}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all text-xs font-semibold cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-brand-orange" />
              <span className="hidden md:inline">Invite Friends</span>
            </button>
          )}

          {/* Members Toggle */}
          <button
            onClick={onOpenRoster}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 transition-all text-xs"
          >
            <Users className="w-4 h-4 text-zinc-400" />
            <span>{activeMembers.length} Members</span>
          </button>

          {/* Upload Button */}
          {!isBooted && (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white hover:bg-brand-orange/90 transition-all text-xs font-semibold shadow-lg shadow-brand-orange/20 hover:scale-105 active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Add to Circle</span>
            </button>
          )}

          {isBooted && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/20 text-red-500 border border-red-900/30 text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Session Revoked</span>
            </div>
          )}
        </div>

      </div>

      {/* Social Scrolling Activity Feed Ticker */}
      <div className="max-w-7xl mx-auto mt-3 border-t border-zinc-900/80 pt-2 flex items-center gap-2 overflow-hidden text-[10px] text-zinc-500">
        <Zap className="w-3.5 h-3.5 text-brand-orange shrink-0" />
        <span className="uppercase text-zinc-400 font-bold tracking-wider shrink-0">Live Feed:</span>
        <div className="w-full overflow-hidden relative h-4">
          <div className="absolute left-0 top-0 whitespace-nowrap animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused]">
            {logs.length > 0 ? (
              <span className="inline-block hover:text-zinc-300 transition-colors">
                {logs[0]} {logs[1] ? `  //  ${logs[1]}` : ""} {logs[2] ? `  //  ${logs[2]}` : ""}
              </span>
            ) : (
              "Waiting for photo rolls..."
            )}
          </div>
        </div>
      </div>

      {/* Injecting temporary styling for marquee keyframes */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </header>
  );
};
