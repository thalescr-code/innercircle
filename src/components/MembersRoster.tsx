"use client";

import React from "react";
import { useCircle } from "@/context/CircleContext";
import { X, Shield, ShieldAlert, UserMinus, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MembersRosterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MembersRoster: React.FC<MembersRosterProps> = ({ isOpen, onClose }) => {
  const { activeMembers, bootedMembers, circle, currentUser, manuallyRemoveMember, mounted, setFilterUploaderId } = useCircle();

  if (!mounted) return null;

  const isHost = currentUser ? circle.hostId === currentUser.id : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-[360px] max-w-full bg-zinc-950 border-l border-zinc-900 z-50 shadow-2xl flex flex-col"
          >
            
            {/* Roster Header */}
            <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  Circle Directory
                </span>
                <h2 className="text-xl text-zinc-200 font-bold tracking-tight">
                  Roster & Security
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Roster Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Active Members Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  <span>Active Members</span>
                  <span>{activeMembers.length} Joined</span>
                </div>

                <div className="space-y-2">
                  {activeMembers.map((member) => {
                    const isMemberHost = member.id === circle.hostId;
                    const isMe = currentUser ? member.id === currentUser.id : false;

                    return (
                      <div 
                        key={member.id}
                        onClick={() => {
                          setFilterUploaderId(member.id);
                          onClose();
                        }}
                        className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-brand-orange/40 hover:bg-zinc-900/70 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={member.profilePic}
                            alt={member.name}
                            className={`w-9 h-9 rounded-full object-cover border ${
                              isMemberHost ? "border-amber-500" : "border-zinc-700"
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-zinc-200">
                                {member.name} {isMe && <span className="text-zinc-500 font-mono text-[9px]">(you)</span>}
                              </span>
                              {isMemberHost && (
                                <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 py-0.5 rounded font-mono font-bold uppercase">
                                  Host
                                </span>
                              )}
                            </div>
                            
                            {/* Strike LED Lights */}
                            {!isMemberHost && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-mono text-zinc-500">Strikes:</span>
                                <div className="flex gap-1">
                                  <div 
                                    className={`w-2 h-2 rounded-full ${
                                      member.strikes >= 1 
                                        ? "bg-brand-orange shadow-lg shadow-brand-orange/50 animate-pulse" 
                                        : "bg-zinc-800"
                                    }`} 
                                    title={member.strikes >= 1 ? "Strike 1 active" : "No strikes"}
                                  />
                                  <div 
                                    className={`w-2 h-2 rounded-full ${
                                      member.strikes >= 2 
                                        ? "bg-red-500 shadow-lg shadow-red-500/50" 
                                        : "bg-zinc-800"
                                    }`}
                                    title={member.strikes >= 2 ? "Strike 2 active (Booted)" : "No strikes"}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Host Controls: manual boot member */}
                        {isHost && !isMemberHost && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              manuallyRemoveMember(member.id);
                            }}
                            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/30 transition-all font-mono"
                            title={`Boot ${member.name}`}
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Booted Members Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  <span>Booted from Circle</span>
                  <span>{bootedMembers.length} Banned</span>
                </div>

                {bootedMembers.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-zinc-900/10 border border-zinc-900 border-dashed text-center">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">
                      No booted records. All silent.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bootedMembers.map((member) => {
                      const wasSavageBanned = member.strikes >= 2;

                      return (
                        <div 
                          key={member.id}
                          className="bg-red-950/5 border border-red-950/30 p-3 rounded-2xl flex items-center justify-between gap-3 opacity-65"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={member.profilePic}
                                alt={member.name}
                                className="w-9 h-9 rounded-full object-cover border border-red-900/30 filter grayscale"
                              />
                              <div className="absolute inset-0 bg-red-950/40 rounded-full flex items-center justify-center">
                                <X className="w-4.5 h-4.5 text-red-500" />
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-red-400/90 line-through">
                                {member.name}
                              </span>
                              <div className="flex items-center gap-1 text-[9px] font-mono text-red-500/80 mt-0.5">
                                {wasSavageBanned ? (
                                  <>
                                    <ShieldAlert className="w-3 h-3 text-brand-orange" />
                                    <span>Savage Ban (2 Strikes)</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-3 h-3 text-red-500" />
                                    <span>Booted by Host</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono uppercase bg-red-500/10 border border-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-bold">
                            BANNED
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Roster Footer Info */}
            <div className="p-5 border-t border-zinc-900 bg-zinc-950 flex gap-3 text-[10px] font-mono text-zinc-500 leading-normal">
              <Shield className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="uppercase text-zinc-400 font-semibold mb-0.5">Moderation Manual:</p>
                <p>Host override overrides all rules. Regular downvotes trigger Savage deletions. Users with 2 strikes are blocked permanently.</p>
              </div>
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
