const KEY = 'hackthonix2'

export type TeamMember = {
  name: string
  email: string
  contact: string
}

export type TeamProfile = {
  teamName: string
  members: TeamMember[]
}

export type SelectionState = {
  selectedProblemId: string | null
  selectedAtMs: number | null
  locked: boolean
}

export type RepoState = {
  repoUrl: string
}

export type Commit = {
  sha: string
  message: string
  author: string
  date: string
}

export type CommitState = {
  lastSyncAtMs: number | null
  commits: Commit[]
  status: 'idle' | 'syncing' | 'ok' | 'error'
  errorMessage?: string
}

export type JudgeScore = {
  commitFrequency: number
  codeQuality: number
  problemRelevance: number
  finalSubmission: number
  notes: string
}

export type AppState = {
  team: TeamProfile | null
  selection: SelectionState
  repo: RepoState | null
  commits: CommitState
  judgeScore: JudgeScore
}

export const defaultState: AppState = {
  team: null,
  selection: {
    selectedProblemId: null,
    selectedAtMs: null,
    locked: false,
  },
  repo: null,
  commits: {
    lastSyncAtMs: null,
    commits: [],
    status: 'idle',
  },
  judgeScore: {
    commitFrequency: 0,
    codeQuality: 0,
    problemRelevance: 0,
    finalSubmission: 0,
    notes: '',
  },
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as AppState
    return {
      ...defaultState,
      ...parsed,
      selection: { ...defaultState.selection, ...parsed.selection },
      commits: { ...defaultState.commits, ...parsed.commits },
      judgeScore: { ...defaultState.judgeScore, ...parsed.judgeScore },
    }
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function clearState() {
  localStorage.removeItem(KEY)
}
