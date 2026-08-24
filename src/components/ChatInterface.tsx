import React, { useState, useRef, useEffect } from 'react';
import type { Message, Room } from '../types';
import { MessageBubble } from './MessageBubble';
import { Send, Shield, Info, ArrowLeft, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatInterfaceProps {
  room: Room;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onCallModerator?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  room,
  messages,
  onSendMessage,
  onCallModerator,
}) => {
  const [inputText, setInputText] = useState('');
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-4rem-1px)] bg-bg-app md:h-[calc(100vh-4rem)]">
      {/* Sidebar - Collapsible on mobile, fixed on desktop */}
      <div
        className={`fixed md:relative inset-y-0 left-0 w-64 bg-surface-main border-r border-border-primary z-30 transform transition-transform duration-200 md:transform-none flex flex-col justify-between ${
          showSidebarMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Back button */}
          <Link
            to="/community"
            className="inline-flex items-center space-x-1.5 text-[10px] font-bold tracking-wider uppercase text-text-secondary hover:text-text-primary mb-6 transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Discussion Rooms</span>
          </Link>

          <h3 className="font-bold text-text-primary text-base mb-1.5 leading-tight">{room.name}</h3>
          <p className="text-xs text-text-secondary leading-normal mb-6">{room.description}</p>

          <div className="space-y-4">
            {/* Active members count */}
            <div className="flex items-center space-x-2 text-xs text-text-secondary">
              <UsersRound size={16} className="text-text-muted" />
              <span className="font-semibold">{room.talkingNow} active now</span>
            </div>

            {/* Safety/Moderation indicator */}
            <div className="flex items-start space-x-2.5 bg-surface-sec p-4 rounded-xl border border-border-primary">
              <Shield size={16} className="text-accent-teal shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-text-primary">Moderated Space</p>
                <p className="text-[10px] text-text-secondary leading-normal mt-1">
                  {room.moderatorAvailable 
                    ? `Moderator (${room.moderatorName.split(' ')[0]}) is online.`
                    : 'Moderators monitor reports promptly.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call moderator panel */}
        <div className="p-4 border-t border-border-primary bg-surface-sec/50 space-y-3">
          <div className="p-3 bg-accent-rose-light/30 border border-accent-rose/20 rounded-xl text-[10px] text-text-secondary leading-snug">
            <strong className="text-accent-rose block mb-0.5">Strict Conduct Policy:</strong>
            Offensive slurs, explicit terms, or insults will result in account suspension or permanent banning.
          </div>
          <div className="text-center">
            <p className="text-[10px] text-text-secondary leading-relaxed mb-2.5">
              If something violates safety rules, request an instant moderator check-in.
            </p>
            <button
              onClick={onCallModerator}
              className="inline-flex items-center justify-center space-x-1.5 w-full py-2 px-3 bg-accent-rose-light hover:bg-[#fae1e3] text-accent-rose text-xs font-bold rounded-[10px] border border-accent-rose/10 transition-colors cursor-pointer"
            >
              <Shield size={12} />
              <span>Request Moderator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {showSidebarMobile && (
        <div
          onClick={() => setShowSidebarMobile(false)}
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-20 md:hidden"
        ></div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-bg-app/40">
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-main border-b border-border-primary md:hidden shadow-xs">
          <div className="flex items-center space-x-2">
            <Link to="/community" className="text-text-secondary p-1 hover:text-text-primary">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h4 className="font-bold text-text-primary text-sm">{room.name}</h4>
              <p className="text-[10px] text-text-muted flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse-soft"></span>
                <span>{room.talkingNow} active now</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSidebarMobile(true)}
            className="text-text-secondary hover:text-text-primary p-2 rounded-xl bg-surface-sec border border-border-primary"
          >
            <Info size={16} />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <UsersRound size={28} className="text-text-muted mb-3" />
                <h4 className="font-bold text-text-primary text-sm">Welcome to {room.name}!</h4>
                <p className="text-xs text-text-secondary max-w-xs mt-1 leading-relaxed">
                  Type what's on your mind below. Keep the conversation respectful and supportive.
                </p>
              </div>
            ) : (
              messages
                .filter((msg) => msg.roomId === room.id)
                .map((msg) => <MessageBubble key={msg.id} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-surface-main border-t border-border-primary">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* Conduct & Ban Warning Banner */}
            <div className="bg-accent-rose-light/40 border border-accent-rose/20 rounded-xl p-2.5 flex items-start space-x-2 text-[10px] text-text-secondary leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-rose shrink-0 mt-1" />
              <div>
                <strong className="text-accent-rose">Common Room Conduct Warning:</strong> Offensive, explicit, harassing, or insulting language is strictly prohibited in public chatrooms and will lead to <strong>immediate account suspension or permanent ban</strong>. <em>(Private 1-on-1 therapist sessions remain confidential spaces for emotional processing, but public spaces must remain safe for all.)</em>
              </div>
            </div>

            <form onSubmit={handleSend} className="flex items-center space-x-2">
              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type what's on your mind... (Keep it respectful & supportive)"
                className="flex-1 bg-surface-sec text-text-primary placeholder-text-muted text-xs py-3 px-4 rounded-[10px] border border-border-primary focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 transition-all duration-150 ${
                  inputText.trim()
                    ? 'bg-brand-primary hover:bg-brand-hover text-white active:bg-brand-pressed shadow-sm shadow-brand-primary/10 cursor-pointer'
                    : 'bg-surface-sec text-text-muted cursor-not-allowed border border-border-primary'
                }`}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
