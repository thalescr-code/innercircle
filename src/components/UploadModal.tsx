"use client";

import React, { useState } from "react";
import { useCircle } from "@/context/CircleContext";
import { X, Camera, Sparkles, Link, Zap, Video } from "lucide-react";
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
  const { uploadPhoto, mounted } = useCircle();
  const [customUrl, setCustomUrl] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [activeTab, setActiveTab] = useState<"preset" | "url">("preset");

  if (!mounted) return null;

  const handleUpload = (urlToUpload: string) => {
    if (!urlToUpload) return;

    // Trigger visual camera flash feedback effect
    setShowFlash(true);
    
    setTimeout(() => {
      uploadPhoto(urlToUpload);
      setShowFlash(false);
      onClose();
      // Clean up states
      setCustomUrl("");
      setSelectedPreset(null);
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

  return (
    <>
      {/* Absolute Solid White Shutter Flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 bg-white z-[9999] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <Zap className="w-12 h-12 text-brand-orange fill-brand-orange animate-bounce" />
              <span className="font-bold uppercase tracking-widest text-sm text-zinc-950">
                ✨ MEDIA SHARED WITH CIRCLE ✨
              </span>
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

            {/* Smartphone Live Camera Overlay Frame wrapping the modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4"
            >
              {/* Smartphone Camera Frame */}
              <div className="absolute inset-4 md:inset-8 border border-white/5 rounded-[32px] pointer-events-none flex flex-col justify-between p-6 overflow-hidden select-none">
                {/* Top Status Bar */}
                <div className="flex justify-between items-center text-[8px] font-bold tracking-widest text-zinc-500 uppercase">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>LENS ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>4K 60FPS</span>
                    <span>100% BAT</span>
                  </div>
                </div>

                {/* Grid Lines */}
                <div className="absolute inset-x-0 top-1/3 border-b border-white/[0.015] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-1/3 border-b border-white/[0.015] pointer-events-none" />
                <div className="absolute inset-y-0 left-1/3 border-r border-white/[0.015] pointer-events-none" />
                <div className="absolute inset-y-0 right-1/3 border-r border-white/[0.015] pointer-events-none" />

                {/* Bottom Status Bar */}
                <div className="flex justify-between items-center text-[8px] font-bold tracking-widest text-zinc-500 uppercase">
                  <span>SECURE P2P</span>
                  <span>AUTO-SAVE OFF</span>
                </div>
              </div>

              {/* Modal Card */}
              <div className="bg-zinc-950 border border-zinc-900 w-full max-w-md rounded-2xl shadow-2xl p-6 pointer-events-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient(circle, rgba(255, 85, 0, 0.05) 0%, transparent 70%) pointer-events-none" />

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
                    Circle Lens
                  </span>
                  <h2 className="text-xl text-zinc-200 font-bold tracking-tight">
                    Share Photo or Video
                  </h2>
                </div>

                {/* Option 1: Capture Live Media (Simulate Camera) */}
                <button
                  onClick={handleSnapRandom}
                  className="w-full flex items-center justify-between p-4 mb-5 bg-gradient-to-r from-brand-orange/20 to-zinc-900 border border-brand-orange/30 rounded-2xl hover:border-brand-orange/50 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/25 flex items-center justify-center text-brand-orange shrink-0">
                      <Camera className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                        Capture Live Media
                      </p>
                      <p className="text-[9px] text-zinc-400 mt-0.5 font-medium">
                        Simulate snapping a fresh photo or video using your circle's live lens.
                      </p>
                    </div>
                  </div>
                  <Zap className="w-4.5 h-4.5 text-brand-orange group-hover:scale-110 transition-transform" />
                </button>

                {/* Option 2: Upload from Library Tabs */}
                <div className="flex border-b border-zinc-900 mb-4">
                  <button
                    onClick={() => setActiveTab("preset")}
                    className={`flex-1 pb-2 text-[10px] uppercase tracking-widest font-bold border-b ${
                      activeTab === "preset"
                        ? "border-brand-orange text-brand-orange"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Choose Preset
                  </button>
                  <button
                    onClick={() => setActiveTab("url")}
                    className={`flex-1 pb-2 text-[10px] uppercase tracking-widest font-bold border-b ${
                      activeTab === "url"
                        ? "border-brand-orange text-brand-orange"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Paste Web Link
                  </button>
                </div>

                {/* Tab contents */}
                {activeTab === "preset" ? (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {PRESET_MEDIA.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setSelectedPreset(preset.url);
                          handleUpload(preset.url);
                        }}
                        className="w-full flex items-center gap-3 p-2 bg-zinc-900/30 border border-zinc-900 rounded-xl hover:border-zinc-800 hover:bg-zinc-900/60 transition-all text-left cursor-pointer animate-none"
                      >
                        {preset.type === "video" ? (
                          <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 relative overflow-hidden">
                            <video src={preset.url} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                            <Video className="w-5 h-5 text-brand-orange relative z-10" />
                          </div>
                        ) : (
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-12 h-12 rounded-lg object-cover border border-zinc-800 shrink-0"
                          />
                        )}
                        <div>
                          <p className="text-xs font-bold text-zinc-200">{preset.name}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">{preset.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-2">
                        Paste Photo or Video Web Link:
                      </label>
                      <div className="flex gap-2">
                        <div className="relative w-full">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                          <input
                            type="url"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="https://example.com/media.mp4 or .jpg"
                            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpload(customUrl)}
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

                {/* Footer notes */}
                <div className="mt-5 pt-3 border-t border-zinc-900/80 text-[9px] text-zinc-600 leading-normal flex gap-2 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <p>All shared photos and videos are pushed instantly to the group roll. Supports real-time rendering for portrait, landscape, and MP4 captures.</p>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
