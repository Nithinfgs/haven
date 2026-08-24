import React from 'react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMe = message.sender.isYou;
  const isModerator = message.sender.role === 'moderator';
  const isVolunteer = message.sender.role === 'volunteer';

  // Determine styles based on who is sending the message
  let bubbleClass = 'bg-surface-main text-text-primary rounded-tr-xl rounded-br-xl rounded-bl-xl border border-border-primary';
  let containerClass = 'flex justify-start';

  if (isMe) {
    bubbleClass = 'bg-brand-light text-text-primary rounded-tl-xl rounded-bl-xl rounded-br-xl border border-brand-primary/10';
    containerClass = 'flex justify-end';
  } else if (isModerator) {
    bubbleClass = 'bg-accent-teal-light text-accent-teal-hover rounded-tr-xl rounded-br-xl rounded-bl-xl border border-accent-teal/20';
  } else if (isVolunteer) {
    bubbleClass = 'bg-accent-amber-light text-[#A86E1F] rounded-tr-xl rounded-br-xl rounded-bl-xl border border-accent-amber/20';
  }

  // Get sender initials
  const initials = message.sender.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className={`mb-4 w-full ${containerClass}`}>
      <div className={`flex items-start max-w-[75%] space-x-2.5 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
        
        {/* Avatar/Initial circle */}
        {!isMe && (
          <div 
            className={`w-8 h-8 rounded-[10px] flex items-center justify-center text-[10px] font-bold shrink-0 ${
              isModerator 
                ? 'bg-accent-teal-light text-accent-teal' 
                : isVolunteer 
                  ? 'bg-accent-amber-light text-accent-amber' 
                  : 'bg-surface-sec text-text-secondary border border-border-primary'
            }`}
          >
            {initials}
          </div>
        )}

        {/* Message bubble core */}
        <div>
          <div className={`flex items-center space-x-2 mb-1 text-[10px] text-text-muted ${isMe ? 'justify-end' : ''}`}>
            <span className="font-bold text-text-secondary">
              {isMe ? 'You' : message.sender.name}
            </span>
            {isModerator && (
              <span className="bg-accent-teal-light text-accent-teal text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-accent-teal/10">
                Moderator
              </span>
            )}
            {isVolunteer && (
              <span className="bg-accent-amber-light text-accent-amber text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-accent-amber/10">
                Volunteer
              </span>
            )}
            <span className="opacity-75">{message.timestamp}</span>
          </div>

          <div className={`px-4 py-3 text-xs leading-relaxed ${bubbleClass}`}>
            <p className="whitespace-pre-line">{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
