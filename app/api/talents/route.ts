

import { user, workExperience, education, resume, resumeLanguage, resumeSkill, language, jobSubmission, job, organisation } from '@/lib/db/schema/schema';

import { sql } from 'drizzle-orm';
import {db} from '@/lib/db';

async function getAllTalentsDocuments(pageSize:number, offset:number) {
    try {
       
        console.log('Fetching all talents documents');
const orgId = 'd6341654-0cc6-480a-a866-16aa47d7c368';
const data = await db
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
  .where(sql`
    EXISTS (SELECT 1
      FROM ${jobSubmission}
      JOIN ${job} ON ${job.id} = ${jobSubmission.jobId}  
      WHERE ${jobSubmission.userId} = ${user.id} AND ${job.organisationId} = ${orgId}
    )
    `)
  .orderBy(user.lastName, user.firstName)
  // .limit(pageSize)
  // .offset(offset)

  const count = await db.execute(
    sql`
      SELECT COUNT(*)::int AS count
      FROM (
        SELECT ${user.id}
        FROM ${user}
        WHERE EXISTS(
        SELECT 1
        FROM ${jobSubmission}
        JOIN ${job} ON ${job.id} = ${jobSubmission.jobId}
        WHERE ${jobSubmission.userId} = ${user.id} AND ${job.organisationId} = ${orgId}
        
        )GROUP BY ${user.id}
      ) sub
    `
  )
  console.log('Fetched talents:', data.length, 'Total count:', count[0].count);

  return {data: data, count: count[0].count}; 
  } catch (error) {
        console.error('Error fetching talents:', error);
        throw new Error('Failed to fetch talents');
  }
}
export async function GET(req: Request){
    const params = new URL(req.url).searchParams; 
    const page = parseInt(params.get("page") || '1', 10);
  const pageSize = parseInt((params.get("pageSize")) || '10', 10);
  const offset   = (page - 1) * pageSize;
    const response = await getAllTalentsDocuments(pageSize, offset);
    console.log(response)
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}