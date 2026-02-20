import type { Commit } from './storage'

export function parseRepoUrl(repoUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(repoUrl)
    if (!/github\.com$/i.test(url.hostname)) return null
    const parts = url.pathname.split('/').filter(Boolean)
    if (parts.length < 2) return null
    const owner = parts[0]
    const repo = parts[1].replace(/\.git$/i, '')
    return { owner, repo }
  } catch {
    return null
  }
}

export async function fetchCommits(repoUrl: string, perPage = 20): Promise<Commit[]> {
  const parsed = parseRepoUrl(repoUrl)
  if (!parsed) throw new Error('Invalid GitHub repository URL')

  const endpoint = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=${perPage}`
  const res = await fetch(endpoint, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub API error (${res.status}): ${text.slice(0, 160)}`)
  }

  const data = (await res.json()) as any[]
  return data.map((c) => ({
    sha: String(c.sha).slice(0, 7),
    message: String(c.commit?.message ?? '').split('\n')[0],
    author: String(c.commit?.author?.name ?? c.author?.login ?? 'Unknown'),
    date: String(c.commit?.author?.date ?? ''),
  }))
}
