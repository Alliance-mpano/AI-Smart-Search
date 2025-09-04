import * as React from "react"

// Match your existing shape
type Experience = { company: string; title: string; years: number }
type Education = { EducationLevel: string; EducationProgram: string }
type Skill = { Skill: string; Proficiency?: string }
type Talent = {
  Id: number
  Name: string
  Biography?: string
  Language?: string[]
  Skills?: Skill[]
  Experiences?: Experience[]
  EducationProgram?: Education[]
  YearOfExperience?: number
}

export default function TalentCard({ t }: { t: Talent }) {
  const [expanded, setExpanded] = React.useState(false)

  const initial =
    t?.Name?.trim()?.charAt(0)?.toUpperCase() || "•"

  const profClasses = (p?: string) => {
    const v = (p || "").toLowerCase()
    if (v.includes("expert"))
      return "bg-amber-50 border-amber-200 text-amber-800"
    if (v.includes("advanced"))
      return "bg-purple-50 border-purple-200 text-purple-800"
    if (v.includes("intermediate"))
      return "bg-sky-50 border-sky-200 text-sky-800"
    return "bg-gray-50 border-gray-200 text-gray-700"
  }

  const bio = t.Biography || ""
  const shortBio = bio.length > 260 ? bio.slice(0, 260) + "…" : bio

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      {/* subtle brand accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />

      <div className="p-5">
        {/* header */}
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-indigo-600 text-white text-lg font-semibold">
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              {t.Name}
            </h3>
            <p className="text-[13px] text-gray-500">
              {t.YearOfExperience ?? 0} yr
              {(t.YearOfExperience ?? 0) === 1 ? "" : "s"} experience
            </p>
          </div>
        </div>

        {/* biography */}
        {bio && (
          <p className="mt-3 text-sm leading-6 text-gray-700">
            {expanded ? bio : shortBio}
            {bio.length > 30 && (
              <button
                onClick={() => setExpanded((s) => !s)}
                className="ml-2 text-indigo-600 underline-offset-2 hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        )}

        {/* skills */}
        {t.Skills && t.Skills.length > 0 && (
          <>
            <SectionTitle>Skills</SectionTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              {t.Skills.slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${profClasses(
                    s.Proficiency
                  )}`}
                >
                  {s.Skill}
                  {s.Proficiency ? ` (${s.Proficiency})` : ""}
                </span>
              ))}
              {t.Skills.length > 4 && (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700">
                  +{t.Skills.length - 4}
                </span>
              )}
            </div>
          </>
        )}

        {/* experience */}
        {t.Experiences && t.Experiences.length > 0 && (
          <>
            <SectionTitle>Experience</SectionTitle>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
              {t.Experiences.slice(0, 4).map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>
                    <span className="font-medium text-gray-900">{e.title}</span>{" "}
                    @ {e.company} ({e.years} yr{e.years === 1 ? "" : "s"})
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* education */}
        {t.EducationProgram && t.EducationProgram.length > 0 && (
          <>
            <SectionTitle>Education</SectionTitle>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
              {t.EducationProgram.slice(0, 2).map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <span>
                    {e.EducationLevel} in {e.EducationProgram}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* languages */}
        {t.Language && t.Language.length > 0 && (
          <>
            <SectionTitle>Languages</SectionTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              {t.Language.map((lang, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800"
                >
                  {lang}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 text-sm font-semibold text-gray-800">
      {children}
      <div className="mt-2 h-px w-full bg-gray-200" />
    </div>
  )
}
