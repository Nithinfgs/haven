import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatInterface } from '../components/ChatInterface';
import { getMockDatabase } from '../mockData';
import type { Room, Message } from '../types';
import { EmptyState } from '../components/EmptyState';
import { MessageSquare, ShieldAlert } from 'lucide-react';
import { HavenBackend } from '../lib/supabase';

export const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const db = getMockDatabase();

  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showModFeedback, setShowModFeedback] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const rooms = db.getRooms();
    let foundRoom = rooms.find((r) => r.id === roomId);

    // If it's a direct therapist 1-on-1 room
    if (!foundRoom && (roomId.startsWith('therapist-') || db.getTherapists().some(t => t.id === roomId))) {
      const therapistId = roomId.replace('therapist-', '');
      const foundTherapist = db.getTherapists().find(t => t.id === therapistId || t.id === roomId);
      if (foundTherapist) {
        foundRoom = {
          id: roomId,
          name: `${foundTherapist.name} (Direct Consultation)`,
          category: 'general',
          spaceType: 'intent',
          description: `Private, encrypted 1-on-1 consultation channel with ${foundTherapist.name} (${foundTherapist.credentials}).`,
          guidelines: 'Confidential clinical discussion. You can also join your Google Meet video call from your profile.',
          activeMembers: 2,
          talkingNow: 2,
          moderatorName: foundTherapist.name,
          moderatorAvailable: true,
          status: 'Active'
        };
      }
    }

    setRoom(foundRoom);

    if (foundRoom) {
      const allMsgs = db.getMessages();
      let roomMsgs = allMsgs.filter((m) => m.roomId === foundRoom.id);

      // If direct therapist consultation room is fresh, seed welcome greeting
      if (roomMsgs.length === 0 && (roomId.startsWith('therapist-') || db.getTherapists().some(t => t.id === roomId))) {
        const therapistId = roomId.replace('therapist-', '');
        const foundTherapist = db.getTherapists().find(t => t.id === therapistId || t.id === roomId);
        if (foundTherapist) {
          const welcomeMsg: Message = {
            id: `m_welcome_${Date.now()}`,
            roomId: foundRoom.id,
            sender: {
              name: foundTherapist.name,
              isYou: false,
              role: 'therapist',
              avatar: foundTherapist.avatar
            },
            content: `Hello Sam! Welcome to our direct consultation channel. Feel free to share what's on your mind before our scheduled video session.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          roomMsgs = [welcomeMsg];
          db.setMessages([...allMsgs, welcomeMsg]);
        }
      }

      setMessages(roomMsgs);
    }
  }, [roomId]);

  const handleSendMessage = (text: string) => {
    if (!room) return;

    const newMsg: Message = {
      id: `m_user_${Date.now()}`,
      roomId: room.id,
      sender: {
        name: 'Sam',
        isYou: true,
        role: 'user',
        avatar: 'S',
      },
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Save message to localStorage db
    const currentAll = db.getMessages();
    const updatedAll = [...currentAll, newMsg];
    db.setMessages(updatedAll);
    setMessages(updatedAll.filter((m) => m.roomId === room.id));

    // Cloud Sync to Supabase
    HavenBackend.sendMessage({
      room_id: room.id,
      sender_name: 'Sam',
      sender_role: 'user',
      content: text
    });

    // Check if therapist consultation or community room
    const isTherapistRoom = room.id.startsWith('therapist-') || db.getTherapists().some(t => t.id === room.id);
    const therapistId = room.id.replace('therapist-', '');
    const matchedTherapist = db.getTherapists().find(t => t.id === therapistId || t.id === room.id);

    setTimeout(() => {
      let replySenderName = 'Alex';
      let replyRole: 'user' | 'therapist' = 'user';
      let replyContent = "I totally get that. Thanks for sharing, honestly.";

      if (isTherapistRoom && matchedTherapist) {
        replySenderName = matchedTherapist.name;
        replyRole = 'therapist';
        const therapistReplies = [
          `Thank you for sharing that with me, Sam. I've noted it down and we'll dive into practical coping steps during our upcoming video call.`,
          `I hear how much that's taking out of you. Remember to take a slow breath right now—you don't have to carry it all at once.`,
          `That makes complete sense given what you've been managing. Let's make this our primary focus in our Google Meet session.`,
          `I'm right here with you. Thank you for putting this into words.`
        ];
        replyContent = therapistReplies[Math.floor(Math.random() * therapistReplies.length)];
      } else {
        const peers = ['Alex', 'Jordan', 'Taylor', 'Jamie'];
        replySenderName = peers[Math.floor(Math.random() * peers.length)];
        const supportiveResponses = [
          "I totally get that. Thanks for sharing, honestly.",
          "That sounds really tough. We're here for you.",
          "I was feeling the same way yesterday. It helps to talk about it.",
          "Glad you mentioned that. You're definitely not alone in this.",
          "Take it easy on yourself today, alright?",
        ];
        replyContent = supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
      }

      const replyMsg: Message = {
        id: `m_reply_${Date.now()}`,
        roomId: room.id,
        sender: {
          name: replySenderName,
          isYou: false,
          role: replyRole,
          avatar: matchedTherapist?.avatar
        },
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const withReply = db.getMessages();
      db.setMessages([...withReply, replyMsg]);
      setMessages(prev => [...prev, replyMsg]);
    }, 1800);
  };

  const handleCallModerator = () => {
    if (!room) return;
    
    // Add item to flagged items database
    const flagged = db.getFlaggedItems();
    const newItem = {
      id: `f_user_${Date.now()}`,
      messageId: `msg_${Date.now()}`,
      messageContent: 'User requested a moderator check-in.',
      senderName: 'System Flag',
      roomName: room.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reason: 'User Flag Request',
      status: 'pending' as const
    };
    db.setFlaggedItems([...flagged, newItem]);

    // Show toast feedback
    setShowModFeedback(true);
    setTimeout(() => {
      setShowModFeedback(false);
    }, 4000);
  };

  if (!room) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <EmptyState
          icon={<MessageSquare size={32} className="text-text-muted" />}
          title="Room not found"
          description="This discussion room may have been completed, closed, or moved."
          actionText="Back to communities"
          onAction={() => navigate('/community')}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toast Alert overlay for Moderator request confirmation */}
      {showModFeedback && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full px-4">
          <div className="bg-accent-rose text-white rounded-[10px] p-4 shadow-lg flex items-center space-x-3 text-xs font-semibold">
            <ShieldAlert size={16} />
            <span>
              Moderators have been alerted to review this room. Thank you for helping keep Haven safe.
            </span>
          </div>
        </div>
      )}

      <ChatInterface
        room={room}
        messages={messages}
        onSendMessage={handleSendMessage}
        onCallModerator={handleCallModerator}
      />
    </div>
  );
};
