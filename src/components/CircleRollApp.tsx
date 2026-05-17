"use client";

import React, { useState } from "react";
import { useCircle } from "@/context/CircleContext";
import { CircleHeader } from "./CircleHeader";
import { GalleryGrid } from "./GalleryGrid";
import { SessionController } from "./SessionController";
import { MembersRoster } from "./MembersRoster";
import { UploadModal } from "./UploadModal";
import { InviteModal } from "./InviteModal";
import { ShieldAlert, RefreshCw, EyeOff, Ban } from "lucide-react";
import { motion } from "framer-motion";

export const CircleRollApp: React.FC = () => {
  const { currentUser, circle, resetState, mounted } = useCircle();
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  if (!mounted) {
    // Beautiful minimalist camera spinner loading screen
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-film-black">
        <div className="relative w-12 h-12 border border-zinc-800 rounded-full flex items-center justify-center animate-spin">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
        </div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-4 font-bold">
          Loading Shutter...
        </span>
      </div>
    );
  }

  // Active Ban Lockout State (User is booted)
  const isBooted = currentUser ? circle.bootedMembers.includes(currentUser.id) : false;

  return (
    <div className="flex flex-col flex-1 min-h-screen relative">
      
      {/* Cinematic ambient background glow for Moody vibe */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-gradient-radial from-stone-900/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-gradient-radial from-stone-950/20 to-transparent pointer-events-none" />

      {isBooted ? (
        // Cinematic Red Lockout Screen for Booted User
        <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-black/95 z-40 relative">
          
          {/* Neon Leak */}
          <div className="absolute inset-0 bg-radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 60%) pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-zinc-950 border border-red-950/60 p-8 rounded-3xl shadow-2xl relative text-center space-y-6"
          >
            {/* Viewfinder corner lines */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-900/50" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-900/50" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-900/50" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-900/50" />

            <div className="mx-auto w-16 h-16 rounded-full bg-red-950/20 border border-red-900/30 flex items-center justify-center text-red-500 shadow-inner">
              <Ban className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">
                ACCESS REVOKED // TWO STRIKES INCURRED
              </span>
              <h2 className="text-3xl text-zinc-100 font-extrabold tracking-tight">
                Booted from Circle
              </h2>
            </div>

            {currentUser && (
              <div className="flex flex-col items-center gap-2 p-3 bg-red-950/5 border border-red-950/30 rounded-2xl">
                <img 
                  src={currentUser.profilePic} 
                  alt={currentUser.name} 
                  className="w-12 h-12 rounded-full object-cover border border-red-500/40 filter grayscale"
                />
                <span className="text-xs font-bold text-red-400">{currentUser.name} (Blacklisted)</span>
              </div>
            )}

            <p className="text-[11px] text-zinc-500 leading-relaxed max-w-sm mx-auto font-medium">
              You are no longer an active member of <span className="text-zinc-300 font-bold">{circle.name}</span>. 
              Savage Mode self-moderation was triggered because your photos were downvoted by &gt;50% of the active group, hitting 2 strikes. 
              Access to camera roll grids and uploads is restricted.
            </p>

            <div className="pt-2 border-t border-zinc-900/80 flex flex-col gap-2">
              <button
                onClick={resetState}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-950/40 hover:text-red-300 text-xs transition-all uppercase tracking-wider font-bold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset System State
              </button>
              <p className="text-[9px] text-zinc-600 font-semibold">
                * Or use the simulator session controller to toggle to another user.
              </p>
            </div>

          </motion.div>
        </div>
      ) : (
        // Standard Circle View
        <>
          <CircleHeader 
            onOpenRoster={() => setIsRosterOpen(true)} 
            onOpenUpload={() => setIsUploadOpen(true)}
          />

          <main className="flex-1 pb-32">
            <GalleryGrid />
          </main>

          {/* Moody minimal footer */}
          <footer className="w-full py-8 text-center text-[9px] text-zinc-700 border-t border-zinc-900/30 font-bold">
            <div className="flex items-center justify-center gap-2">
              <EyeOff className="w-3 h-3 text-zinc-800" />
              <span>INNER CIRCLE // PRIVATE CAMERA SYSTEM. ALL MEDIA SUBJECT TO SAVAGE AUTO-DELETION.</span>
            </div>
          </footer>
        </>
      )}

      {/* Roster Drawer */}
      <MembersRoster 
        isOpen={isRosterOpen} 
        onClose={() => setIsRosterOpen(false)} 
        onOpenInvite={() => {
          setIsRosterOpen(false);
          setIsInviteOpen(true);
        }}
      />

      {/* Upload Shutter Overlay */}
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />

      {/* Host Invitation Overlay */}
      <InviteModal 
        isOpen={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
      />

      {/* Simulation Console floating deck */}
      <SessionController />

    </div>
  );
};
