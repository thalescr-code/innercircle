"use client";

import React, { useState } from "react";
import { useCircle } from "@/context/CircleContext";
import { X, UserPlus, Link, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const { inviteFriend, circle, currentUser, mounted } = useCircle();
  const [friendName, setFriendName] = useState("");
  const [copied, setCopied] = useState(false);
  const [invitedSuccess, setInvitedSuccess] = useState(false);
  const [lastInvitedName, setLastInvitedName] = useState("");

  if (!mounted) return null;

  const inviteCode = `IC-${circle.name.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-2026`;
  const inviteUrl = `https://innercircle.app/join?code=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;

    inviteFriend(friendName.trim());
    setLastInvitedName(friendName.trim());
    setFriendName("");
    setInvitedSuccess(true);
    
    setTimeout(() => {
      setInvitedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <>
      {/* Invite Success Overlay Flash */}
      <AnimatePresence>
        {invitedSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                <UserPlus className="w-8 h-8 animate-bounce" />
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">
                INVITATION ACCEPTED
              </span>
              <h3 className="text-2xl text-zinc-100 font-extrabold tracking-tight">
                {lastInvitedName} Joined!
              </h3>
              <p className="text-[11px] text-zinc-500 max-w-xs mt-1 leading-normal font-medium">
                They have been added to the Active Directory and will instantly appear in the simulation session console below!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/90 z-40 backdrop-blur-sm"
            />

            {/* Modal Overlay Frame wrapping the modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4"
            >
              {/* Vintage Shutter Viewfinder Crosshairs Frame */}
              <div className="absolute inset-6 md:inset-10 border border-zinc-800/30 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between text-[9px] text-zinc-600 uppercase font-semibold">
                  <span>EXP // 2026</span>
                  <span>HOST ONLY</span>
                </div>
                <div className="flex justify-between text-[9px] text-zinc-600 uppercase font-semibold">
                  <span>SECURE LINK</span>
                  <span>ROLL CODE</span>
                </div>
              </div>

              {/* Modal Card */}
              <div className="bg-zinc-950 border border-zinc-900 w-full max-w-md rounded-2xl shadow-2xl p-6 pointer-events-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient(circle, rgba(255, 85, 0, 0.03) 0%, transparent 70%) pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* View Header */}
                <div className="mb-5 pr-8">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                    Host Access
                  </span>
                  <h2 className="text-xl text-zinc-200 font-bold tracking-tight">
                    Invite Friends to Circle
                  </h2>
                </div>

                {/* Copy Link Deck */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-2">
                      Circle Invitation Code:
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-full">
                        <input
                          type="text"
                          readOnly
                          value={inviteCode}
                          className="w-full pl-3 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 focus:outline-none select-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-2">
                      Share Invite URL:
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-full">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                        <input
                          type="text"
                          readOnly
                          value={inviteUrl}
                          className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] text-zinc-400 focus:outline-none select-all truncate"
                        />
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className="px-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        title="Copy Invitation Link"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-[9px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1 uppercase tracking-wider">
                        <span>✓</span> Invite link copied to clipboard!
                      </p>
                    )}
                  </div>
                </div>

                <div className="h-px bg-zinc-900/60 my-5" />

                {/* Simulated Invite Friend Form */}
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-2">
                      Simulate Direct Invitation:
                    </label>
                    <p className="text-[9px] text-zinc-500 mb-3 leading-normal font-medium">
                      Type a friend's name to instantly simulate an accepted invitation. They will receive a profile avatar and join the circle.
                    </p>
                    <input
                      type="text"
                      required
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      placeholder="e.g. Sarah, David, Jessica"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!friendName.trim()}
                    className={`w-full py-2.5 rounded-xl border text-xs uppercase tracking-wider font-bold transition-all ${
                      friendName.trim()
                        ? "bg-brand-orange border-brand-orange text-white hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/15 cursor-pointer"
                        : "bg-zinc-950 border-zinc-900 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    Send Invitation
                  </button>
                </form>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
