export interface Therapist {
  id: string;
  name: string;
  credentials: string;
  avatar: string;
  introduction: string;
  fullBio: string;
  specialties: string[];
  languages: string[];
  availableToday: boolean;
  online: boolean;
  status: 'Available' | 'In session' | 'Offline' | 'pending_approval' | 'rejected';
  schedule: string[]; // e.g. ["2:00 PM", "3:30 PM", "5:00 PM"]
  currentActivity?: string;
  whyConnect?: string;
  licenseNumber?: string;
  email?: string;
  appliedAt?: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  category: 'intent' | 'circle' | 'stress' | 'school' | 'friendships' | 'family' | 'general' | 'all' | 'other';
  spaceType?: 'intent' | 'circle'; // 'intent' = In the Moment (e.g. I need someone to listen), 'circle' = Topic/Growth (e.g. Sleep, Focus)
  activeMembers: number;
  talkingNow: number;
  moderatorName: string;
  moderatorAvailable: boolean;
  status: 'Active' | 'Archived' | 'pending';
  isPrivate?: boolean;
  inviteCode?: string;
  guidelines?: string;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  stress: 'low' | 'moderate' | 'high' | 'overwhelmed';
  energy: 'drained' | 'moderate' | 'energized';
  sleep: 'restless' | 'fair' | 'deep';
  connection: 'isolated' | 'neutral' | 'connected';
  smallActionDone?: string;
  timestamp: string;
}

export interface PatternInsight {
  id: string;
  title: string;
  insight: string;
  category: 'sleep_stress' | 'connection_mood' | 'action_energy';
  dataPointsCount: number;
}

export interface Message {
  id: string;
  roomId: string;
  sender: {
    name: string;
    isYou: boolean;
    role: 'user' | 'volunteer' | 'therapist' | 'moderator';
    avatar?: string;
  };
  content: string;
  timestamp: string; // "14:19"
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  description: string;
  isCompletedToday: boolean;
  history: { [date: string]: boolean };
  shareWithTherapist: boolean;
}

export interface DiaryEntry {
  id: string;
  date: string;
  mood: string;
  moodEmoji?: string;
  text: string;
  shareWithTherapist: boolean;
}

export interface CommunicationLog {
  id: string;
  type: 'call' | 'video_session' | 'message' | 'crisis_call';
  title: string;
  senderOrWith: string;
  summary: string;
  timestamp: string;
  status: 'Completed' | 'Delivered' | 'Scheduled' | 'Missed';
  duration?: string;
}

export interface PatientNote {
  id: string;
  therapistName: string;
  date: string;
  content: string;
}

export interface NotificationItem {
  id: string;
  category: 'personal' | 'community' | 'appointment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface TimelineEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  type: 'checkin' | 'moment' | 'cbt' | 'habit' | 'session';
}

export interface UserProfile {
  name: string;
  email?: string;
  avatar: string;
  ageRange: string;
  school?: string;
  grade?: string;
  bio?: string;
  mood?: string;
  theme?: 'light' | 'dark' | 'system';
  palette?: 'haven' | 'ocean' | 'forest' | 'lavender' | 'sunset' | 'monochrome';
  language?: 'en' | 'ta' | 'hi' | 'ur' | 'kn' | 'te';
  privacyMode?: 'local_only' | 'cloud_sync';
  reducedMotion?: boolean;
  quietHours?: boolean;
  onboarded?: boolean;
  primaryGoals?: string[];
  joinedRooms: string[]; // Room IDs
  savedTherapists: string[]; // Therapist IDs
  upcomingSessions: {
    therapistId: string;
    therapistName: string;
    date: string;
    time: string;
    meetingLink?: string;
  }[];
  habits?: Habit[];
  diaryEntries?: DiaryEntry[];
  communicationLogs?: CommunicationLog[];
  clinicalNotes?: PatientNote[];
  checkIns?: DailyCheckIn[];
  timeline?: TimelineEntry[];
  notifications?: NotificationItem[];
}

export interface FlaggedItem {
  id: string;
  messageId: string;
  messageContent: string;
  senderName: string;
  roomName: string;
  timestamp: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface ActivityLog {
  id: string;
  type: 'session' | 'join' | 'moderator' | 'availability';
  description: string;
  timestamp: string; // e.g. "2 min ago"
}

export interface DashboardStats {
  therapistsOnline: number;
  therapistsOnlineChange: string; // e.g. "+3 in the last hour"
  activeConversations: number;
  communityRoomsActive: number;
  usersNeedingSupport: number;
}

export interface Guide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
  status: 'pending' | 'published';
  authorName?: string;
  author?: string;
}
