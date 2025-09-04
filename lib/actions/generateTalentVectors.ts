    import 'dotenv/config'
    import { db } from '@/lib/db'
    import { sql } from 'drizzle-orm'
    const embeddingModel = openai.embedding('text-embedding-ada-002');
import { openai } from '@ai-sdk/openai'
import { user, resume, resumeLanguage, resumeSkill, education, workExperience, talentDocuments, language, talentVectors } from '@/lib/db/schema/schema';

    import { chunkText } from '../utils'
import { embed, embedMany } from 'ai'
import { uuid } from 'drizzle-orm/pg-core';
type UUID = string;
    // regenerate just one talent’s document:
    export async function generateTalentVector( talentId: UUID) {
  // 1) fetch that one talent with its skills & experience
     const [row] = await db
       .select({
         Id:   user.id,
         Name: sql<string>`
           ${user.firstName} || ' ' || ${user.lastName}
         `.mapWith(String),
     
         Biography: resume.biography,
     
         // Languages
         Language: sql<string[]>`
           (
             SELECT
               ARRAY_REMOVE(
                 ARRAY_AGG(DISTINCT ${language.name})::text[],
                 NULL::text
               )
             FROM ${resumeLanguage}
             JOIN ${language}
               ON ${language.id} = ${resumeLanguage.languageId}
             WHERE ${resumeLanguage.resumeId} = ${resume.id}
           )
         `.mapWith(v => v as string[]),
     
         // Skills + proficiency
         Skills: sql<any[]>`
           (
             SELECT
               COALESCE(
                 JSONB_AGG(obj ORDER BY obj->>'Skill'),
                 '[]'::jsonb
               )
             FROM (
               SELECT DISTINCT
                 JSONB_BUILD_OBJECT(
                   'Skill',       ${resumeSkill.skillName},
                   'Proficiency', ${resumeSkill.proficiency}
                 ) AS obj
               FROM ${resumeSkill}
               WHERE ${resumeSkill.resumeId} = ${resume.id}
             ) sub
           )
         `.mapWith(v => v as any[]),
     
         // Education programs
         EducationProgram: sql<any[]>`
           (
             SELECT
               COALESCE(
                 JSONB_AGG(obj ORDER BY obj->>'EducationLevel'),
                 '[]'::jsonb
               )
             FROM (
               SELECT DISTINCT
                 JSONB_BUILD_OBJECT(
                   'EducationLevel',   ${education.educationLevel},
                   'EducationProgram', ${education.educationProgram}
                 ) AS obj
               FROM ${education}
               WHERE ${education.resumeId} = ${resume.id}
             ) sub
           )
         `.mapWith(v => v as any[]),
     
         // Total years of experience
         YearOfExperience: sql<number>`
           COALESCE(
             (
               SELECT SUM(${workExperience.yearsOfExperience})
               FROM ${workExperience}
               WHERE ${workExperience.resumeId} = ${resume.id}
             ), 
             0
           )
         `.mapWith(Number),
     
         // Full experience details
         Experiences: sql<any[]>`
           (
             SELECT
               COALESCE(
                 JSONB_AGG(obj ORDER BY (obj->>'years')::int DESC),
                 '[]'::jsonb
               )
             FROM (
               SELECT DISTINCT
                 JSONB_BUILD_OBJECT(
                   'company', ${workExperience.organisationName},
                   'title',   ${workExperience.title},
                   'years',   ${workExperience.yearsOfExperience}
                 ) AS obj
               FROM ${workExperience}
               WHERE ${workExperience.resumeId} = ${resume.id}
             ) sub
           )
         `.mapWith(v => v as any[]),
       })
       .from(user)
       .leftJoin(resume, sql`${resume.userId} = ${user.id}`)
       .where(sql`${user.id} = ${talentId}`)
         .groupBy(user.id, resume.id);

  if (!row) {
    throw new Error(`No talent found with id ${talentId}`)
  }
console.log(row.Language);
  // 2) build summary from the data and add it to the talent_documents table
  //    (if it already exists, update it)
const name = row.Name ?? 'Unknown';
const bio  = row.Biography ?? '';

const skills: { Skill?: string|null; Proficiency?: string|null }[] =
  Array.isArray(row.Skills) ? row.Skills.filter(Boolean) : [];

const exps: { company?: string|null; title?: string|null; years?: number|null }[] =
  Array.isArray(row.Experiences) ? row.Experiences.filter(Boolean) : [];

const langs: string[] =
  Array.isArray(row.Language) ? row.Language.filter(Boolean) : [];

const edus: { EducationLevel?: string|null; EducationProgram?: string|null }[] =
  Array.isArray(row.EducationProgram) ? row.EducationProgram.filter(Boolean) : [];

// build sections only if we have data
const parts: string[] = [];

parts.push(`${name}${bio ? ` – ${bio}` : ''}.`);

if (skills.length) {
  parts.push(
    `Skilled in: ${skills
      .filter(s => s?.Skill)
      .map(s => `${s!.Skill}${s?.Proficiency ? ` (${s!.Proficiency})` : ''}`)
      .join(', ')}.`
  );
}

if (exps.length) {
  parts.push(
    `Experience: ${exps
      .filter(e => e?.title || e?.company)
      .map(e => `${e?.title ?? ''} at ${e?.company ?? ''}${e?.years != null ? ` (${e.years} yr${e.years === 1 ? '' : 's'})` : ''}`.trim())
      .join('; ')}.`
  );
}

if (langs.length) {
  parts.push(`Languages: ${langs.join(', ')}.`);
}

if (edus.length) {
  parts.push(
    `Education: ${edus
      .filter(e => e?.EducationProgram)
      .map(e => `${e!.EducationProgram}${e?.EducationLevel ? ` (${e.EducationLevel})` : ''}`)
      .join('; ')}.`
  );
}

const summary = parts.join(' ').replace(/\s+/g, ' ').trim();
 

  

  // 3) upsert into talent_documents
  const docRes = await db
    .insert(talentDocuments)
    .values({
        id: row.Id,
      summary:  summary
    })
    .onConflictDoUpdate({
      target: talentDocuments.id,
      set: {
        summary:  sql`EXCLUDED.summary`,
      },
      where:sql`${talentDocuments.summary} IS DISTINCT FROM EXCLUDED.summary`
    })
    .returning({id: talentDocuments.id})

    const summaryChanged = docRes.length > 0;
    // 4) generate vectors for the summary

    //  const textToChunk = summary.length > 1000
    //     ? JSON.stringify(metadata)  // fallback if summary is huge
    //     : summary;

    //   // 3) Split into chunks
    //   const chunks = chunkText(textToChunk, /*maxLen*/1000, /*overlap*/200);
    //   const {embeddings} = await embedMany({
    //     model: embeddingModel,
    //     values: chunks
    // });
    if(summaryChanged){
      
      const response = await embed( {
      model: embeddingModel,
      value: summary
    })
    await db.insert(talentVectors).values(
      {
        id: row.Id,
        vector: response.embedding
      }
    ).onConflictDoUpdate({
      target: talentVectors.id,
      set: { vector: sql`EXCLUDED.vector` },
      where: sql`${talentVectors.vector} IS DISTINCT FROM EXCLUDED.vector`,
    }
    );
    }else{
      console.log("No changes made")
    }
    console.log(`Talent vector generated for ${name} (${talentId})`);

    }