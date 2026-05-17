"use client";

import React, { useState } from "react";
import { useCircle } from "@/context/CircleContext";
import { X, Camera, Sparkles, Link, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_FILMS = [
  {
    name: "Night Diner",
    url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80",
    desc: "Warm neon & cozy shadows",
  },
  {
    name: "Vintage Cruiser",
    url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=800&auto=format&fit=crop&q=80",
    desc: "Retro analog vehicle feel",
  },
  {
    name: "Vinyl Vault",
    url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&auto=format&fit=crop&q=80",
    desc: "Slightly grainy nostalgic aesthetic",
  },
  {
    name: "Sunset Ember",
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=80",
    desc: "Cozy fireside warmth",
  },
  {
    name: "Bistrot Lights",
    url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=80",
    desc: "Dreamy golden hour bokeh",
  },
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

    // Trigger Camera Flash visual effect!
    setShowFlash(true);
    
    // Play camera shutter mock sound if possible or just visual flash
    setTimeout(() => {
      uploadPhoto(urlToUpload);
      setShowFlash(false);
      onClose();
      // Clean up states
      setCustomUrl("");
      setSelectedPreset(null);
    }, 450); // duration of camera shutter action
  };

  const handleSnapRandom = () => {
    const placeholderUrls = [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    ];
    const pickedUrl = placeholderUrls[Math.floor(Math.random() * placeholderUrls.length)];
    // Add a unique timestamp suffix so it works as a new image
    const uniqUrl = `${pickedUrl}&random=${Date.now()}`;
    handleUpload(uniqUrl);
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
                ✨ PHOTO ADDED TO CIRCLE ✨
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

            {/* Viewfinder Overlay Frame wrapping the modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4"
            >
              {/* Vintage Shutter Viewfinder Crosshairs Frame */}
              <div className="absolute inset-6 md:inset-10 border border-zinc-800/30 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between text-[9px] text-zinc-600 uppercase font-semibold">
                  <span>F / 2.8</span>
                  <span>ISO 400</span>
                </div>
                <div className="flex justify-between text-[9px] text-zinc-600 uppercase font-semibold">
                  <span>AF-C</span>
                  <span>M-ROLL</span>
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
                    Camera Shutter
                  </span>
                  <h2 className="text-xl text-zinc-200 font-bold tracking-tight">
                    Add Photo to Circle
                  </h2>
                </div>

                {/* Snap Quick Trigger Banner */}
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
                        Snap Camera Roll
                      </p>
                      <p className="text-[9px] text-zinc-400 mt-0.5 font-medium">
                        Expose a random, highly atmospheric party roll.
                      </p>
                    </div>
                  </div>
                  <Zap className="w-4.5 h-4.5 text-brand-orange group-hover:scale-110 transition-transform" />
                </button>

                {/* Tab Swapping */}
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
                    Custom URL
                  </button>
                </div>

                {/* Tab contents */}
                {activeTab === "preset" ? (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {PRESET_FILMS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setSelectedPreset(preset.url);
                          handleUpload(preset.url);
                        }}
                        className="w-full flex items-center gap-3 p-2 bg-zinc-900/30 border border-zinc-900 rounded-xl hover:border-zinc-800 hover:bg-zinc-900/60 transition-all text-left cursor-pointer"
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-12 h-12 rounded-lg object-cover border border-zinc-800 shrink-0"
                        />
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
                        Paste Photo Web Link (Unsplash or similar):
                      </label>
                      <div className="flex gap-2">
                        <div className="relative w-full">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                          <input
                            type="url"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
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
                      Add Photo
                    </button>
                  </div>
                )}

                {/* Footer notes */}
                <div className="mt-5 pt-3 border-t border-zinc-900/80 text-[9px] text-zinc-600 leading-normal flex gap-2 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <p>All uploads are captured with the simulated active session. They will appear instantly in the live grid roll.</p>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
