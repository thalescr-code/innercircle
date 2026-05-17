"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  profilePic: string;
  strikes: number;
}

export interface Circle {
  id: string;
  name: string;
  hostId: string;
  members: string[]; // User IDs
  bootedMembers: string[]; // User IDs
  isSavageModeEnabled: boolean; // Dynamic Toggle Self-Moderation
}

export interface Photo {
  id: string;
  circleId: string;
  uploaderId: string;
  mediaUrl: string;
  downvotes: string[]; // User IDs who downvoted
  timestamp: string;
}

interface CircleContextType {
  currentUser: User | null;
  users: User[];
  circle: Circle;
  photos: Photo[];
  logs: string[];
  mounted: boolean;
  activeMembers: User[];
  bootedMembers: User[];
  filterUploaderId: string | null;
  setFilterUploaderId: (id: string | null) => void;
  toggleSimulatedUser: (userId: string) => void;
  downvotePhoto: (photoId: string) => void;
  uploadPhoto: (mediaUrl: string) => void;
  deletePhoto: (photoId: string) => void;
  manuallyRemoveMember: (memberId: string) => void;
  resetState: () => void;
  addLog: (text: string) => void;
  toggleSavageMode: () => void;
  inviteFriend: (name: string) => void;
}

const INITIAL_USERS: User[] = [
  {
    id: "user-host",
    name: "Thales",
    profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    strikes: 0,
  },
  {
    id: "user-1",
    name: "Charlie",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    strikes: 0,
  },
  {
    id: "user-2",
    name: "Marcus",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    strikes: 0,
  },
  {
    id: "user-3",
    name: "Sophia",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    strikes: 0,
  },
  {
    id: "user-4",
    name: "Chloe",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    strikes: 0,
  },
];

const INITIAL_CIRCLE: Circle = {
  id: "circle-1",
  name: "Thales's 26th Birthday",
  hostId: "user-host",
  members: ["user-host", "user-1", "user-2", "user-3", "user-4"],
  bootedMembers: [],
  isSavageModeEnabled: true,
};

const INITIAL_PHOTOS: Photo[] = [
  {
    id: "photo-1",
    circleId: "circle-1",
    uploaderId: "user-1", // Charlie
    mediaUrl: "https://images.unsplash.com/photo-1542204172-e7052809a936?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 22:04:12",
  },
  {
    id: "photo-2",
    circleId: "circle-1",
    uploaderId: "user-2", // Marcus
    mediaUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 22:15:30",
  },
  {
    id: "photo-3",
    circleId: "circle-1",
    uploaderId: "user-3", // Sophia
    mediaUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 22:31:05",
  },
  {
    id: "photo-4",
    circleId: "circle-1",
    uploaderId: "user-4", // Chloe
    mediaUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 22:42:19",
  },
  {
    id: "photo-5",
    circleId: "circle-1",
    uploaderId: "user-1", // Charlie
    mediaUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 22:55:00",
  },
  {
    id: "photo-6",
    circleId: "circle-1",
    uploaderId: "user-2", // Marcus
    mediaUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 23:02:14",
  },
  {
    id: "photo-7",
    circleId: "circle-1",
    uploaderId: "user-3", // Sophia
    mediaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 23:08:45",
  },
  {
    id: "photo-8",
    circleId: "circle-1",
    uploaderId: "user-4", // Chloe
    mediaUrl: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 23:14:22",
  },
  {
    id: "photo-9",
    circleId: "circle-1",
    uploaderId: "user-host", // Thales
    mediaUrl: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 23:25:30",
  },
  {
    id: "photo-10",
    circleId: "circle-1",
    uploaderId: "user-host", // Thales
    mediaUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
    downvotes: [],
    timestamp: "05.16 23:30:15",
  },
];

const CircleContext = createContext<CircleContextType | undefined>(undefined);

export const CircleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [circle, setCircle] = useState<Circle>(INITIAL_CIRCLE);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [logs, setLogs] = useState<string[]>(["✨ Inner Circle birthday rolls initialized."]);
  const [mounted, setMounted] = useState(false);
  const [filterUploaderId, setFilterUploaderId] = useState<string | null>(null);

  // Sync to LocalStorage on client mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("ic_v3_users");
    const storedCircle = localStorage.getItem("ic_v3_circle");
    const storedPhotos = localStorage.getItem("ic_v3_photos");
    const storedLogs = localStorage.getItem("ic_v3_logs");
    const storedActiveUser = localStorage.getItem("ic_v3_current_user_id");

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedCircle) setCircle(JSON.parse(storedCircle));
    if (storedPhotos) setPhotos(JSON.parse(storedPhotos));
    if (storedLogs) setLogs(JSON.parse(storedLogs));

    // Default current user is the host
    const defaultUserId = storedActiveUser || "user-host";
    const foundUser = (storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS).find(
      (u: User) => u.id === defaultUserId
    );
    setCurrentUser(foundUser || INITIAL_USERS[0]);

    setMounted(true);
  }, []);

  // Save changes to LocalStorage
  const saveState = (newUsers: User[], newCircle: Circle, newPhotos: Photo[], newLogs: string[]) => {
    localStorage.setItem("ic_v3_users", JSON.stringify(newUsers));
    localStorage.setItem("ic_v3_circle", JSON.stringify(newCircle));
    localStorage.setItem("ic_v3_photos", JSON.stringify(newPhotos));
    localStorage.setItem("ic_v3_logs", JSON.stringify(newLogs));
  };

  const addLog = (text: string) => {
    const newLogs = [`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${text}`, ...logs].slice(0, 50);
    setLogs(newLogs);
    localStorage.setItem("ic_v3_logs", JSON.stringify(newLogs));
  };

  const toggleSimulatedUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem("ic_v3_current_user_id", userId);
      addLog(`⚡ Switched session to ${found.name}`);
    }
  };

  const uploadPhoto = (mediaUrl: string) => {
    if (!currentUser) return;

    // Check if the user is booted
    if (circle.bootedMembers.includes(currentUser.id)) {
      addLog(`⚠️ Attempted upload by booted user ${currentUser.name}`);
      return;
    }

    // Check if user is a member
    if (!circle.members.includes(currentUser.id)) {
      addLog(`⚠️ Unauthorized upload attempt by non-member ${currentUser.name}`);
      return;
    }

    const now = new Date();
    const formattedDate = `${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      circleId: circle.id,
      uploaderId: currentUser.id,
      mediaUrl,
      downvotes: [],
      timestamp: formattedDate,
    };

    const updatedPhotos = [newPhoto, ...photos];
    setPhotos(updatedPhotos);
    saveState(users, circle, updatedPhotos, logs);
    addLog(`📸 ${currentUser.name} uploaded a new photo`);
  };

  const deletePhoto = (photoId: string) => {
    if (!currentUser) return;
    const targetPhoto = photos.find((p) => p.id === photoId);
    if (!targetPhoto) return;

    // Host can delete any photo. Uploader can delete their own.
    const isHost = circle.hostId === currentUser.id;
    const isUploader = targetPhoto.uploaderId === currentUser.id;

    if (isHost || isUploader) {
      const updatedPhotos = photos.filter((p) => p.id !== photoId);
      setPhotos(updatedPhotos);
      saveState(users, circle, updatedPhotos, logs);
      const reason = isHost ? "Host override" : "Self-removal";
      addLog(`🗑️ Photo deleted by ${currentUser.name} (${reason})`);
    } else {
      addLog(`⚠️ ${currentUser.name} tried to delete a photo without permission`);
    }
  };

  const downvotePhoto = (photoId: string) => {
    if (!currentUser) return;

    // Booted members cannot downvote
    if (circle.bootedMembers.includes(currentUser.id) || !circle.members.includes(currentUser.id)) {
      addLog(`⚠️ Booted or non-member ${currentUser.name} tried to flag a photo`);
      return;
    }

    const targetPhoto = photos.find((p) => p.id === photoId);
    if (!targetPhoto) return;

    // Can't downvote your own photo!
    if (targetPhoto.uploaderId === currentUser.id) {
      addLog(`⚠️ ${currentUser.name} tried to downvote their own photo`);
      return;
    }

    let updatedPhotos = photos.map((p) => {
      if (p.id === photoId) {
        const hasVoted = p.downvotes.includes(currentUser.id);
        const newDownvotes = hasVoted
          ? p.downvotes.filter((uid) => uid !== currentUser.id)
          : [...p.downvotes, currentUser.id];
        return { ...p, downvotes: newDownvotes };
      }
      return p;
    });

    const currentPhoto = updatedPhotos.find((p) => p.id === photoId);
    if (!currentPhoto) return;

    const hasVotedNow = currentPhoto.downvotes.includes(currentUser.id);
    addLog(`⚡ ${currentUser.name} ${hasVotedNow ? "flagged" : "unflagged"} a photo`);

    // Check Savage Mode threshold: downvotes > 50% of active members
    const activeMembersCount = circle.members.length;
    const requiredVotes = activeMembersCount / 2; // Strict majority means downvotes.length > activeMembersCount / 2

    // Auto-deletion triggers only if Savage Mode is turned ON
    if (circle.isSavageModeEnabled && currentPhoto.downvotes.length > requiredVotes) {
      // Photo is SAVAGE deleted!
      updatedPhotos = updatedPhotos.filter((p) => p.id !== photoId);
      addLog(`🔥 Photo auto-deleted by community flag (${currentPhoto.downvotes.length}/${activeMembersCount} flags)`);

      // Update strikes for the uploader
      const uploaderId = targetPhoto.uploaderId;
      const uploader = users.find((u) => u.id === uploaderId);
      
      let updatedUsers = [...users];
      let updatedCircle = { ...circle };

      if (uploader) {
        const newStrikes = uploader.strikes + 1;
        addLog(`⚡ ${uploader.name} received strike ${newStrikes}/2`);

        updatedUsers = users.map((u) => {
          if (u.id === uploaderId) {
            return { ...u, strikes: newStrikes };
          }
          return u;
        });

        if (newStrikes >= 2) {
          // Banned/Booted from circle!
          updatedCircle.members = circle.members.filter((mid) => mid !== uploaderId);
          updatedCircle.bootedMembers = [...circle.bootedMembers, uploaderId];
          addLog(`🚫 ${uploader.name} was booted from the Circle (2 strikes)`);
        }
      }

      setPhotos(updatedPhotos);
      setUsers(updatedUsers);
      setCircle(updatedCircle);
      
      // Update simulated current user reference if strikes updated
      const freshCurrentUser = updatedUsers.find((u) => u.id === currentUser.id);
      if (freshCurrentUser) {
        setCurrentUser(freshCurrentUser);
      }

      saveState(updatedUsers, updatedCircle, updatedPhotos, logs);
    } else {
      setPhotos(updatedPhotos);
      saveState(users, circle, updatedPhotos, logs);
    }
  };

  const manuallyRemoveMember = (memberId: string) => {
    if (!currentUser) return;
    if (circle.hostId !== currentUser.id) {
      addLog(`⚠️ Only Host can manually boot members`);
      return;
    }

    if (memberId === circle.hostId) {
      addLog(`⚠️ Host cannot boot themselves`);
      return;
    }

    const memberName = users.find((u) => u.id === memberId)?.name || memberId;
    
    const updatedCircle = {
      ...circle,
      members: circle.members.filter((mid) => mid !== memberId),
      bootedMembers: [...circle.bootedMembers, memberId],
    };

    setCircle(updatedCircle);
    saveState(users, updatedCircle, photos, logs);
    addLog(`🚫 Host ${currentUser.name} booted ${memberName} from the Circle`);
  };

  const toggleSavageMode = () => {
    if (!currentUser) return;
    if (circle.hostId !== currentUser.id) {
      addLog("⚠️ Only the Host can toggle settings");
      return;
    }

    const updatedCircle = {
      ...circle,
      isSavageModeEnabled: !circle.isSavageModeEnabled,
    };

    setCircle(updatedCircle);
    saveState(users, updatedCircle, photos, logs);
    addLog(`⚙️ Savage Mode self-moderation ${updatedCircle.isSavageModeEnabled ? "enabled" : "disabled"} by Host`);
  };

  const inviteFriend = (name: string) => {
    if (!currentUser) return;
    if (circle.hostId !== currentUser.id) {
      addLog("⚠️ Only the Host can invite friends to this Circle");
      return;
    }

    const newId = `user-${Date.now()}`;
    const profilePics = [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    ];
    const randomPic = profilePics[users.length % profilePics.length];

    const newFriend: User = {
      id: newId,
      name,
      profilePic: randomPic,
      strikes: 0
    };

    const updatedUsers = [...users, newFriend];
    const updatedCircle = {
      ...circle,
      members: [...circle.members, newId]
    };

    setUsers(updatedUsers);
    setCircle(updatedCircle);
    saveState(updatedUsers, updatedCircle, photos, logs);
    addLog(`✨ ${name} joined the Circle via Host invitation`);
  };

  const resetState = () => {
    localStorage.removeItem("ic_v3_users");
    localStorage.removeItem("ic_v3_circle");
    localStorage.removeItem("ic_v3_photos");
    localStorage.removeItem("ic_v3_logs");
    localStorage.removeItem("ic_v3_current_user_id");

    setUsers(INITIAL_USERS);
    setCircle(INITIAL_CIRCLE);
    setPhotos(INITIAL_PHOTOS);
    setLogs(["✨ Inner Circle birthday rolls reset."]);
    setCurrentUser(INITIAL_USERS[0]);
    
    // Quick reload logs to keep system clear
    setTimeout(() => {
      addLog("✨ Rolls and member rosters reset successfully");
    }, 100);
  };

  // Derived properties
  const activeMembers = users.filter((u) => circle.members.includes(u.id));
  const bootedMembers = users.filter((u) => circle.bootedMembers.includes(u.id));

  return (
    <CircleContext.Provider
      value={{
        currentUser,
        users,
        circle,
        photos,
        logs,
        mounted,
        activeMembers,
        bootedMembers,
        filterUploaderId,
        setFilterUploaderId,
        toggleSimulatedUser,
        downvotePhoto,
        uploadPhoto,
        deletePhoto,
        manuallyRemoveMember,
        resetState,
        addLog,
        toggleSavageMode,
        inviteFriend,
      }}
    >
      {children}
    </CircleContext.Provider>
  );
};

export const useCircle = () => {
  const context = useContext(CircleContext);
  if (context === undefined) {
    throw new Error("useCircle must be used within a CircleProvider");
  }
  return context;
};
