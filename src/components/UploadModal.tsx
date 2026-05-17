"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCircle } from "@/context/CircleContext";
import { ArrowLeft, QrCode, Camera, Sparkles, Link, Zap, Video, Image, Download, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_MEDIA = [
  {
    name: "Cozy Fireside Sparklers (Video)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-sparkler-at-a-party-40289-large.mp4",
    desc: "Simulated short ambient video clip",
    type: "video"
  },
  {
    name: "Party Crowd Dancing (Video)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-dancing-crowd-at-a-concert-40291-large.mp4",
    desc: "High-energy festival vibes",
    type: "video"
  },
  {
    name: "Confetti Celebration (Video)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-confetti-falling-in-slow-motion-42037-large.mp4",
    desc: "Golden party glitter clip",
    type: "video"
  },
  {
    name: "Sunset Rooftop Party",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    desc: "Golden hour crowd portraits",
    type: "image"
  },
  {
    name: "Neon Lights Diner",
    url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80",
    desc: "Vibrant neon glows and cozy chatter",
    type: "image"
  },
  {
    name: "Vinyl Vault Music",
    url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&auto=format&fit=crop&q=80",
    desc: "Warm retro acoustic ambiance",
    type: "image"
  }
];

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { uploadPhoto, circle, mounted } = useCircle();
  const [customUrl, setCustomUrl] = useState("");
  const [showFlash, setShowFlash] = useState(false);
  const [activeTab, setActiveTab] = useState<"preset" | "url">("preset");
  
  // Custom interface toggles
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedQr, setSavedQr] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // HTML5 Live Camera Feed Logic
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then(s => {
          activeStream = s;
          setHasCamera(true);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.log("Device camera access not allowed or unavailable:", err);
          setHasCamera(false);
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  if (!mounted) return null;

  const handleUpload = (urlToUpload: string) => {
    if (!urlToUpload) return;

    // Trigger visual camera shutter flash feedback effect
    setShowFlash(true);
    
    setTimeout(() => {
      uploadPhoto(urlToUpload);
      setShowFlash(false);
      onClose();
      // Clean up states
      setCustomUrl("");
      setIsLibraryOpen(false);
    }, 450);
  };

  const handleSnapRandom = () => {
    const randomPresets = [
      "https://assets.mixkit.co/videos/preview/mixkit-holding-a-sparkler-at-a-party-40289-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-confetti-falling-in-slow-motion-42037-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-dancing-crowd-at-a-concert-40291-large.mp4",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80"
    ];
    const pickedUrl = randomPresets[Math.floor(Math.random() * randomPresets.length)];
    const isVid = pickedUrl.endsWith(".mp4");
    const finalUrl = isVid ? pickedUrl : `${pickedUrl}&random=${Date.now()}`;
    handleUpload(finalUrl);
  };

  const handleShareLink = () => {
    const inviteLink = window.location.href;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveQr = () => {
    setSavedQr(true);
    setTimeout(() => setSavedQr(false), 2000);
  };

  return (
    <>
      {/* Solid White Shutter Shutter Flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 bg-white z-[9999] flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <Zap className="w-12 h-12 text-brand-orange fill-brand-orange animate-bounce" />
              <span className="font-bold uppercase tracking-widest text-sm text-zinc-950">
                ✨ CAPTURED & SHARED ✨
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col justify-between select-none text-zinc-300 font-sans"
          >
            
            {/* 1. Header Area: Back Arrow (Left), Circle Name (Middle), QR Code Icon (Right) */}
            <header className="w-full px-4 py-4 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md z-30">
              {/* Left: Align Back Arrow */}
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                title="Back to Circle"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Middle: Circle Name */}
              <div className="text-center flex flex-col items-center">
                <span className="text-[8px] text-zinc-500 uppercase tracking-[0.2em] font-extrabold leading-none mb-1">
                  Active Circle
                </span>
                <span className="text-xs font-black text-white uppercase tracking-widest leading-none truncate max-w-[180px] md:max-w-[300px]">
                  {circle.name}
                </span>
              </div>

              {/* Right: Align QR Code Icon */}
              <button
                onClick={() => setIsQrOpen(true)}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                title="Invite to Circle"
              >
                <QrCode className="w-5 h-5 text-brand-orange" />
              </button>
            </header>

            {/* 2. Middle Area: Camera Lens / Viewfinder Screen */}
            <main className="flex-1 w-full bg-black relative flex items-center justify-center overflow-hidden">
              
              {/* Render live webcam stream if supported, else show atmospheric fallback design */}
              {hasCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="absolute inset-0 bg-radial-gradient(circle, #0e0e11 0%, #000 100%) flex flex-col items-center justify-center p-6 text-center select-none">
                  {/* Styled Simulated Lens graphic */}
                  <div className="w-36 h-36 rounded-full border border-zinc-800 flex items-center justify-center relative bg-zinc-950/20 shadow-2xl mb-4">
                    <div className="w-28 h-28 rounded-full border border-zinc-900/60 bg-zinc-950/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-orange animate-pulse">
                        <Camera className="w-7 h-7" />
                      </div>
                    </div>
                    {/* Viewfinder cross overlay */}
                    <div className="absolute inset-0 border border-white/[0.015] pointer-events-none rounded-full" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mb-1">
                    Virtual Viewfinder
                  </span>
                  <span className="text-[9px] text-zinc-600 font-semibold uppercase max-w-xs leading-normal">
                    Camera preview ready. Use the shutter button below to capture live party moments.
                  </span>
                </div>
              )}

              {/* Viewfinder overlays (iPhone / Smartphone Camera UI) */}
              <div className="absolute inset-4 md:inset-8 border border-white/5 rounded-[28px] pointer-events-none flex flex-col justify-between p-6 select-none z-20">
                {/* Smartphone HUD metrics */}
                <div className="flex justify-between items-center text-[7px] font-bold tracking-widest text-zinc-500">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>LENS ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>4K 60FPS</span>
                    <span>100% BAT</span>
                  </div>
                </div>

                {/* Grid Focal Lines overlay */}
                <div className="absolute inset-x-0 top-1/3 border-b border-white/[0.015] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-1/3 border-b border-white/[0.015] pointer-events-none" />
                <div className="absolute inset-y-0 left-1/3 border-r border-white/[0.015] pointer-events-none" />
                <div className="absolute inset-y-0 right-1/3 border-r border-white/[0.015] pointer-events-none" />

                <div className="flex justify-between items-center text-[7px] font-bold tracking-widest text-zinc-500">
                  <span>SECURE P2P</span>
                  <span>AUTO-SAVE OFF</span>
                </div>
              </div>
            </main>

            {/* 3. Bottom Bar: Camera shutter and Library triggers */}
            <footer className="w-full bg-zinc-950 border-t border-zinc-900 px-6 py-6 md:py-8 flex items-center justify-between z-30">
              {/* Left: Library presets drawer trigger */}
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="flex flex-col items-center gap-1 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl transition-all cursor-pointer select-none"
                title="Library"
              >
                <Sparkles className="w-5 h-5 text-zinc-400" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">Library</span>
              </button>

              {/* Center: Styled Shutter Button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={handleSnapRandom}
                  className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer bg-transparent shadow-2xl"
                  title="Capture Media"
                >
                  <div className="w-13 h-13 rounded-full bg-brand-orange hover:bg-brand-orange/90 transition-colors shadow-inner" />
                </button>
              </div>

              {/* Right: Quick Help Info */}
              <div className="flex flex-col items-center gap-1 p-2.5 rounded-2xl select-none opacity-60">
                <Zap className="w-5 h-5 text-brand-orange" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">P2P Roll</span>
              </div>
            </footer>

            {/* curation / phone library drawer overlay */}
            <AnimatePresence>
              {isLibraryOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsLibraryOpen(false)}
                    className="absolute inset-0 bg-black/60 z-30 cursor-pointer"
                  />
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="absolute bottom-0 inset-x-0 bg-zinc-950 border-t border-zinc-900 rounded-t-[28px] p-6 z-40 max-h-[70vh] overflow-y-auto"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-orange" />
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Choose from Phone Library</span>
                      </div>
                      <button
                        onClick={() => setIsLibraryOpen(false)}
                        className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Curated Presets vs Link url Tabs */}
                    <div className="flex border-b border-zinc-900 mb-4">
                      <button
                        onClick={() => setActiveTab("preset")}
                        className={`flex-1 pb-2 text-[10px] uppercase tracking-widest font-bold border-b ${
                          activeTab === "preset"
                            ? "border-brand-orange text-brand-orange"
                            : "border-transparent text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Curated Presets
                      </button>
                      <button
                        onClick={() => setActiveTab("url")}
                        className={`flex-1 pb-2 text-[10px] uppercase tracking-widest font-bold border-b ${
                          activeTab === "url"
                            ? "border-brand-orange text-brand-orange"
                            : "border-transparent text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Custom Link URL
                      </button>
                    </div>

                    {activeTab === "preset" ? (
                      <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {PRESET_MEDIA.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              handleUpload(preset.url);
                              setIsLibraryOpen(false);
                            }}
                            className="flex flex-col gap-2 p-2 bg-zinc-900/30 border border-zinc-900 rounded-2xl hover:border-zinc-800 hover:bg-zinc-900/60 transition-all text-left cursor-pointer animate-none"
                          >
                            {preset.type === "video" ? (
                              <div className="w-full aspect-[4/3] rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 relative overflow-hidden">
                                <video src={preset.url} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                                <Video className="w-6 h-6 text-brand-orange relative z-10" />
                              </div>
                            ) : (
                              <img
                                src={preset.url}
                                alt={preset.name}
                                className="w-full aspect-[4/3] rounded-xl object-cover border border-zinc-800"
                              />
                            )}
                            <div>
                              <p className="text-[10px] font-bold text-zinc-200 line-clamp-1">{preset.name}</p>
                              <p className="text-[8px] text-zinc-500 mt-0.5 line-clamp-1">{preset.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4 pt-1">
                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase font-bold mb-2">
                            Paste Photo or Video Link:
                          </label>
                          <div className="relative">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                            <input
                              type="url"
                              value={customUrl}
                              onChange={(e) => setCustomUrl(e.target.value)}
                              placeholder="https://example.com/media.mp4 or .jpg"
                              className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            handleUpload(customUrl);
                            setIsLibraryOpen(false);
                          }}
                          disabled={!customUrl.trim()}
                          className={`w-full py-2.5 rounded-xl border text-xs uppercase tracking-wider font-bold transition-all ${
                            customUrl.trim()
                              ? "bg-brand-orange border-brand-orange text-white hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/15 cursor-pointer"
                              : "bg-zinc-950 border-zinc-900 text-zinc-600 cursor-not-allowed"
                          }`}
                        >
                          Share Media
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Invite Members Modal window popup */}
            <AnimatePresence>
              {isQrOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-[28px] p-6 flex flex-col items-center gap-5 text-center text-zinc-300 relative shadow-2xl"
                  >
                    {/* Top right close cross */}
                    <button
                      onClick={() => setIsQrOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="mt-2">
                      <span className="text-[10px] text-brand-orange uppercase tracking-widest font-extrabold">
                        Invite Guests
                      </span>
                      <h3 className="text-lg text-zinc-200 font-bold tracking-tight mt-1 leading-tight">
                        Join Circle
                      </h3>
                      <p className="text-[9.5px] text-zinc-500 mt-1 max-w-[240px] leading-normal font-semibold">
                        Scan the QR code below to connect your device and share photos/videos with this circle roll.
                      </p>
                    </div>

                    {/* SVG QR Code */}
                    <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden select-none border border-zinc-200">
                      <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* QR Code Anchor Squares */}
                        {/* Top Left */}
                        <rect x="5" y="5" width="22" height="22" rx="4" stroke="black" strokeWidth="4" />
                        <rect x="11" y="11" width="10" height="10" rx="2" fill="black" />
                        {/* Top Right */}
                        <rect x="73" y="5" width="22" height="22" rx="4" stroke="black" strokeWidth="4" />
                        <rect x="79" y="11" width="10" height="10" rx="2" fill="black" />
                        {/* Bottom Left */}
                        <rect x="5" y="73" width="22" height="22" rx="4" stroke="black" strokeWidth="4" />
                        <rect x="11" y="79" width="10" height="10" rx="2" fill="black" />
                        
                        {/* Simulated QR Code Random Matrix Dots */}
                        <rect x="35" y="5" width="6" height="6" rx="1.5" fill="black" />
                        <rect x="47" y="12" width="12" height="6" rx="1.5" fill="black" />
                        <rect x="63" y="5" width="6" height="12" rx="1.5" fill="black" />
                        <rect x="35" y="21" width="12" height="6" rx="1.5" fill="black" />
                        <rect x="53" y="21" width="6" height="18" rx="1.5" fill="black" />
                        
                        <rect x="5" y="35" width="18" height="6" rx="1.5" fill="black" />
                        <rect x="11" y="47" width="6" height="12" rx="1.5" fill="black" />
                        <rect x="23" y="41" width="18" height="6" rx="1.5" fill="black" />
                        <rect x="35" y="53" width="12" height="6" rx="1.5" fill="black" />
                        
                        <rect x="53" y="47" width="12" height="12" rx="2" fill="#ff5500" />
                        <rect x="73" y="35" width="12" height="6" rx="1.5" fill="black" />
                        <rect x="89" y="47" width="6" height="18" rx="1.5" fill="black" />
                        <rect x="73" y="53" width="12" height="6" rx="1.5" fill="black" />
                        
                        <rect x="35" y="73" width="6" height="12" rx="1.5" fill="black" />
                        <rect x="47" y="85" width="18" height="6" rx="1.5" fill="black" />
                        <rect x="53" y="73" width="6" height="6" rx="1.5" fill="black" />
                        <rect x="73" y="73" width="12" height="6" rx="1.5" fill="black" />
                        <rect x="85" y="85" width="10" height="10" rx="2" fill="black" />
                      </svg>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex flex-col gap-2 mt-2">
                      {/* Button to share link */}
                      <button
                        onClick={handleShareLink}
                        className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-brand-orange text-white hover:bg-brand-orange/95 text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-brand-orange/20"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Link Copied!</span>
                          </>
                        ) : (
                          <span>Share Invite Link</span>
                        )}
                      </button>

                      {/* Button to save QR image */}
                      <button
                        onClick={handleSaveQr}
                        className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
                      >
                        {savedQr ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-500" />
                            <span>QR Saved to Phone!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 text-zinc-400" />
                            <span>Save QR Image</span>
                          </>
                        )}
                      </button>
                    </div>

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
