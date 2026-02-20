export type ProblemStatement = {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  prompt: string
}

export const PROBLEM_STATEMENTS: ProblemStatement[] = [
  {
    id: 'ps1',
    title: 'Campus Navigator & Accessibility Map',
    difficulty: 'Medium',
    tags: ['Maps', 'UX', 'Accessibility'],
    prompt:
      'Build a web app that helps users navigate the KDKCE campus with accessible routes, landmarks, and quick directions.'
  },
  {
    id: 'ps2',
    title: 'Smart Canteen Queue & Pre-Order',
    difficulty: 'Hard',
    tags: ['Realtime', 'Payments', 'Ops'],
    prompt:
      'Create a system to reduce canteen crowding: menu, pre-order time slots, and live queue estimates.'
  },
  {
    id: 'ps3',
    title: 'Placement Prep Sprint Tracker',
    difficulty: 'Easy',
    tags: ['Productivity', 'Tracking'],
    prompt:
      'Design a tracker for DSA/aptitude progress with streaks, daily goals, and shareable progress cards.'
  },
  {
    id: 'ps4',
    title: 'Lost & Found — Verified Claims',
    difficulty: 'Medium',
    tags: ['Community', 'Moderation'],
    prompt:
      'Build a lost-and-found portal with item listings, claim verification questions, and basic admin moderation.'
  },
  {
    id: 'ps5',
    title: 'Energy Usage Dashboard for Labs',
    difficulty: 'Hard',
    tags: ['IoT', 'Analytics', 'Sustainability'],
    prompt:
      'Create a dashboard that visualizes lab energy usage (mock data ok), alerts on spikes, and weekly reports.'
  },
  {
    id: 'ps6',
    title: 'Event Discovery & RSVP for Clubs',
    difficulty: 'Easy',
    tags: ['Events', 'Community'],
    prompt:
      'Build a club events hub with filters, RSVP, calendar export, and organizer announcements.'
  },
  {
    id: 'ps7',
    title: 'AI Study Buddy (Offline-first Notes)',
    difficulty: 'Hard',
    tags: ['AI', 'Notes', 'Offline'],
    prompt:
      'Create an offline-first notes app that can summarize notes and generate quizzes (mock AI allowed).' 
  },
  {
    id: 'ps8',
    title: 'Hostel Maintenance Ticketing',
    difficulty: 'Medium',
    tags: ['Workflow', 'Notifications'],
    prompt:
      'Build a ticketing system for hostel issues with categories, status updates, and SLA-style timelines.'
  },
  {
    id: 'ps9',
    title: 'Mentor Matchmaking for Freshers',
    difficulty: 'Medium',
    tags: ['Matching', 'Profiles'],
    prompt:
      'Match mentors and mentees based on interests/skills; include profiles, preferences, and intro messages.'
  },
  {
    id: 'ps10',
    title: 'Micro-Internship Marketplace',
    difficulty: 'Hard',
    tags: ['Marketplace', 'Workflow'],
    prompt:
      'Create a marketplace for short campus gigs: posting, applying, review flow, and basic reputation.'
  },
  {
    id: 'ps11',
    title: 'Code Review Roulette',
    difficulty: 'Easy',
    tags: ['GitHub', 'Collaboration'],
    prompt:
      'Build a tool that pairs teams for quick peer reviews using repository links and a timed checklist.'
  },
  {
    id: 'ps12',
    title: 'Disaster Readiness Checklist (Campus)',
    difficulty: 'Easy',
    tags: ['Safety', 'Checklists'],
    prompt:
      'Create an interactive checklist for emergency preparedness with printable summaries and reminders.'
  }
]

export const EVENT = {
  name: 'HACKTHONIX 2.0',
  org: 'Coding Club, K.D.K. College of Engineering, Nagpur',
  accreditation: '(An Autonomous Institute | Accredited by NAAC and NBA)',
  dateISO: '2026-03-10T07:00:00+05:30',
  reportingTime: '7:00 AM',
  venue: 'KDKCE (Block-B), Dept. of CSE',
  sprintHours: 10,
  earlyBirdFee: 110,
  regularFee: 150,
  earlyBirdEndsISO: '2026-02-28T23:59:59+05:30',
  prizes: [
    { label: 'Winner', amount: 10000 },
    { label: '2nd Runner Up', amount: 7500 },
    { label: '3rd Runner Up', amount: 5000 }
  ],
  links: {
    website: 'http://www.kdkce.edu.in',
    instagram: 'https://instagram.com/codingclub_kdk'
  }
}

export const JUDGING = [
  {
    key: 'commitFrequency',
    title: 'Commit Frequency',
    desc: 'Consistency of work and activity pattern (tracked via GitHub).'
  },
  {
    key: 'codeQuality',
    title: 'Code Quality',
    desc: 'Structure, readability, and best practices.'
  },
  {
    key: 'problemRelevance',
    title: 'Problem Relevance',
    desc: 'Accuracy of the solution to the problem statement.'
  },
  {
    key: 'finalSubmission',
    title: 'Final Submission',
    desc: 'Completeness and innovation of the prototype.'
  }
] as const
