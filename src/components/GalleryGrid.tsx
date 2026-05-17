"use client";

import React, { useState } from "react";
import { useCircle, Photo } from "@/context/CircleContext";
import { Trash2, Flame, X, Camera, ShieldAlert, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const GalleryGrid: React.FC = () => {
  const { 
    photos, 
    currentUser, 
    circle, 
    downvotePhoto, 
    deletePhoto, 
    users, 
    activeMembers, 
    mounted,
    filterUploaderId,
    setFilterUploaderId,
    toggleSavageMode
  } = useCircle();

  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  if (!mounted) return null;

  const isHost = currentUser ? circle.hostId === currentUser.id : false;
  const activeMembersCount = circle.members.length;
  // Strict majority threshold: downvotes must be > activeMembers / 2.
  // So the minimum votes to delete is Math.floor(activeMembersCount / 2) + 1.
  const votesRequiredToDelete = Math.floor(activeMembersCount / 2) + 1;

  // Filter photos by selected member
  const filteredPhotos = filterUploaderId
    ? photos.filter((p) => p.uploaderId === filterUploaderId)
    : photos;

  // Active photo downvote update binding in lightbox
  const currentSelectedPhotoInLightbox = activePhoto 
    ? photos.find((p) => p.id === activePhoto.id) || null
    : null;

  return (
    <div className="px-4 py-6 md:px-6 max-w-7xl mx-auto w-full">

      {/* Prominent Go Back/Filter Active Sub-navigation */}
      {filterUploaderId && (
        <div className="mb-6 flex items-center justify-between bg-zinc-950 border border-zinc-900 px-4 py-3.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">Viewing photo roll for:</span>
            <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2.5 py-1 rounded-xl uppercase tracking-wider">
              {users.find((u) => u.id === filterUploaderId)?.name}
            </span>
          </div>
          <button
            onClick={() => setFilterUploaderId(null)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-805 text-zinc-200 text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Return to entire Circle roll"
          >
            <span>← Back to Circle</span>
          </button>
        </div>
      )}

      {/* Render a clean empty state if no photos exist or if filter returns nothing */}
      {filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <Flame className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl text-zinc-300 font-semibold">No uploads recorded</h3>
          <p className="text-zinc-500 text-xs max-w-xs mt-1">
            {filterUploaderId 
              ? `${users.find(u => u.id === filterUploaderId)?.name} has not uploaded any photos yet.`
              : "Add photos to the Circle or switch simulated sessions to begin."
            }
          </p>
          {filterUploaderId && (
            <button
              onClick={() => setFilterUploaderId(null)}
              className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-300 transition-colors uppercase tracking-wider font-semibold cursor-pointer"
            >
              ← Back to Circle
            </button>
          )}
        </div>
      ) : (
        /* Masonry Grid */
        <motion.div 
          layout
          className="masonry-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo) => {
              const uploader = users.find((u) => u.id === photo.uploaderId) || {
                name: "Unknown",
                profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              };

              const hasDownvoted = currentUser ? photo.downvotes.includes(currentUser.id) : false;
              const isOwnPhoto = currentUser ? photo.uploaderId === currentUser.id : false;
              const canDelete = isHost || isOwnPhoto;
              
              // Calculate active downvote progress
              const downvoteCount = photo.downvotes.length;

              return (
                <motion.div
                  key={photo.id}
                  layoutId={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="masonry-item group"
                >
                  <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-2xl shadow-lg relative overflow-hidden transition-all duration-300 hover:border-zinc-800">
                    
                    {/* Photo/Video Container */}
                    <div className="relative overflow-hidden rounded-xl">
                      {photo.mediaUrl.endsWith(".mp4") || photo.mediaUrl.includes("video") ? (
                        <div className="relative w-full rounded-xl overflow-hidden cursor-pointer" onClick={() => setActivePhoto(photo)}>
                          <video
                            src={photo.mediaUrl}
                            className="w-full h-auto object-cover rounded-xl"
                            muted
                            loop
                            playsInline
                            autoPlay
                          />
                          <div className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/10 pointer-events-none">
                            <span className="text-[7px] font-extrabold text-brand-orange uppercase tracking-wider">MP4</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={photo.mediaUrl}
                          alt="Circle film roll"
                          onClick={() => setActivePhoto(photo)}
                          className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02] filter contrast-[1.05] cursor-pointer"
                          loading="lazy"
                        />
                      )}

                      {/* Subtle Overlay Border Lines */}
                      <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-xl" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                      {/* Trash Delete Control (Host or Uploader only) */}
                      {canDelete && (
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          className="absolute top-2.5 right-2.5 z-20 p-2 rounded-xl bg-black/60 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 border border-white/5 hover:border-red-900/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                          title={isHost ? "Host Overwrite Delete" : "Delete My Photo"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Uploader Avatar & Name Tag */}
                      <button
                        onClick={() => setFilterUploaderId(photo.uploaderId)}
                        className="absolute top-2.5 left-2.5 z-20 flex items-center gap-2 bg-black/50 hover:bg-zinc-900/80 border border-white/5 backdrop-blur-md pl-1.5 pr-2.5 py-1 rounded-full transition-colors"
                        title={`Filter feed for ${uploader.name}`}
                      >
                        <img
                          src={uploader.profilePic}
                          alt={uploader.name}
                          className="w-5 h-5 rounded-full object-cover border border-white/10"
                        />
                        <span className="text-[10px] font-medium text-zinc-300 tracking-wide">
                          {uploader.name}
                        </span>
                      </button>

                      {/* Subtle Gray/White Modern Timestamp Overlay */}
                      <div className="absolute bottom-2.5 right-3 z-20">
                        <span className="digital-timestamp select-none">
                          {photo.timestamp}
                        </span>
                      </div>

                      {/* Downvotes Active Indicator */}
                      {downvoteCount > 0 && (
                        <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-1 bg-red-950/40 border border-red-500/20 backdrop-blur-md px-2 py-0.5 rounded-full text-red-400 text-[9px] font-semibold">
                          <Flame className="w-3 h-3 text-brand-orange animate-pulse" />
                          <span>Savage: {downvoteCount}/{votesRequiredToDelete}</span>
                        </div>
                      )}
                    </div>

                    {/* Streamlined Premium Action Bar */}
                    <div className="mt-2.5 pt-2.5 border-t border-zinc-900/60 flex items-center justify-between gap-3 text-xs">
                      {/* Left: Deletion Vulnerability Flag Count */}
                      <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
                        {downvoteCount > 0 ? (
                          <>
                            <Flame className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                              {downvoteCount}/{votesRequiredToDelete} flagged
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold select-none">
                              SECURED
                            </span>
                          </>
                        )}
                      </div>

                      {/* Right: Modern Streamlined Flag/Downvote Button */}
                      <button
                        onClick={() => downvotePhoto(photo.id)}
                        disabled={isOwnPhoto}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                          isOwnPhoto
                            ? "bg-zinc-950 border-zinc-900/50 text-zinc-700 cursor-not-allowed"
                            : hasDownvoted
                            ? "bg-brand-orange/15 border-brand-orange/30 text-brand-orange hover:bg-brand-orange/20"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        }`}
                        title={isOwnPhoto ? "Your photo" : hasDownvoted ? "Remove flag" : "Flag this photo"}
                      >
                        <ThumbsDown className={`w-3.5 h-3.5 ${hasDownvoted ? "fill-brand-orange stroke-brand-orange" : ""}`} />
                        <span>{hasDownvoted ? "Flagged" : "Flag"}</span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Cinematic Dark Lightbox Modal */}
      <AnimatePresence>
        {currentSelectedPhotoInLightbox && (() => {
          const photoObj = currentSelectedPhotoInLightbox;
          const uploader = users.find((u) => u.id === photoObj.uploaderId) || {
            name: "Unknown",
            profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          };

          const hasDownvoted = currentUser ? photoObj.downvotes.includes(currentUser.id) : false;
          const isOwnPhoto = currentUser ? photoObj.uploaderId === currentUser.id : false;
          const downvoteCount = photoObj.downvotes.length;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8 select-none">
              
              {/* Shutter flash overlay lines */}
              <div className="absolute inset-0 bg-radial-gradient(circle, rgba(9, 9, 11, 0.2) 0%, black 100%) pointer-events-none z-10" />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActivePhoto(null)}
                className="absolute inset-0 cursor-zoom-out"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-5xl bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-20 shadow-2xl h-[90vh] md:h-[75vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActivePhoto(null)}
                  className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/80 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left/Center Image Screen */}
                <div className="flex-1 bg-black flex items-center justify-center p-6 relative overflow-hidden border-b md:border-b-0 md:border-r border-zinc-900">
                  <div className="relative max-h-full max-w-full flex items-center justify-center">
                    {photoObj.mediaUrl.endsWith(".mp4") || photoObj.mediaUrl.includes("video") ? (
                      <video
                        src={photoObj.mediaUrl}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="max-h-[45vh] md:max-h-[60vh] max-w-full rounded-xl object-contain shadow-2xl"
                      />
                    ) : (
                      <img
                        src={photoObj.mediaUrl}
                        alt="Film slide detail"
                        className="max-h-[45vh] md:max-h-[60vh] max-w-full rounded-xl object-contain shadow-2xl filter contrast-[1.03] select-none pointer-events-none"
                      />
                    )}
                    
                    {/* Timestamp overlay printed on photo layout */}
                    <div className="absolute bottom-4 right-4 bg-black/60 border border-white/5 backdrop-blur-md px-3 py-1.5 rounded-lg select-none">
                      <span className="digital-timestamp text-sm">
                        {photoObj.timestamp}
                      </span>
                    </div>

                    {/* Viewfinder brackets overlay */}
                    <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-zinc-800/80 pointer-events-none" />
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-zinc-800/80 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-zinc-800/80 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-zinc-800/80 pointer-events-none" />
                  </div>
                </div>

                {/* Right Metadata & Control Panel */}
                <div className="w-full md:w-[320px] shrink-0 p-6 flex flex-col justify-between bg-zinc-950 text-zinc-400 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest block mb-1">
                        Shared Media Info
                      </span>
                      <h3 className="text-2xl text-zinc-200 font-bold leading-none">
                        Details
                      </h3>
                      <div className="h-px bg-zinc-900 mt-3" />
                    </div>

                    {/* Meta Specifications Table */}
                    <div className="space-y-3 text-[10px] font-semibold uppercase tracking-wider">
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">UPLOADER:</span>
                        <span className="text-zinc-300">{uploader.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">TIMESTAMP:</span>
                        <span className="text-zinc-300">{photoObj.timestamp}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">SOURCE:</span>
                        <span className="text-zinc-300 flex items-center gap-1">
                          <Camera className="w-3 h-3 text-zinc-500" />
                          <span>Simulated Live Lens</span>
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">TYPE:</span>
                        <span className="text-zinc-300">
                          {photoObj.mediaUrl.endsWith(".mp4") || photoObj.mediaUrl.includes("video") ? "Video Roll" : "Photo Roll"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">VIBE:</span>
                        <span className="text-zinc-300">Candid & Warm</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500">CIRCLE:</span>
                        <span className="text-brand-orange">Close Friends</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">FLAGS RECORDED:</span>
                        <span className="text-zinc-300">{downvoteCount} / {votesRequiredToDelete}</span>
                      </div>
                    </div>

                    {/* Threat level warning panel */}
                    <div className="p-3.5 rounded-2xl bg-zinc-900/30 border border-zinc-900 space-y-2">
                      <div className="flex items-center gap-2">
                        {downvoteCount > 0 ? (
                          <>
                            <ShieldAlert className="w-4 h-4 text-brand-orange animate-pulse" />
                            <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider">
                              COMMUNITY VOTE ACTIVE
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                              SECURE STATUS
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[9px] text-zinc-500 leading-normal font-medium">
                        {downvoteCount > 0 
                          ? `This post has received ${downvoteCount} flags. At ${votesRequiredToDelete} flags (>50% majority), it triggers auto-destruction and uploader strikes.` 
                          : "No flags have been submitted against this card. The frame is safe from Savage Mode destruction."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Actions Deck */}
                  <div className="mt-6 pt-4 border-t border-zinc-900 space-y-3">
                    <button
                      onClick={() => downvotePhoto(photoObj.id)}
                      disabled={isOwnPhoto}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        isOwnPhoto
                          ? "bg-zinc-950 border-zinc-900/50 text-zinc-700 cursor-not-allowed"
                          : hasDownvoted
                          ? "bg-brand-orange/15 border-brand-orange/30 text-brand-orange hover:bg-brand-orange/20"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      <ThumbsDown className={`w-3.5 h-3.5 ${hasDownvoted ? "fill-brand-orange stroke-brand-orange text-brand-orange animate-pulse" : ""}`} />
                      <span>
                        {isOwnPhoto
                          ? "Restricted (Own Post)"
                          : hasDownvoted
                          ? "Remove Flag"
                          : "Flag Post"}
                      </span>
                    </button>

                    <button
                      onClick={() => setActivePhoto(null)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-zinc-300 text-xs transition-all uppercase tracking-widest font-semibold cursor-pointer"
                    >
                      Close Slide
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
