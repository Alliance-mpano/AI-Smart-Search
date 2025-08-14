'use client'

import { useState, useEffect } from 'react'

type Experience = { company: string; title: string; years: number }
type Education = { EducationLevel: string; EducationProgram: string; }
type Skill = { Skill: string; Proficiency: string; }
type Talent = {
  Id:         number
  Name:       string
  Biography:   string
  Language: string[]
  Skills:  Skill[]
  Experiences:     Experience[]
  EducationProgram: Education[]
    YearOfExperience: number
}

export default function TalentsPage() {
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10
  const [allTalents, setAllTalents] = useState<Talent[]>([])
  const [filteredIds, setFilteredIds] = useState<number[]|null>(null)
  const [query, setQuery] = useState('')
   const [isSearching, setIsSearching] = useState(false);

  // 1) Fetch all talents once on mount
//   useEffect(() => {
//     setIsSearching(true);
//     fetch('/api/documents?' + new URLSearchParams({ page: String(page), pageSize: String(pageSize) }))
//       .then(res => res.json())
//       .then((data: Talent[]) => setAllTalents(data))
//       .catch(console.error)
//     setIsSearching(false)
//   }, [])

    useEffect(() => {
        setIsSearching(true);
        fetch('/api/documents?' + new URLSearchParams({ page: String(page), pageSize: String(pageSize) }))
        .then(res => res.json())
        .then(({data, count }) => {setAllTalents(data); setTotal(count)})
        .catch(console.error)
        setIsSearching(false)
    }, [page])
    console.log(allTalents)

  // 2) Handle AI-powered search
  async function handleSearch() {
    setPage(1)
    if (!query.trim()) {
      setFilteredIds(null)
      return
    }
    console.log('Searching for:', query);
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const { ids } = await res.json()
    console.log('IDs returned', ids);
    // Assume profiles is [{ id, ... }, …]
    setFilteredIds(ids)

  }

  // 3) Decide which talents to display
  const talentsToShow = filteredIds === null
    ? allTalents
    : allTalents.filter(t => filteredIds.includes(t.Id))

    const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Talent Directory</h1>

      <div className="flex mb-6">
        <input
          type="text"
          className="flex-1 border rounded px-4 py-2 mr-3 focus:outline-none focus:ring"
          placeholder="Search for skills, titles, etc."
          value={query}
          onChange={e => {setQuery(e.target.value); setPage(1)}}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {isSearching ? (
        <p>Loading…</p>
      ):talentsToShow.length === 0 ? (
        <p className="text-gray-500">No talents found.</p>
      ) : (
        <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {talentsToShow.map(t => (
            <div
              key={t.Id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <div className="text-xl font-semibold mb-1">{t.Name}</div>
              <div className="text-sm text-gray-600 mb-2">
                {t.Biography} 
              </div>
              <div className="mb-2">
                <span className="font-medium">Skills:</span>{' '}
                {t.Skills.map((s, i) => (
                  <span key={i} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                    {s.Skill} ({s.Proficiency})
                  </span>
                ))}
              </div>
              <div>
                <span className="font-medium">Experience:</span>
                <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                  {t.Experiences ? t.Experiences.map((e, i) => (
                    <li key={i}>
                      {e.title} @ {e.company} ({e.years} yr
                      {e.years > 1 ? 's' : ''})
                    </li>
                  )): <p>No Experiences provided</p>}
                </ul>
              </div>
                <div>
                    <span className="font-medium">Education:</span>
                    <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                    {t.EducationProgram? t.EducationProgram.map((e, i) => (
                        <li key={i}>
                        {e.EducationLevel} in {e.EducationProgram}
                        </li>
                    )): <p>No Education Background provided</p>}
                    </ul>
                </div>
                <div>
                    <span className="font-medium">Languages:</span>
                    <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                    {t.Language? t.Language.map((lang, i) => (
                        <li key={i}>
                        {lang}
                        </li>
                    )): <p> No languages provided</p>}
                    </ul>
                </div>
            </div>
          ))}
        </div>
        {/* pagination */}
          <div className="mt-6 flex justify-center items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
