import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Room } from '../types';
import { MessageSquare, Shield, UsersRound } from 'lucide-react';
import { getMockDatabase } from '../mockData';

interface CommunityCardProps {
  room: Room;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ room }) => {
  const db = getMockDatabase();
  const allMessages = db.getMessages();

  // Retrieve the latest message sent in this discussion room
  const roomMessages = allMessages.filter((m) => m.roomId === room.id);
  const latestMessage = roomMessages[roomMessages.length - 1];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-surface-main border border-border-primary rounded-2xl p-6 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Title & Live indicator */}
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-extrabold text-text-primary text-sm leading-snug">
            {room.name}
          </h4>
          {room.talkingNow > 0 && (
            <span className="flex items-center space-x-1 bg-accent-teal-light text-accent-teal text-[9px] px-2.5 py-0.5 rounded-full font-bold border border-accent-teal/10">
              <span className="w-1 h-1 rounded-full bg-accent-teal animate-pulse-soft"></span>
              <span>Live</span>
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-text-secondary text-xs leading-normal mb-5">
          {room.description}
        </p>

        {/* Active discussion preview */}
        {latestMessage ? (
          <div className="bg-surface-sec/40 border border-border-primary/40 rounded-xl p-3.5 mb-6 text-[10px] leading-relaxed">
            <span className="font-extrabold text-text-primary block mb-0.5">
              {latestMessage.sender.isYou ? 'You' : latestMessage.sender.name}
            </span>
            <p className="text-text-secondary italic line-clamp-2">
              "{latestMessage.content}"
            </p>
          </div>
        ) : (
          <div className="bg-surface-sec/20 border border-border-primary/20 rounded-xl p-3.5 mb-6 text-[10px] leading-relaxed text-text-muted italic">
            No activity yet. Start the conversation.
          </div>
        )}
      </div>

      <div>
        {/* Metadata section */}
        <div className="flex items-center justify-between text-[10px] text-text-muted mb-4 pt-3 border-t border-border-primary/50">
          <div className="flex items-center space-x-1.5 font-semibold">
            <UsersRound size={13} className="text-text-muted/60" />
            <span>{room.activeMembers} online</span>
          </div>

          <div className="flex items-center space-x-1.5 font-semibold">
            <Shield size={13} className={room.moderatorAvailable ? 'text-accent-teal' : 'text-text-muted/60'} />
            <span className={room.moderatorAvailable ? 'text-accent-teal' : ''}>
              {room.moderatorAvailable ? 'Mod active' : 'Monitored'}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/chat/${room.id}`}
          className="inline-flex items-center justify-center space-x-1.5 w-full h-10 bg-accent-teal-light hover:bg-[#d4e9e5] text-accent-teal text-xs font-bold rounded-[10px] transition-colors cursor-pointer"
        >
          <MessageSquare size={13} />
          <span>Join conversation</span>
        </Link>
      </div>
    </motion.div>
  );
};
