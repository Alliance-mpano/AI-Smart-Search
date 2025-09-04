'use client'

import { useEffect, useMemo, useState } from 'react'
import TalentCard from '@/components/TalentCard'

type Experience = { company: string; title: string; years: number }
type Education = { EducationLevel: string; EducationProgram: string }
type Skill = { Skill: string; Proficiency: string }
type Talent = {
  Id: number
  Name: string
  Biography: string
  Language: string[]
  Skills: Skill[]
  Experiences: Experience[]
  EducationProgram: Education[]
  YearOfExperience: number
}

export default function TalentsPage() {
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 12
  const [allTalents, setAllTalents] = useState<Talent[]>([])
  const [filteredIds, setFilteredIds] = useState<number[] | null>(null)
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch data when page changes
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch(
          '/api/talents?' +
            new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
        )
        const { data, count } = await res.json()
        if (!mounted) return
        setAllTalents(data)
        setTotal(count)
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [page])

  // AI-powered search (kept simple)
  async function handleSearch() {
    setPage(1)
    if (!query.trim()) {
      setFilteredIds(null)
      return
    }
    try {
      setIsSearching(true)
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const { ids } = await res.json()
      setFilteredIds(ids)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSearching(false)
    }
  }

  // What to show
  const talentsToShow = useMemo(() => {
    if (Array.isArray(filteredIds)) {
      return allTalents.filter((t) => filteredIds.includes(t.Id))
    }
    return allTalents
  }, [allTalents, filteredIds])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const showingTotal = filteredIds ? talentsToShow.length : total
  const startIndex = filteredIds ? (showingTotal ? 1 : 0) : (page - 1) * pageSize + (allTalents.length ? 1 : 0)
  const endIndex = filteredIds ? showingTotal : Math.min(page * pageSize, total)

  return (
    <div className="mx-auto w-[95%] max-w-screen-2xl p-4 md:p-6">
      {/* Header */}
      <header className="mb-5">
        <h1 className="text-2xl font-semibold">SevenX Rwanda Ltd — Talent Directory</h1>
        <p className="text-sm text-gray-600">Search by skills, titles, or languages.</p>
      </header>

      {/* Search row */}
      <div className="mb-5 flex gap-2">
        <input
          type="text"
          className="flex-1 h-10 rounded border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. React, Backend, Kinyarwanda"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="h-10 rounded bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isSearching ? 'Searching…' : 'Search'}
        </button>
        {filteredIds && (
          <button
            onClick={() => setFilteredIds(null)}
            className="h-10 rounded border px-3 text-sm hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      {/* Info line */}
      <div className="mb-4 text-sm text-gray-600">
        {isLoading ? 'Loading…' : `Showing ${startIndex || 0}–${endIndex || 0} of ${showingTotal}`}
      </div>

      {/* Grid */}
      {isLoading ? (
        <p className="text-gray-600">Loading…</p>
      ) : talentsToShow.length === 0 ? (
        <p className="text-gray-600">No talents found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {talentsToShow.map((talent) => (
              <div key={talent.Id} className="rounded-xl border bg-white p-3 shadow-sm hover:shadow">
                <TalentCard t={talent} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {!filteredIds && (
            <div className="mt-6 flex items-center justify-between">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Prev
              </button>

              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
