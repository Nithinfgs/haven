import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cvbhxngqqnnawknmvsul.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Ymh4bmdxcW5uYXdrbm12c3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMTI1MzEsImV4cCI6MjEwMjg4ODUzMX0.fetq0YqG7tSSWx_p6E-gZzU7z7MbXjtru-JnpMl5zyQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Backend Database Service Helpers
 */
export const HavenBackend = {
  // Check if Supabase connection is live
  isConfigured: () => Boolean(supabaseUrl && supabaseAnonKey),

  // 1. Appointments
  createAppointment: async (appointment: {
    therapist_id: string;
    therapist_name: string;
    user_name: string;
    date: string;
    time: string;
    meeting_link: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select();
      if (error) console.warn('Supabase appointment insert:', error.message);
      return data;
    } catch (e) {
      console.warn('Fallback to local storage:', e);
      return null;
    }
  },

  // 2. Chat Messages
  sendMessage: async (message: {
    room_id: string;
    sender_name: string;
    sender_role: string;
    content: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([message])
        .select();
      if (error) console.warn('Supabase message insert:', error.message);
      return data;
    } catch (e) {
      console.warn('Fallback to local storage:', e);
      return null;
    }
  },

  // 3. Subscribe to Realtime Messages
  subscribeToRoom: (roomId: string, onNewMessage: (msg: any) => void) => {
    return supabase
      .channel(`room_${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          onNewMessage(payload.new);
        }
      )
      .subscribe();
  }
};
