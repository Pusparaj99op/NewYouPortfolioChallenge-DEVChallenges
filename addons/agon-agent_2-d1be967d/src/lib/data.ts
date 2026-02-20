export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type ProblemStatement = {
  id: string
  title: string
  difficulty: Difficulty
  tags: string[]
  summary: string
}

export const problemStatements: ProblemStatement[] = [
  {
    id: 'PS-01',
    title: 'Smart Campus Navigator',
    difficulty: 'Medium',
    tags: ['Maps', 'UX', 'Accessibility'],
    summary: 'Indoor/outdoor wayfinding for KDKCE with accessible routes and live notices.',
  },
  {
    id: 'PS-02',
    title: 'Attendance Insights Dashboard',
    difficulty: 'Easy',
    tags: ['Analytics', 'Charts', 'CSV'],
    summary: 'Upload attendance sheets and generate trends, alerts, and summaries.',
  },
  {
    id: 'PS-03',
    title: 'Placement Prep Buddy',
    difficulty: 'Medium',
    tags: ['DSA', 'Planner', 'Reminders'],
    summary: 'A guided prep plan with daily goals, revision cycles, and progress tracking.',
  },
  {
    id: 'PS-04',
    title: 'Energy Saver for Labs',
    difficulty: 'Hard',
    tags: ['IoT', 'Optimization', 'Simulation'],
    summary: 'Simulate lab schedules and propose energy-saving automation policies.',
  },
  {
    id: 'PS-05',
    title: 'Hostel Complaint & Resolution',
    difficulty: 'Easy',
    tags: ['Workflow', 'Forms', 'Notifications'],
    summary: 'Complaint submission, triage, and resolution tracking with SLA timers.',
  },
  {
    id: 'PS-06',
    title: 'Lost & Found Portal',
    difficulty: 'Easy',
    tags: ['Marketplace', 'Search', 'Moderation'],
    summary: 'Post found items, claim verification, and searchable listings.',
  },
  {
    id: 'PS-07',
    title: 'Micro-Internship Board',
    difficulty: 'Medium',
    tags: ['Jobs', 'Matching', 'Profiles'],
    summary: 'Short campus projects posted by faculty/industry with applicant matching.',
  },
  {
    id: 'PS-08',
    title: 'Smart Canteen Queue',
    difficulty: 'Medium',
    tags: ['Realtime', 'QR', 'Payments'],
    summary: 'Order-ahead and pickup slots to reduce queues during peak hours.',
  },
  {
    id: 'PS-09',
    title: 'Event Volunteer Manager',
    difficulty: 'Easy',
    tags: ['Scheduling', 'Roles', 'Checklists'],
    summary: 'Assign roles, shifts, and checklists; export summaries for coordinators.',
  },
  {
    id: 'PS-10',
    title: 'AI Notes Summarizer',
    difficulty: 'Hard',
    tags: ['NLP', 'Docs', 'Search'],
    summary: 'Summarize and semantically search class notes with citations.',
  },
  {
    id: 'PS-11',
    title: 'Exam Hall Seating Optimizer',
    difficulty: 'Hard',
    tags: ['Optimization', 'Constraints', 'Export'],
    summary: 'Generate seating plans with constraints; export to PDF/CSV.',
  },
  {
    id: 'PS-12',
    title: 'Community Skill Swap',
    difficulty: 'Medium',
    tags: ['Social', 'Matching', 'Reputation'],
    summary: 'Match students for peer-to-peer skill sessions with ratings and slots.',
  },
]

export type EventInfo = {
  date: string
  reportingTime: string
  venue: string
  audience: string
  sprintHours: number
  lockMinutes: number
  commitPollMinutes: number
}

export const eventInfo: EventInfo = {
  date: '10 March 2026',
  reportingTime: '7:00 AM',
  venue: 'KDKCE (Block-B), Dept. of CSE',
  audience: 'College students, professionals, and coding enthusiasts',
  sprintHours: 10,
  lockMinutes: 10,
  commitPollMinutes: 5,
}

export type Prize = { label: string; amount: number }

export const prizes: Prize[] = [
  { label: 'Winner', amount: 10000 },
  { label: '2nd Runner Up', amount: 7500 },
  { label: '3rd Runner Up', amount: 5000 },
]

export type JudgeCriteria = {
  key: 'commitFrequency' | 'codeQuality' | 'problemRelevance' | 'finalSubmission'
  label: string
  description: string
  max: number
}

export const judgeCriteria: JudgeCriteria[] = [
  {
    key: 'commitFrequency',
    label: 'Commit Frequency',
    description: 'Consistency of work and activity pattern (tracked via GitHub).',
    max: 25,
  },
  {
    key: 'codeQuality',
    label: 'Code Quality',
    description: 'Structure, readability, and best practices.',
    max: 25,
  },
  {
    key: 'problemRelevance',
    label: 'Problem Relevance',
    description: 'Accuracy of the solution to the problem statement.',
    max: 25,
  },
  {
    key: 'finalSubmission',
    label: 'Final Submission',
    description: 'Completeness and innovation of the prototype.',
    max: 25,
  },
]
