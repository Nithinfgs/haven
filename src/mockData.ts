import type { Therapist, Room, Message, UserProfile, FlaggedItem, ActivityLog, DashboardStats, Guide } from './types';

export const INITIAL_THERAPISTS: Therapist[] = [
  {
    id: 'maya-patel',
    name: 'Dr. Maya Patel',
    credentials: 'Licensed Psychologist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    introduction: "Hi, I'm Maya. I work with young people dealing with stress, anxiety, and major life changes. My approach is relaxed, practical, and focused on helping you feel understood.",
    fullBio: "I have over 8 years of experience working with adolescents and young adults. I specialize in cognitive behavioral therapy (CBT) and mindfulness-based stress reduction. I believe that therapy should feel like a safe, collaborative conversation rather than a rigid medical evaluation. In my free time, I love hiking and reading.",
    specialties: ['Stress', 'Anxiety', 'School pressure'],
    languages: ['English', 'Hindi', 'Tamil'],
    availableToday: true,
    online: true,
    status: 'Available',
    schedule: ['2:00 PM', '3:30 PM', '5:00 PM'],
    whyConnect: 'You are feeling overwhelmed by school exams, stress levels, and visual triggers.'
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    credentials: 'Licensed Clinical Social Worker',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200&h=200',
    introduction: "Hi there. I focus on relationships, self-esteem, and navigated family boundaries. I believe in giving you practical tools to manage your daily challenges.",
    fullBio: "I have worked in school counseling and community mental health for 6 years. I focus on relationship dynamics, family changes, and self-acceptance. I teach practical skills like cognitive reframing and boundary-setting so that you can navigate situations in a healthy way.",
    specialties: ['Relationships', 'Family life', 'Self-esteem'],
    languages: ['English', 'Telugu', 'Kannada'],
    availableToday: true,
    online: false,
    status: 'Offline',
    schedule: ['10:00 AM', '11:30 AM', '4:00 PM'],
    whyConnect: 'You need guidance setting boundaries with family members or handling group chat drama.'
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    credentials: 'Licensed Professional Counselor',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    introduction: "Welcome. I help clients deal with low mood, loneliness, and lifestyle habits. Together, we will work on building steady routines that support your emotional state.",
    fullBio: "I specialize in supporting teenagers and young adults navigating depression, grief, and identity adjustments. I have a background in music therapy and active listening, and I aim to help clients discover creative channels for self-expression and building personal support routines.",
    specialties: ['Mood support', 'Loneliness', 'Habits'],
    languages: ['English', 'Urdu', 'Hindi'],
    availableToday: false,
    online: true,
    status: 'Available',
    schedule: [],
    whyConnect: 'You are feeling isolated, dealing with a low mood cycle, or trying to fix your sleep patterns.'
  },
  {
    id: 'emma-zhao',
    name: 'Emma Zhao',
    credentials: 'Licensed Marriage & Family Therapist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
    introduction: "Hello. I work with adolescents on identity questions, academic pressure, and stress management. I use a strengths-based method to help you discover what already works.",
    fullBio: "I have spent 5 years working in clinical and school-based settings. I guide teenagers navigating academic adjustments, cultural identity questions, and stress management. I draw from Dialectical Behavior Therapy (DBT) and narrative therapy to focus on personal strengths and emotional resilience.",
    specialties: ['Stress', 'Identity', 'Academic load'],
    languages: ['English', 'Tamil', 'Telugu'],
    availableToday: true,
    online: true,
    status: 'Available',
    schedule: ['1:00 PM', '2:30 PM', '4:00 PM'],
    whyConnect: 'You are navigating cultural expectations, stress management, or identity questions.'
  },
  {
    id: 'david-kalu',
    name: 'Dr. David Kalu',
    credentials: 'Licensed Clinical Psychologist',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200',
    introduction: "Hi, I specialize in panic attacks, trauma recovery, and building emotional grounding tools for students.",
    fullBio: "With over 10 years in clinical hospital settings and student counseling, I focus on evidence-based Somatic Experiencing and CBT to help young adults process severe stress and panic disorders.",
    specialties: ['Trauma', 'Panic attacks', 'Grounding techniques'],
    languages: ['English', 'Urdu'],
    availableToday: false,
    online: false,
    status: 'pending_approval',
    schedule: ['11:00 AM', '3:00 PM', '6:00 PM'],
    whyConnect: 'You need guidance navigating anxiety spikes or traumatic events.',
    licenseNumber: 'PSY-CA-994821',
    email: 'dr.kalu@havenmind.org',
    appliedAt: 'Today at 2:15 PM'
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    credentials: 'Licensed Mental Health Counselor',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200',
    introduction: "Hello! I help students struggling with perfectionism, social anxiety, and academic burnout.",
    fullBio: "I have worked with high school and college students for 7 years, focusing on Acceptance and Commitment Therapy (ACT) to reduce chronic overwhelm and foster self-compassion.",
    specialties: ['Social anxiety', 'Burnout', 'Perfectionism'],
    languages: ['English', 'Hindi', 'Tamil'],
    availableToday: false,
    online: false,
    status: 'pending_approval',
    schedule: ['1:30 PM', '4:30 PM'],
    whyConnect: 'You feel paralyzed by perfectionism or constant social pressure.',
    licenseNumber: 'LMHC-NY-552019',
    email: 'priya.sharma@havenmind.org',
    appliedAt: 'Yesterday at 5:40 PM'
  }
];

export const INITIAL_ROOMS: Room[] = [
  // ── 1. "In the Moment" Intent-Based Spaces ──
  {
    id: 'listen-space',
    name: 'I need someone to listen',
    category: 'intent',
    spaceType: 'intent',
    description: 'A dedicated space when you want to be heard without unsolicited advice. Empathetic listeners only.',
    guidelines: 'No advice unless asked. Validate feelings and offer gentle presence.',
    activeMembers: 142,
    talkingNow: 16,
    moderatorName: 'Alex (Support Volunteer)',
    moderatorAvailable: true,
    status: 'Active'
  },
  {
    id: 'lonely-space',
    name: 'I’m feeling lonely',
    category: 'intent',
    spaceType: 'intent',
    description: 'Low-pressure presence for when you feel disconnected and just want quiet company.',
    guidelines: 'Casual, warm, and zero pressure to be performative.',
    activeMembers: 89,
    talkingNow: 9,
    moderatorName: 'Sarah (Trained Mod)',
    moderatorAvailable: true,
    status: 'Active'
  },
  {
    id: 'academic-stress',
    name: 'Academic & school pressure',
    category: 'school',
    spaceType: 'intent',
    description: 'Talk through homework overload, exam anxiety, and heavy expectations with peers who get it.',
    guidelines: 'Share grounding techniques and vent without shame.',
    activeMembers: 164,
    talkingNow: 22,
    moderatorName: 'Alex (Support Volunteer)',
    moderatorAvailable: true,
    status: 'Active'
  },
  {
    id: 'motivation-space',
    name: 'I need motivation & focus',
    category: 'intent',
    spaceType: 'intent',
    description: 'Gentle co-working and getting unstuck. Celebrate tiny wins and progress over perfection.',
    guidelines: 'Post your one next small step and check in when done.',
    activeMembers: 115,
    talkingNow: 14,
    moderatorName: 'Emma (Peer Mentor)',
    moderatorAvailable: false,
    status: 'Active'
  },
  {
    id: 'family-dynamics',
    name: 'Family dynamics & home life',
    category: 'family',
    spaceType: 'intent',
    description: 'Navigating boundaries, difficult households, parent expectations, and sibling relationships.',
    guidelines: 'Confidentiality and non-judgmental validation.',
    activeMembers: 76,
    talkingNow: 5,
    moderatorName: 'Dr. Maya Patel',
    moderatorAvailable: true,
    status: 'Active'
  },
  {
    id: 'general-venting',
    name: 'General venting & grounding',
    category: 'general',
    spaceType: 'intent',
    description: 'Safe emotional release for when you just need to get things off your chest.',
    guidelines: 'Be respectful, use content warnings where helpful.',
    activeMembers: 130,
    talkingNow: 18,
    moderatorName: 'Sarah (Trained Mod)',
    moderatorAvailable: true,
    status: 'Active'
  },

  // ── 2. Moderated Growth Circles ──
  {
    id: 'circle-sleep',
    name: 'Circle: Sleep & Evening Reset',
    category: 'circle',
    spaceType: 'circle',
    description: 'Weekly check-ins, wind-down routines, and overcoming late-night racing thoughts.',
    guidelines: 'Guided by sleep hygiene specialists and peer supporters.',
    activeMembers: 98,
    talkingNow: 7,
    moderatorName: 'Dr. Maya Patel',
    moderatorAvailable: true,
    status: 'Active'
  },
  {
    id: 'circle-stress',
    name: 'Circle: De-stress & Nervous System',
    category: 'circle',
    spaceType: 'circle',
    description: 'Micro-grounding practices, physiological sighs, and sensory reset techniques.',
    guidelines: 'Practice quick 2-minute resets together.',
    activeMembers: 155,
    talkingNow: 19,
    moderatorName: 'Alex (Support Volunteer)',
    moderatorAvailable: true,
    status: 'Active'
  },
  {
    id: 'circle-focus',
    name: 'Circle: Focus & Deep Work Habitats',
    category: 'circle',
    spaceType: 'circle',
    description: 'Body doubling and gentle structure for ADHD, task paralysis, and studying.',
    guidelines: '25-minute quiet focus intervals with 5-minute chat breaks.',
    activeMembers: 120,
    talkingNow: 11,
    moderatorName: 'Emma (Peer Mentor)',
    moderatorAvailable: false,
    status: 'Active'
  },
  {
    id: 'circle-growth',
    name: 'Circle: Boundaries & Self-Worth',
    category: 'circle',
    spaceType: 'circle',
    description: 'Navigating people-pleasing, speaking up for yourself, and taking days off without guilt.',
    guidelines: 'Focus on self-compassion and small boundary steps.',
    activeMembers: 84,
    talkingNow: 6,
    moderatorName: 'Sarah (Trained Mod)',
    moderatorAvailable: true,
    status: 'Active'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    roomId: 'school-pressure',
    sender: { name: 'Jordan', isYou: false, role: 'user' },
    content: "I sat at my desk for 5 hours yesterday and got barely anything done. I'm just so tired.",
    timestamp: "1:42 PM"
  },
  {
    id: 'm2',
    roomId: 'school-pressure',
    sender: { name: 'Sam', isYou: true, role: 'user' },
    content: "Honestly, same. It feels like every teacher is acting like their class is the only one we have.",
    timestamp: "1:43 PM"
  },
  {
    id: 'm3',
    roomId: 'school-pressure',
    sender: { name: 'Taylor', isYou: false, role: 'user' },
    content: "Have you guys tried setting a stop time at night? I started stopping all schoolwork at 9 PM and it helps a bit.",
    timestamp: "1:45 PM"
  },
  {
    id: 'm4',
    roomId: 'school-pressure',
    sender: { name: 'Alex (Support Volunteer)', isYou: false, role: 'volunteer' },
    content: "That sounds like a really healthy boundary, Taylor. Sam, Jordan—how would it feel to try setting a strict end time tonight?",
    timestamp: "1:46 PM"
  },
  {
    id: 'm5',
    roomId: 'friendships',
    sender: { name: 'Taylor', isYou: false, role: 'user' },
    content: "Does anyone else feel like their friends are starting to drift away? It's like they have a group chat without me.",
    timestamp: "1:48 PM"
  },
  {
    id: 'm6',
    roomId: 'friendships',
    sender: { name: 'Sam', isYou: true, role: 'user' },
    content: "Yeah, I completely get that. I saw some pictures of my friends hanging out on social media last weekend and I wasn't even invited.",
    timestamp: "1:49 PM"
  },
  {
    id: 'm7',
    roomId: 'friendships',
    sender: { name: 'Riley', isYou: false, role: 'user' },
    content: "That is the absolute worst feeling. I am so sorry Sam. It makes you feel like you are invisible.",
    timestamp: "1:50 PM"
  },
  {
    id: 'm8',
    roomId: 'friendships',
    sender: { name: 'Alex (Support Volunteer)', isYou: false, role: 'volunteer' },
    content: "That takes a lot of courage, Sam. Confronting that feeling of exclusion is really tough. How are you holding up now?",
    timestamp: "1:52 PM"
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Sam',
  avatar: 'S',
  ageRange: '15–17',
  school: 'Oak Creek High School',
  grade: '11th Grade',
  bio: 'Just taking things one day at a time.',
  mood: undefined,
  theme: 'light',
  palette: 'haven',
  joinedRooms: ['school-pressure', 'friendships'],
  savedTherapists: ['maya-patel'],
  upcomingSessions: [],
  habits: [
    {
      id: 'habit_1',
      name: 'Daily Exercise',
      category: 'Exercise',
      description: 'Move for at least 30 minutes (walk, run, stretch).',
      isCompletedToday: false,
      history: { '2026-08-20': true, '2026-08-19': false },
      shareWithTherapist: true
    },
    {
      id: 'habit_2',
      name: '8 Hours Sleep',
      category: 'Sleep',
      description: 'Get at least 8 hours of restful sleep overnight.',
      isCompletedToday: true,
      history: { '2026-08-20': true, '2026-08-19': true },
      shareWithTherapist: true
    },
    {
      id: 'habit_3',
      name: 'Write in Personal Journal',
      category: 'Journal',
      description: 'Log thoughts or vent in a journal entry.',
      isCompletedToday: false,
      history: { '2026-08-20': false, '2026-08-19': true },
      shareWithTherapist: false
    },
    {
      id: 'habit_4',
      name: 'Breathing Exercise',
      category: 'Mindfulness',
      description: 'Complete 3 box breathing cycles to ground yourself.',
      isCompletedToday: true,
      history: { '2026-08-20': true, '2026-08-19': false },
      shareWithTherapist: true
    }
  ],
  diaryEntries: [
    {
      id: 'diary_1',
      date: '2026-08-20',
      mood: 'Anxious',
      text: 'Had a really overwhelming day at school. The exam results came back and I didn\'t do as well as I hoped. Feeling pretty down about it.',
      shareWithTherapist: true
    },
    {
      id: 'diary_2',
      date: '2026-08-19',
      mood: 'Balanced',
      text: 'Not a bad day overall. Hung out with a couple of friends after school which helped.',
      shareWithTherapist: false
    }
  ],
  communicationLogs: [
    {
      id: 'comm_1',
      type: 'video_session',
      title: 'Therapy Check-in Call',
      senderOrWith: 'Dr. Maya Patel',
      summary: 'Bi-weekly cognitive coping review and exam stress mitigation.',
      timestamp: 'Yesterday, 3:30 PM',
      status: 'Completed',
      duration: '45 mins'
    },
    {
      id: 'comm_2',
      type: 'message',
      title: 'Support Volunteer Follow-up',
      senderOrWith: 'Alex (Support Volunteer)',
      summary: 'Follow-up regarding feelings of exclusion discussed in the Friendships community room.',
      timestamp: 'Aug 20, 2:15 PM',
      status: 'Delivered'
    },
    {
      id: 'comm_3',
      type: 'crisis_call',
      title: 'Inbound 988 Lifeline Call',
      senderOrWith: '988 Suicide & Crisis Lifeline',
      summary: 'Patient initiated crisis helpline call for acute panic symptoms.',
      timestamp: 'Aug 17, 10:45 PM',
      status: 'Completed',
      duration: '18 mins'
    }
  ],
  clinicalNotes: [
    {
      id: 'note_1',
      therapistName: 'Dr. Maya Patel',
      date: 'Aug 20, 2026',
      content: 'Patient reports heightened anxiety surrounding upcoming midterms. Practicing box breathing and recommended daily sleep tracking.'
    }
  ],
  checkIns: [
    {
      id: 'chk_1',
      date: '2026-08-20',
      stress: 'high',
      energy: 'drained',
      sleep: 'restless',
      connection: 'isolated',
      smallActionDone: 'Organized desk surface for 5 minutes',
      timestamp: 'Yesterday, 8:30 PM'
    },
    {
      id: 'chk_2',
      date: '2026-08-19',
      stress: 'moderate',
      energy: 'moderate',
      sleep: 'fair',
      connection: 'neutral',
      smallActionDone: '3-minute physiological sigh breathing',
      timestamp: 'Aug 19, 9:15 PM'
    },
    {
      id: 'chk_3',
      date: '2026-08-18',
      stress: 'low',
      energy: 'energized',
      sleep: 'deep',
      connection: 'connected',
      smallActionDone: '15-minute neighborhood walk',
      timestamp: 'Aug 18, 7:45 PM'
    }
  ],
  privacyMode: 'local_only',
  reducedMotion: false,
  quietHours: true,
  onboarded: true,
  primaryGoals: ['Managing stress', 'Understanding my thoughts', 'Building healthier routines'],
  timeline: [
    {
      id: 'tl_1',
      date: '22 AUG',
      time: '10:45',
      title: 'Completed a Haven Moment',
      description: '2-minute Physiological Sigh reset for racing thoughts.',
      type: 'moment'
    },
    {
      id: 'tl_2',
      date: '22 AUG',
      time: '10:42',
      title: 'Daily check-in recorded',
      description: 'Stress: Moderate • Energy: Steady.',
      type: 'checkin'
    },
    {
      id: 'tl_3',
      date: '20 AUG',
      time: '21:30',
      title: 'Reframed a difficult thought',
      description: 'CBT Exercise: Identified Catastrophizing and generated a balanced reframe.',
      type: 'cbt'
    },
    {
      id: 'tl_4',
      date: '18 AUG',
      time: '22:15',
      title: 'Maintained 4-day sleep routine',
      description: 'Logged 8 hours restful sleep habit completion.',
      type: 'habit'
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      category: 'personal',
      title: 'Evening Reflection',
      message: 'Your evening reflection is still open. Take two minutes before resting.',
      timestamp: 'Yesterday',
      read: false,
      actionLink: '/habits'
    },
    {
      id: 'notif_2',
      category: 'community',
      title: 'Hope Board Presence',
      message: 'Someone left a supportive presence on your Hope Board note.',
      timestamp: '2 hours ago',
      read: false,
      actionLink: '/hope-board'
    },
    {
      id: 'notif_3',
      category: 'appointment',
      title: 'Upcoming Consultation',
      message: 'Google Meet telehealth session with Dr. Maya Patel tomorrow at 3:30 PM.',
      timestamp: '5 hours ago',
      read: true,
      actionLink: '/therapists'
    },
    {
      id: 'notif_4',
      category: 'system',
      title: 'Data Sovereignty Notice',
      message: 'Local-Only Mode is active. All reflections remain strictly on this device.',
      timestamp: '3 days ago',
      read: true,
      actionLink: '/profile'
    }
  ]
};

export const INITIAL_FLAGGED_ITEMS: FlaggedItem[] = [
  {
    id: 'flag1',
    messageId: 'flag_msg1',
    messageContent: 'You are being completely stupid about this, just get over it.',
    senderName: 'User_982',
    roomName: 'General Venting',
    timestamp: '10 min ago',
    reason: 'Hostile/Harassment tone',
    status: 'pending'
  },
  {
    id: 'flag2',
    messageId: 'flag_msg2',
    messageContent: 'I do not see the point in trying anymore, everything is going wrong.',
    senderName: 'User_410',
    roomName: 'Stress & Anxiety',
    timestamp: '14 min ago',
    reason: 'Self-harm risk warning flag',
    status: 'pending'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act1',
    type: 'join',
    description: 'Sam joined the "Friendships & Connections" chat room',
    timestamp: 'Just now'
  },
  {
    id: 'act2',
    type: 'session',
    description: 'Session booked with Dr. Maya Patel for tomorrow at 2:00 PM',
    timestamp: '5 min ago'
  },
  {
    id: 'act3',
    type: 'moderator',
    description: 'Sarah Jenkins flagged a message in "School & Pressure"',
    timestamp: '15 min ago'
  },
  {
    id: 'act4',
    type: 'availability',
    description: 'Emma Zhao marked herself available for instant messaging',
    timestamp: '1 hour ago'
  }
];

export const INITIAL_STATS: DashboardStats = {
  therapistsOnline: 12,
  therapistsOnlineChange: '+3 in the last hour',
  activeConversations: 27,
  communityRoomsActive: 8,
  usersNeedingSupport: 5
};

export const INITIAL_GUIDES: Guide[] = [
  {
    id: 'school-pressure',
    title: 'How to handle school pressure',
    category: 'School',
    readTime: '5 min read',
    summary: 'Learn simple ways to balance homework, exam anxiety, and parental expectations.',
    content: `School pressure can feel incredibly heavy, but you can build boundaries to support yourself.

1. **Break it down:** When looking at a massive project or study list, write down tiny, bite-sized tasks. Completing one small thing (e.g. reading 2 pages) builds momentum.
2. **The Pomodoro Technique:** Work for 25 minutes, then take a mandatory 5-minute break. Walk away from your desk, stretch, or drink water. This keeps your brain fresh.
3. **Establish a stop time:** Set a strict boundary for when schoolwork ends each night (e.g. 8:30 PM). Your brain needs downtime to process information and rest.
4. **Communicate expectations:** If your parents or teachers are adding pressure, try expressing how you feel: "I want to do well, but I'm feeling overwhelmed. Can we look at my schedule together?"`,
    status: 'published'
  },
  {
    id: 'anxiety-grounding',
    title: 'Grounding yourself when anxious',
    category: 'Anxiety',
    readTime: '3 min read',
    summary: 'Simple techniques to calm a racing mind and reset when anxiety strikes.',
    content: `Anxiety triggers our "fight or flight" response. Grounding exercises bring your focus back to the physical world, calming your nervous system.

1. **The 5-4-3-2-1 Technique:** Look around you and identify:
   * **5** things you can see (a chair, a pen, a plant).
   * **4** things you can feel (the texture of your shirt, the floor beneath your feet).
   * **3** things you can hear (traffic outside, a ticking clock).
   * **2** things you can smell.
   * **1** thing you can taste.
2. **Box Breathing:**
   * Inhale for 4 seconds.
   * Hold your breath for 4 seconds.
   * Exhale for 4 seconds.
   * Hold empty for 4 seconds.
   * Repeat 3-4 times. This physically slows down your heart rate.`,
    status: 'published'
  },
  {
    id: 'family-boundaries',
    title: 'Communicating with family',
    category: 'Family',
    readTime: '6 min read',
    summary: 'Tips on sharing your mental health needs with parents and siblings clearly.',
    content: `Sharing what is happening in your mind with family members can feel intimidating. Here are some strategies:

1. **Write it out first:** If talking face-to-face feels too stressful, try writing a letter or text: "Hey, I've been going through a rough patch lately and would really appreciate your support."
2. **Choose the right timing:** Avoid starting heavy conversations during stressful moments (like rushing out the door in the morning or during dinner). Pick a calm weekend afternoon.
3. **Use "I" statements:** Instead of saying "You never listen to me," try "I feel unheard when I try to talk about my stress, and it makes me feel lonely."
4. **Suggest small steps:** Let them know how they can help: "I don't need answers right now, I just need you to listen for a few minutes."`,
    status: 'published'
  },
  {
    id: 'making-friends',
    title: 'Navigating changing friendships',
    category: 'Friendships',
    readTime: '4 min read',
    summary: 'How to manage growing apart, handling group chats, and making new friends.',
    content: `Friendships shift a lot during our teenage years. It's normal, but it can be painful.

1. **Acknowledge the shift:** If a friend group is drifting, it doesn't mean you did something wrong. People develop new interests.
2. **Check your digital boundaries:** Group chats can become sources of drama or anxiety. It is completely okay to mute notifications or take a 24-hour break from social media.
3. **Start small with new connections:** Join school clubs, art classes, or sports teams where people share your interests. Ask casual questions: "Hey, did you understand that homework assignment?"
4. **Be kind to yourself:** Building deep connections takes time. Focus on quality rather than quality of friends.`,
    status: 'published'
  },
  {
    id: 'sleep-hygiene',
    title: 'Unlocking better sleep habits',
    category: 'Sleep',
    readTime: '5 min read',
    summary: 'Practical tips to calm your brain before bed and sleep more deeply.',
    content: `Sleep is critical for emotional resilience. If you're tossing and turning, try these steps:

1. **The 30-minute buffer:** Turn off screens (phone, computer, TV) 30 minutes before trying to sleep. The blue light tricks your brain into thinking it's daytime.
2. **Separate sleep from study:** Try not to do homework in your bed. If you study in bed, your brain associates that space with stress instead of relaxation. Use a desk or floor space instead.
3. **Bedtime ritual:** Listen to calming music, read a physical book, or write in a journal.
4. **Write down your worries:** If your mind races when your head hits the pillow, keep a notepad nearby. Write down your to-do list for tomorrow, then tell yourself: "It is on paper, I can deal with it tomorrow."`,
    status: 'published'
  },
  {
    id: 'coping-loneliness',
    title: 'Understanding & coping with loneliness',
    category: 'Loneliness',
    readTime: '4 min read',
    summary: 'Recognizing why we feel lonely and how to reconnect with yourself and others.',
    content: `You can be in a room full of people and still feel lonely. Loneliness is about connection quality, not just numbers.

1. **Validating the feeling:** Loneliness is a natural human signal telling us we need connection, just like hunger tells us we need food.
2. **Reconnect with things you love:** Spend time drawing, playing music, gaming, or writing. Engaging in hobbies can help you feel grounded.
3. **Find community groups:** Look for online or school communities focused on things you care about (such as anime, gaming, environmentalism, or creative writing).
4. **Take small social risks:** Send a message to someone you haven't talked to in a while: "Hey, saw this and thought of you, hope you are doing well!"`,
    status: 'published'
  }
];

// Helper for local storage simulation
const getStored = <T>(key: string, fallback: T): T => {
  const stored = localStorage.getItem(`haven_${key}`);
  return stored ? JSON.parse(stored) : fallback;
};

const setStored = <T>(key: string, value: T): void => {
  localStorage.setItem(`haven_${key}`, JSON.stringify(value));
};

export const getMockDatabase = () => {
  return {
    getTherapists: () => getStored<Therapist[]>('therapists', INITIAL_THERAPISTS),
    setTherapists: (data: Therapist[]) => setStored('therapists', data),

    getRooms: () => getStored<Room[]>('rooms', INITIAL_ROOMS),
    setRooms: (data: Room[]) => setStored('rooms', data),

    getMessages: () => getStored<Message[]>('messages', INITIAL_MESSAGES),
    setMessages: (data: Message[]) => setStored('messages', data),

    getUserProfile: () => getStored<UserProfile>('user_profile', INITIAL_USER_PROFILE),
    setUserProfile: (data: UserProfile) => setStored('user_profile', data),

    getFlaggedItems: () => getStored<FlaggedItem[]>('flagged_items', INITIAL_FLAGGED_ITEMS),
    setFlaggedItems: (data: FlaggedItem[]) => setStored('flagged_items', data),

    getActivityLogs: () => getStored<ActivityLog[]>('activity_logs', INITIAL_ACTIVITY_LOGS),
    setActivityLogs: (data: ActivityLog[]) => setStored('activity_logs', data),

    getStats: () => getStored<DashboardStats>('stats', INITIAL_STATS),
    setStats: (data: DashboardStats) => setStored('stats', data),

    getGuides: () => getStored<Guide[]>('guides', INITIAL_GUIDES),
    setGuides: (data: Guide[]) => setStored('guides', data),
    
    resetDatabase: () => {
      localStorage.removeItem('haven_therapists');
      localStorage.removeItem('haven_rooms');
      localStorage.removeItem('haven_messages');
      localStorage.removeItem('haven_user_profile');
      localStorage.removeItem('haven_flagged_items');
      localStorage.removeItem('haven_activity_logs');
      localStorage.removeItem('haven_stats');
      localStorage.removeItem('haven_guides');
    }
  };
};
