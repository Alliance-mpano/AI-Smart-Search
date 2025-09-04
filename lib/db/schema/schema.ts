import { pgTable, uniqueIndex, pgEnum, uuid, text, integer, timestamp, boolean, jsonb, varchar, smallint, doublePrecision, json, date, bigint, customType, numeric, index, vector, pgSchema, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

import { relations } from "drizzle-orm/relations";

export const drizzle = pgSchema("drizzle");
export const hdbCatalog = pgSchema("hdb_catalog");
export const herokuExt = pgSchema("heroku_ext");

export const statusEnum = pgEnum("status_enum", ['DRAFTED', 'PUBLISHED', 'ARCHIVED'])
export const submissionStatusEnum = pgEnum("submission_status_enum", ['UNGRADED', 'DRAFTED', 'GRADED'])
export const typeEnum = pgEnum("type_enum", ['PUBLIC', 'PRIVATE', 'ONBOARDING', 'CLOSED', 'PRE_SCREEN', 'REQUIRED', 'OCID', 'STANDALONE', 'PATHWAY_TASK', 'PROGRAM_TASK', 'JOB_TASK'])


export const account = pgTable("Account", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	type: text("Type").notNull(),
	provider: text("Provider").notNull(),
	providerAccountId: text("ProviderAccountId").notNull(),
	refreshToken: text("RefreshToken"),
	accessToken: text("AccessToken"),
	expiresAt: integer("ExpiresAt"),
	tokenType: text("TokenType"),
	scope: text("Scope").notNull(),
	idToken: text("IdToken"),
	sessionState: text("SessionState"),
},
(table) => {
	return {
		pkey: uniqueIndex("Account_pkey").on(table.id),
		providerProviderAccountIdKey: uniqueIndex("Account_Provider_ProviderAccountId_key").on(table.provider, table.providerAccountId),
	}
});

export const aiTokenUsageLogs = pgTable("AiTokenUsageLogs", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	userId: uuid("UserId"),
	organisationId: uuid("OrganisationId"),
	actionType: text("ActionType").notNull(),
	modelId: text("ModelId").notNull(),
	providerName: text("ProviderName").notNull(),
	promptTokens: integer("PromptTokens").notNull(),
	completionTokens: integer("CompletionTokens").notNull(),
	totalTokens: integer("TotalTokens").notNull(),
	createdAt: timestamp("CreatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	success: boolean("Success").notNull(),
	errorMessage: text("ErrorMessage"),
	metadata: jsonb("Metadata"),
	durationMs: integer("DurationMs").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("AiTokenUsageLogs_pkey").on(table.id),
	}
});

export const banner = pgTable("Banner", {
	id: integer("Id").default(sql`nextval('"Banner_Id_seq"'::regclass)`).primaryKey().notNull(),
	imageUrl: text("ImageUrl").notNull(),
	userId: uuid("UserId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("Banner_pkey").on(table.id),
	}
});

export const bookmark = pgTable("Bookmark", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	studentId: uuid("StudentId"),
	taskId: integer("TaskId"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		pkey: uniqueIndex("Bookmark_pkey").on(table.id),
	}
});

export const category = pgTable("Category", {
	id: integer("Id").default(sql`nextval('"Category_Id_seq"'::regclass)`).primaryKey().notNull(),
	label: varchar("Label"),
	parent: integer("parent"),
},
(table) => {
	return {
		pkey: uniqueIndex("Category_pkey").on(table.id),
	}
});

export const certificate = pgTable("Certificate", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("UserId"),
	experienceSubmissionId: uuid("ExperienceSubmissionId"),
	pathwaySubmissionId: uuid("PathwaySubmissionId"),
	programSubmissionId: uuid("ProgramSubmissionId"),
},
(table) => {
	return {
		pkey: uniqueIndex("Certificate_pkey").on(table.id),
	}
});

export const companyOnboarding = pgTable("CompanyOnboarding", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	organisationId: uuid("OrganisationId").notNull(),
	information: jsonb("Information").default(sql`jsonb_build_object()`).notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("CompanyOnboarding_pkey").on(table.id),
	}
});

export const companySignatures = pgTable("CompanySignatures", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	organisationId: uuid("OrganisationId").notNull(),
	name: text("Name").notNull(),
	position: text("Position").notNull(),
	signatureUrl: text("SignatureUrl").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("CompanySignatures_pkey").on(table.id),
	}
});

export const contentType = pgTable("ContentType", {
	id: integer("Id").default(sql`nextval('"TaskType_Id_seq"'::regclass)`).primaryKey().notNull(),
	type: text("Type").notNull(),
},
(table) => {
	return {
		taskTypePkey: uniqueIndex("TaskType_pkey").on(table.id),
	}
});

export const deactivatedAccounts = pgTable("DeactivatedAccounts", {
	id: integer("Id").default(sql`nextval('"DeactivatedAccounts_Id_seq"'::regclass)`).primaryKey().notNull(),
	email: varchar("Email").notNull(),
	reason: varchar("Reason"),
	deactivatedOn: timestamp("DeactivatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deactivatedBy: uuid("DeactivatedBy"),
},
(table) => {
	return {
		emailKey: uniqueIndex("DeactivatedAccounts_Email_key").on(table.email),
		pkey: uniqueIndex("DeactivatedAccounts_pkey").on(table.id),
	}
});

export const difficulty = pgTable("Difficulty", {
	id: integer("Id").default(sql`nextval('"Difficulty_Id_seq"'::regclass)`).primaryKey().notNull(),
	label: varchar("Label"),
},
(table) => {
	return {
		pkey: uniqueIndex("Difficulty_pkey").on(table.id),
	}
});

export const education = pgTable("Education", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	institutionName: varchar("InstitutionName"),
	educationLevel: varchar("EducationLevel").notNull(),
	educationProgram: varchar("EducationProgram").notNull(),
	isCurrently: boolean("IsCurrently"),
	city: varchar("City"),
	country: varchar("Country"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	resumeId: uuid("ResumeId").notNull(),
	institutionId: uuid("InstitutionId"),
	startYear: smallint("StartYear"),
	endYear: smallint("EndYear"),
},
(table) => {
	return {
		pkey: uniqueIndex("Education_pkey").on(table.id),
	}
});

export const emailSubscription = pgTable("EmailSubscription", {
	id: integer("Id").default(sql`nextval('"EmailSubscription_Id_seq"'::regclass)`).primaryKey().notNull(),
	type: varchar("Type").notNull(),
	description: text("Description"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("EmailSubscription_pkey").on(table.id),
		typeKey: uniqueIndex("EmailSubscription_Type_key").on(table.type),
	}
});

export const experience = pgTable("Experience", {
	title: varchar("Title"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	description: text("Description").notNull(),
	imageUrl: text("ImageUrl"),
	difficulty: integer("Difficulty").notNull(),
	status: integer("Status").default(sql`3`),
	id: integer("Id").default(sql`nextval('"Experience_Id_seq"'::regclass)`).primaryKey().notNull(),
	organisationId: uuid("OrganisationId").default(sql`bae9f764-95ac-4629-bef6-3d2724eaf9c3`).notNull(),
	defaultFeedback: text("DefaultFeedback"),
	isJob: boolean("isJob").default(sql`false`).notNull(),
	type: integer("Type").notNull(),
	prescreenId: integer("PrescreenId"),
	isFeatured: boolean("isFeatured").default(sql`false`).notNull(),
	price: integer("Price"),
	launchDate: timestamp("LaunchDate", { mode: 'string' }),
	isLocked: boolean("isLocked").default(sql`false`).notNull(),
	closingDate: timestamp("ClosingDate", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		pkey: uniqueIndex("Experience_pkey").on(table.id),
	}
});

export const experienceCategory = pgTable("ExperienceCategory", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	experienceId: integer("ExperienceId").notNull(),
	categoryId: integer("CategoryId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		experienceCategoriesPkey: uniqueIndex("ExperienceCategories_pkey").on(table.id),
	}
});

export const experienceSignatures = pgTable("ExperienceSignatures", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	experienceId: integer("ExperienceId").notNull(),
	signatureId: uuid("SignatureId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		experienceIdSignatureIdKey: uniqueIndex("ExperienceSignatures_ExperienceId_SignatureId_key").on(table.experienceId, table.signatureId),
		pkey: uniqueIndex("ExperienceSignatures_pkey").on(table.id),
	}
});

export const experienceSkill = pgTable("ExperienceSkill", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	experienceId: integer("ExperienceId").notNull(),
	skillId: integer("SkillId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		experienceIdSkillIdKey: uniqueIndex("ExperienceSkill_ExperienceId_SkillId_key").on(table.experienceId, table.skillId),
		pkey: uniqueIndex("ExperienceSkill_pkey").on(table.id),
	}
});

export const experienceSubmission = pgTable("ExperienceSubmission", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	experienceId: integer("ExperienceId").notNull(),
	takenTasks: jsonb("TakenTasks").default(sql`jsonb_build_array()`).notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	grade: integer("Grade").default(sql`0`),
	isCompleted: boolean("IsCompleted").default(sql`false`).notNull(),
	status: integer("Status").default(sql`1`).notNull(),
	gradedSubmissions: jsonb("GradedSubmissions").default(sql`jsonb_build_array()`).notNull(),
	gradingStatus: integer("GradingStatus").default(sql`1`).notNull(),
},
(table) => {
	return {
		experienceIdUserIdKey: uniqueIndex("ExperienceSubmission_ExperienceId_UserId_key").on(table.experienceId, table.userId),
		experienceUserPkey: uniqueIndex("ExperienceUser_pkey").on(table.id),
	}
});

export const experienceTaskSubmission = pgTable("ExperienceTaskSubmission", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	submissionId: uuid("SubmissionId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	experienceSubmissionId: uuid("ExperienceSubmissionId").notNull(),
	isApproved: boolean("IsApproved"),
},
(table) => {
	return {
		pkey: uniqueIndex("ExperienceTaskSubmission_pkey").on(table.id),
		submissionIdExperienceSubmissionIdKe: uniqueIndex("ExperienceTaskSubmission_SubmissionId_ExperienceSubmissionId_ke").on(table.submissionId, table.experienceSubmissionId),
	}
});

export const experienceType = pgTable("ExperienceType", {
	id: integer("Id").primaryKey().notNull(),
	name: text("Name").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("ExperienceType_pkey").on(table.id),
	}
});

export const grade = pgTable("Grade", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	submissionId: uuid("SubmissionId"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	feedback: text("Feedback"),
	rubricId: integer("RubricId"),
	grade: integer("Grade").notNull(),
	subSkillId: integer("SubSkillId"),
	questionId: uuid("QuestionId"),
	aiGeneratedPercentage: integer("AiGeneratedPercentage"),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`),
},
(table) => {
	return {
		pkey: uniqueIndex("Grade_pkey").on(table.id),
		rubricIdSubmissionIdKey: uniqueIndex("Grade_RubricId_SubmissionId_key").on(table.rubricId, table.submissionId),
		subSkillIdSubmissionIdQuestionIdKey: uniqueIndex("Grade_SubSkillId_SubmissionId_QuestionId_key").on(table.subSkillId, table.submissionId, table.questionId),
	}
});

export const gradingStatus = pgTable("GradingStatus", {
	id: integer("Id").primaryKey().notNull(),
	label: text("Label").notNull(),
},
(table) => {
	return {
		labelKey: uniqueIndex("GradingStatus_Label_key").on(table.label),
		pkey: uniqueIndex("GradingStatus_pkey").on(table.id),
	}
});

export const group = pgTable("Group", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	name: varchar("Name").notNull(),
	organisationId: uuid("OrganisationId").notNull(),
	createdBy: uuid("CreatedBy"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`).notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("Group_pkey").on(table.id),
	}
});

export const groupExperience = pgTable("GroupExperience", {
	groupId: uuid("GroupId").notNull(),
	experienceId: integer("ExperienceId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
},
(table) => {
	return {
		groupIdExperienceIdKey: uniqueIndex("GroupExperience_GroupId_ExperienceId_key").on(table.groupId, table.experienceId),
		pkey: uniqueIndex("GroupExperience_pkey").on(table.id),
	}
});

export const hiringStatus = pgTable("HiringStatus", {
	organisationId: uuid("OrganisationId"),
	statusName: text("StatusName").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	id: integer("Id").default(sql`nextval('"HiringStatus_Id_seq"'::regclass)`).primaryKey().notNull(),
	jobId: integer("JobId"),
	orderNumber: integer("OrderNumber"),
},
(table) => {
	return {
		jobIdOrderNumberKey: uniqueIndex("HiringStatus_JobId_OrderNumber_key").on(table.jobId, table.orderNumber),
		pkey: uniqueIndex("HiringStatus_pkey").on(table.id),
	}
});

export const hiringTemplates = pgTable("HiringTemplates", {
	name: text("Name").notNull(),
	schema: jsonb("Schema").notNull(),
	organisationId: uuid("OrganisationId").notNull(),
	description: text("Description"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("UserId").notNull(),
	isPublic: boolean("IsPublic").default(sql`true`).notNull(),
	id: integer("Id").default(sql`nextval('"HiringTemplates_TemplateId_seq"'::regclass)`).primaryKey().notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("HiringTemplates_pkey").on(table.id),
	}
});

export const institution = pgTable("Institution", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	name: text("Name").notNull(),
	acronym: text("Acronym").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organisationId: uuid("OrganisationId"),
},
(table) => {
	return {
		pkey: uniqueIndex("Institution_pkey").on(table.id),
	}
});

export const invitation = pgTable("Invitation", {
	id: integer("Id").default(sql`nextval('"Invitation_Id_seq"'::regclass)`).primaryKey().notNull(),
	email: varchar("Email"),
	invitedOn: timestamp("InvitedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	invitedBy: uuid("InvitedBy").notNull(),
	status: varchar("Status").default(sql`'PENDING'`).notNull(),
	updatedAt: timestamp("UpdatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	role: integer("Role").default(sql`20`).notNull(),
	organisationId: uuid("OrganisationId").notNull(),
},
(table) => {
	return {
		emailKey: uniqueIndex("Invitation_Email_key").on(table.email),
		pkey: uniqueIndex("Invitation_pkey").on(table.id),
	}
});

export const job = pgTable("Job", {
	id: integer("Id").default(sql`nextval('"Job_Id_seq"'::regclass)`).primaryKey().notNull(),
	title: text("Title").notNull(),
	location: text("Location"),
	employmentType: text("EmploymentType"),
	contractType: text("ContractType"),
	yearsOfExperience: text("YearsOfExperience"),
	description: text("Description"),
	createdBy: uuid("CreatedBy").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organisationId: uuid("OrganisationId").notNull(),
	deadline: timestamp("Deadline", { mode: 'string' }),
	requirements: text("Requirements"),
	sections: jsonb("Sections"),
	taskId: integer("TaskId"),
	minSalary: integer("MinSalary"),
	maxSalary: integer("MaxSalary"),
	hiringCriteria: jsonb("HiringCriteria"),
	defaultHiringNote: text("DefaultHiringNote"),
	hiringTemplateId: integer("HiringTemplateId").default(sql`1`),
	requireCv: boolean("RequireCV").default(sql`true`).notNull(),
	type: integer("Type").default(sql`1`).notNull(),
	status: integer("Status").default(sql`1`).notNull(),
	currency: varchar("Currency"),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`),
	educationLevel: varchar("EducationLevel"),
	gradingPrompt: text("GradingPrompt").default(sql`''`),
},
(table) => {
	return {
		pkey: uniqueIndex("Job_pkey").on(table.id),
	}
});

export const jobExperience = pgTable("JobExperience", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	jobId: integer("JobId").notNull(),
	experienceId: integer("ExperienceId").notNull(),
	createdOn: timestamp("CreatedOn", { mode: 'string' }).defaultNow().notNull(),
	updateOn: timestamp("UpdateOn", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		experienceIdJobIdKey: uniqueIndex("JobExperience_ExperienceId_JobId_key").on(table.experienceId, table.jobId),
		pkey: uniqueIndex("JobExperience_pkey").on(table.id),
	}
});

export const jobPrescreen = pgTable("JobPrescreen", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	prescreenId: integer("PrescreenId").notNull(),
	jobId: integer("JobId").notNull(),
},
(table) => {
	return {
		jobIdKey: uniqueIndex("JobPrescreen_JobId_key").on(table.jobId),
		pkey: uniqueIndex("JobPrescreen_pkey").on(table.id),
	}
});

export const jobSkill = pgTable("JobSkill", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	jobId: integer("JobId").notNull(),
	skillId: integer("SkillId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateOn: timestamp("UpdateOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		jobIdSkillIdKey: uniqueIndex("JobSkill_JobId_SkillId_key").on(table.jobId, table.skillId),
		pkey: uniqueIndex("JobSkill_pkey").on(table.id),
	}
});

export const jobSubmission = pgTable("JobSubmission", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	prescreenAnswerId: uuid("PrescreenAnswerId"),
	experienceSubmissionId: uuid("ExperienceSubmissionId"),
	jobId: integer("JobId").notNull(),
	notes: text("Notes"),
	status: integer("Status"),
	star: integer("Star"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("UserId").notNull(),
	gradingMetrics: jsonb("GradingMetrics"),
	isCompleted: boolean("IsCompleted").default(sql`false`).notNull(),
	takenTasks: jsonb("TakenTasks").default(sql`jsonb_build_object()`).notNull(),
	gradedSubmissions: jsonb("GradedSubmissions").default(sql`jsonb_build_array()`).notNull(),
	averageGrades: integer("AverageGrades"),
},
(table) => {
	return {
		experienceSubmissionIdKey: uniqueIndex("JobSubmission_ExperienceSubmissionId_key").on(table.experienceSubmissionId),
		pkey: uniqueIndex("JobSubmission_pkey").on(table.id),
		prescreenAnswerIdKey: uniqueIndex("JobSubmission_PrescreenAnswerId_key").on(table.prescreenAnswerId),
	}
});

export const jobSubSkill = pgTable("JobSubSkill", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	jobId: integer("JobId").notNull(),
	subSkillId: integer("SubSkillId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("JobSubSkill_pkey").on(table.id),
	}
});

export const language = pgTable("Language", {
	id: integer("Id").default(sql`nextval('"Language_Id_seq"'::regclass)`).primaryKey().notNull(),
	name: varchar("Name"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		pkey: uniqueIndex("Language_pkey").on(table.id),
	}
});

export const media = pgTable("Media", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	url: text("Url").notNull(),
	questionId: uuid("QuestionId").notNull(),
	createdAt: timestamp("CreatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("UpdatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	type: integer("Type"),
},
(table) => {
	return {
		pkey: uniqueIndex("Media_pkey").on(table.id),
	}
});

export const mediaType = pgTable("MediaType", {
	id: integer("Id").default(sql`nextval('"MediaType_Id_seq"'::regclass)`).primaryKey().notNull(),
	type: text("Type").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("MediaType_pkey").on(table.id),
		typeKey: uniqueIndex("MediaType_Type_key").on(table.type),
	}
});

export const metrics = pgTable("Metrics", {
	id: integer("Id").default(sql`nextval('"Metrics_Id_seq"'::regclass)`).primaryKey().notNull(),
	newUsers: integer("NewUsers").notNull(),
	activeUsers: integer("ActiveUsers").notNull(),
	averageLoggedUsers: integer("AverageLoggedUsers").notNull(),
	conversionRate: doublePrecision("ConversionRate").notNull(),
	taskCompletedByUserRate: doublePrecision("TaskCompletedByUserRate").notNull(),
	rakingTask: json("RakingTask").notNull(),
	rakingExperience: json("RakingExperience").notNull(),
	taskRatingRank: json("TaskRatingRank").notNull(),
	experienceRatingRank: json("ExperienceRatingRank").notNull(),
	taskDraftRate: doublePrecision("TaskDraftRate").notNull(),
	experienceDraftRate: doublePrecision("ExperienceDraftRate").notNull(),
	taskSubmissionsNumber: integer("TaskSubmissionsNumber").notNull(),
	experienceSubmissionsNumber: integer("ExperienceSubmissionsNumber").notNull(),
	inactiveUsers: integer("InactiveUsers").notNull(),
	createdOn: date("CreatedOn").defaultNow().notNull(),
	experienceCompletedByUserRate: doublePrecision("ExperienceCompletedByUserRate").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("Metrics_pkey").on(table.id),
	}
});

export const mode = pgTable("Mode", {
	id: integer("Id").default(sql`nextval('"Mode_Id_seq"'::regclass)`).primaryKey().notNull(),
	name: text("Name").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("Mode_pkey").on(table.id),
	}
});

export const openPosition = pgTable("OpenPosition", {
	id: bigint("Id", { mode: "number" }).default(sql`nextval('"OpenPosition_Id_seq"'::regclass)`).primaryKey().notNull(),
	title: text("Title").notNull(),
	description: text("Description").notNull(),
	openDate: date("OpenDate").notNull(),
	closeDate: date("CloseDate").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { mode: 'string' }).defaultNow().notNull(),
	organisationId: uuid("OrganisationId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("OpenPosition_pkey").on(table.id),
	}
});

export const organisation = pgTable("Organisation", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar("Name"),
	email: varchar("Email"),
	phone: varchar("Phone"),
	imageUrl: varchar("ImageUrl"),
	address: varchar("Address"),
	isVerified: boolean("IsVerified"),
	webSiteUrl: varchar("WebSiteUrl"),
	biography: text("Biography"),
	isEmployees: boolean("IsEmployees"),
	isInterns: boolean("IsInterns"),
	isTrainees: boolean("IsTrainees"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	userName: text("UserName"),
	foundedOn: date("FoundedOn"),
	size: varchar("Size"),
	industry: varchar("Industry"),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`),
	type: integer("Type").default(sql`2`).notNull(),
	plan: integer("Plan"),
	createdBy: uuid("CreatedBy"),
},
(table) => {
	return {
		phoneKey: uniqueIndex("Organisation_Phone_key").on(table.phone),
		pkey: uniqueIndex("Organisation_pkey").on(table.id),
		userNameKey: uniqueIndex("Organisation_UserName_key").on(table.userName),
	}
});

export const organisationInviteStatus = pgTable("organisation_invite_status", {
	value: text("value").primaryKey().notNull(),
},
(table) => {
	return {
		organisationInviteStatusPkey: uniqueIndex("OrganisationInviteStatus_pkey").on(table.value),
	}
});

export const organisationInterest = pgTable("OrganisationInterest", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	organisationId: uuid("OrganisationId").notNull(),
	skillId: integer("SkillId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		organisationIdSkillIdKey: uniqueIndex("OrganisationInterest_OrganisationId_SkillId_key").on(table.organisationId, table.skillId),
		pkey: uniqueIndex("OrganisationInterest_pkey").on(table.id),
	}
});

export const organisationType = pgTable("OrganisationType", {
	id: integer("Id").default(sql`nextval('"OrganisationType_Id_seq"'::regclass)`).primaryKey().notNull(),
	name: text("Name").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("OrganisationType_pkey").on(table.id),
	}
});

export const pathwayExperienceSubmission = pgTable("PathwayExperienceSubmission", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	pathwayUserSubmissionId: uuid("PathwayUserSubmissionId").notNull(),
	experienceSubmissionId: uuid("ExperienceSubmissionId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("PathwayExperienceSubmission_pkey").on(table.id),
	}
});

export const pathways = pgTable("Pathways", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	title: varchar("Title").notNull(),
	description: text("Description").notNull(),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`),
	organisationId: uuid("OrganisationId").notNull(),
	image: text("Image").notNull(),
	version: integer("Version").default(sql`1`).notNull(),
	createdAt: timestamp("CreatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("UpdatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	sections: jsonb("Sections").default(sql`jsonb_build_array()`).notNull(),
	skillId: integer("SkillId"),
	status: statusEnum("Status").default(sql`DRAFTED`).notNull(),
	type: typeEnum("Type").default(sql`PUBLIC`).notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("Pathways_pkey").on(table.id),
	}
});

export const pathwaySubmissions = pgTable("PathwaySubmissions", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	version: integer("Version").default(sql`1`).notNull(),
	averageGrade: integer("AverageGrade").notNull(),
	certificateId: uuid("CertificateId"),
	status: varchar("Status").notNull(),
	takenTasks: jsonb("TakenTasks").default(sql`jsonb_build_object()`).notNull(),
	pathwayId: uuid("PathwayId").notNull(),
	startedAt: timestamp("StartedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("UpdatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	gradedSubmissions: jsonb("GradedSubmissions").default(sql`jsonb_build_array()`).notNull(),
	isCompleted: boolean("IsCompleted").default(sql`false`).notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("PathwaySubmissions_pkey").on(table.id),
		userIdPathwayIdKey: uniqueIndex("PathwaySubmissions_UserId_PathwayId_key").on(table.userId, table.pathwayId),
	}
});

export const planMode = pgTable("PlanMode", {
	id: integer("Id").default(sql`nextval('"PremiumMode_Id_seq"'::regclass)`).primaryKey().notNull(),
	mode: integer("Mode").notNull(),
	description: text("Description"),
},
(table) => {
	return {
		premiumModeModeKey: uniqueIndex("PremiumMode_Mode_key").on(table.mode),
		premiumModePkey: uniqueIndex("PremiumMode_pkey").on(table.id),
	}
});

export const premiumRequest = pgTable("PremiumRequest", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	names: text("Names"),
	email: text("Email"),
	phoneNumber: integer("PhoneNumber"),
	priceRange: text("PriceRange"),
},
(table) => {
	return {
		namesKey: uniqueIndex("PremiumRequest_Names_key").on(table.names),
		phoneNumberKey: uniqueIndex("PremiumRequest_PhoneNumber_key").on(table.phoneNumber),
		pkey: uniqueIndex("PremiumRequest_pkey").on(table.id),
	}
});

export const prescreen = pgTable("Prescreen", {
	title: text("Title").notNull(),
	description: text("Description").notNull(),
	schema: jsonb("Schema").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	id: integer("Id").default(sql`nextval('"Prescreen_Id_seq"'::regclass)`).primaryKey().notNull(),
	createdBy: uuid("CreatedBy").notNull(),
	deadline: timestamp("Deadline", { withTimezone: true, mode: 'string' }),
	organisationId: uuid("OrganisationId"),
	type: varchar("Type").default(sql`'JOB'`).notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("Prescreen_pkey").on(table.id),
	}
});

export const prescreenAnswer = pgTable("PrescreenAnswer", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	experienceId: integer("ExperienceId"),
	status: integer("Status"),
	schema: jsonb("Schema").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	isApproved: boolean("IsApproved"),
	grade: jsonb("Grade"),
	isDrafted: boolean("IsDrafted").notNull(),
	prescreenId: integer("PrescreenId").notNull(),
	reviewedBy: uuid("ReviewedBy"),
	submittedBy: uuid("SubmittedBy").notNull(),
	experienceSubmissionId: uuid("ExperienceSubmissionId"),
	feedback: text("Feedback"),
	questions: jsonb("Questions").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("PrescreenAnswer_pkey").on(table.id),
		prescreenIdExperienceIdSubmittedByKey: uniqueIndex("PrescreenAnswer_PrescreenId_ExperienceId_SubmittedBy_key").on(table.prescreenId, table.experienceId, table.submittedBy),
	}
});

export const program = pgTable("Program", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	title: varchar("Title").notNull(),
	schema: jsonb("Schema").default(sql`jsonb_build_object()`),
	type: integer("Type").default(sql`1`).notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organisationId: uuid("OrganisationId").default(sql`bae9f764-95ac-4629-bef6-3d2724eaf9c3`).notNull(),
	status: integer("Status").notNull(),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`),
	imageUrl: text("ImageUrl"),
	description: text("Description"),
},
(table) => {
	return {
		pkey: uniqueIndex("Program_pkey").on(table.id),
	}
});

export const programPrice = pgTable("ProgramPrice", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	experienceId: integer("ExperienceId").notNull(),
	price: integer("Price").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("ProgramPrice_pkey").on(table.id),
	}
});

export const programSubmissions = pgTable("ProgramSubmissions", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	programId: uuid("ProgramId").notNull(),
	userId: uuid("UserId").notNull(),
	createOn: timestamp("CreateOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	isCompleted: boolean("IsCompleted").default(sql`false`).notNull(),
	status: varchar("Status").notNull(),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`).notNull(),
	takenTasks: jsonb("TakenTasks").default(sql`jsonb_build_object()`),
	gradedSubmissions: jsonb("GradedSubmissions").default(sql`jsonb_build_array()`),
	averageGrades: integer("AverageGrades"),
	prescreenAnswerId: uuid("PrescreenAnswerId").notNull(),
	certificateId: uuid("CertificateId"),
},
(table) => {
	return {
		pkey: uniqueIndex("ProgramSubmissions_pkey").on(table.id),
	}
});

export const programType = pgTable("ProgramType", {
	id: integer("Id").default(sql`nextval('"ProgramType_Id_seq"'::regclass)`).primaryKey().notNull(),
	name: text("Name").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("ProgramType_pkey").on(table.id),
	}
});

export const question = pgTable("Question", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	qType: integer("QType"),
	title: varchar("Title"),
	description: varchar("Description"),
	automatedResponse: varchar("AutomatedResponse"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	validationRules: json("ValidationRules"),
	taskId: integer("TaskId").notNull(),
	orderNumber: integer("OrderNumber").default(sql`0`).notNull(),
	subSkillId: integer("SubSkillId"),
	codesInfo: json("CodesInfo"),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`),
},
(table) => {
	return {
		pkey: uniqueIndex("Question_pkey").on(table.id),
	}
});

export const questionChoice = pgTable("QuestionChoice", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	questionId: uuid("QuestionID"),
	choice: varchar("Choice"),
	isCorrect: boolean("IsCorrect").default(sql`false`),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		pkey: uniqueIndex("QuestionChoice_pkey").on(table.id),
	}
});

export const questionType = pgTable("QuestionType", {
	id: integer("Id").default(sql`nextval('"QuestionType_Id_seq"'::regclass)`).primaryKey().notNull(),
	qtype: varchar("Qtype"),
},
(table) => {
	return {
		pkey: uniqueIndex("QuestionType_pkey").on(table.id),
	}
});

export const referral = pgTable("Referral", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	referred: uuid("Referred").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("Referral_pkey").on(table.id),
		userIdReferredKey: uniqueIndex("Referral_UserId_Referred_key").on(table.userId, table.referred),
	}
});

export const resume = pgTable("Resume", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	biography: varchar("Biography"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	metadata: jsonb("Metadata").default(sql`'{}'`).notNull(),
	headline: text("Headline"),
	cvLink: varchar("CvLink"),
	availability: integer("Availability").default(sql`2`).notNull(),
},
(table) => {
	return {
		studentPkey: uniqueIndex("Student_pkey").on(table.id),
		studentUserIdKey: uniqueIndex("Student_UserId_key").on(table.userId),
	}
});

export const resumeLanguage = pgTable("ResumeLanguage", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	resumeId: uuid("ResumeId"),
	languageId: integer("LanguageId"),
	proficiency: varchar("Proficiency"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		studentLanguagePkey: uniqueIndex("StudentLanguage_pkey").on(table.id),
	}
});

export const resumeSkill = pgTable("ResumeSkill", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	skillId: integer("SkillId"),
	proficiency: text("Proficiency").notNull(),
	isVerified: boolean("IsVerified").default(sql`false`).notNull(),
	resumeId: uuid("ResumeId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	skillName: text("SkillName").notNull(),
	points: integer("Points").default(sql`0`),
},
(table) => {
	return {
		userSkillPkey: uniqueIndex("UserSkill_pkey").on(table.id),
		userSkillResumeIdSkillIdKey: uniqueIndex("UserSkill_ResumeId_SkillId_key").on(table.resumeId, table.skillId),
	}
});

export const role = pgTable("Role", {
	id: integer("Id").primaryKey().notNull(),
	roleName: varchar("RoleName"),
},
(table) => {
	return {
		pkey: uniqueIndex("Role_pkey").on(table.id),
	}
});

export const rubric = pgTable("Rubric", {
	id: integer("Id").default(sql`nextval('"Rubric_Id_seq"'::regclass)`).primaryKey().notNull(),
	label: varchar("Label"),
},
(table) => {
	return {
		pkey: uniqueIndex("Rubric_pkey").on(table.id),
	}
});

export const rubricResponse = pgTable("RubricResponse", {
	id: integer("Id").default(sql`nextval('"RubricResponse_Id_seq"'::regclass)`).primaryKey().notNull(),
	rubricId: integer("RubricId").notNull(),
	score: integer("Score").notNull(),
	message: text("Message").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("RubricResponse_pkey").on(table.id),
		rubricIdScoreKey: uniqueIndex("RubricResponse_RubricId_Score_key").on(table.rubricId, table.score),
	}
});

export const session = pgTable("Session", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	sessionToken: text("SessionToken").notNull(),
	userId: uuid("UserId").notNull(),
	expires: date("Expires").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("Session_pkey").on(table.id),
		sessionTokenKey: uniqueIndex("Session_SessionToken_key").on(table.sessionToken),
	}
});

export const sharedCandidateList = pgTable("SharedCandidateList", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	title: varchar("Title").notNull(),
	candidateIds: uuid("CandidateIds").array().notNull(),
	organisationId: uuid("OrganisationId").notNull(),
	sharedByAdminId: uuid("SharedByAdminId").notNull(),
	createdAt: timestamp("CreatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("ExpiresAt", { withTimezone: true, mode: 'string' }).notNull(),
	termsAccepted: boolean("TermsAccepted").default(sql`false`).notNull(),
	termsAcceptedAt: timestamp("TermsAcceptedAt", { withTimezone: true, mode: 'string' }),
	termsSignedBy: varchar("TermsSignedBy"),
	status: varchar("Status").default(sql`'active'`).notNull(),
	firstViewedAt: timestamp("FirstViewedAt", { withTimezone: true, mode: 'string' }),
	lastViewedAt: timestamp("LastViewedAt", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`),
	termsAcceptedByUserId: uuid("TermsAcceptedByUserId"),
	accessRevoked: boolean("AccessRevoked").default(sql`false`).notNull(),
	accessRevokedAt: timestamp("AccessRevokedAt", { withTimezone: true, mode: 'string' }),
	accessRevokedBy: uuid("AccessRevokedBy"),
	accessRevokedReason: varchar("AccessRevokedReason"),
	accessRequested: boolean("AccessRequested").default(sql`false`).notNull(),
	accessRequestedAt: timestamp("AccessRequestedAt", { withTimezone: true, mode: 'string' }),
	accessRequestedBy: uuid("AccessRequestedBy"),
	accessRequestedReason: varchar("AccessRequestedReason"),
	accessGrantedBy: uuid("AccessGrantedBy"),
	accessGrantedAt: timestamp("AccessGrantedAt", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		pkey: uniqueIndex("SharedCandidateList_pkey").on(table.id),
	}
});

export const skill = pgTable("Skill", {
	id: integer("Id").default(sql`nextval('"Skill_Id_seq"'::regclass)`).primaryKey().notNull(),
	name: varchar("Name"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		pkey: uniqueIndex("Skill_pkey").on(table.id),
	}
});

export const submission = pgTable("Submission", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("UserId"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	averageGrade: integer("AverageGrade"),
	feedback: text("Feedback"),
	status: integer("Status").default(sql`1`).notNull(),
	isDraft: boolean("IsDraft").default(sql`true`),
	taskId: integer("TaskId").notNull(),
	gradedBy: uuid("GradedBy"),
	isCurrent: boolean("IsCurrent").default(sql`true`).notNull(),
	userFeedback: jsonb("UserFeedback").default(sql`jsonb_build_object()`).notNull(),
	timeUsed: numeric("TimeUsed", undefined),
},
(table) => {
	return {
		pkey: uniqueIndex("Submission_pkey").on(table.id),
	}
});

export const submissionAnswer = pgTable("SubmissionAnswer", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	submissionId: uuid("SubmissionId"),
	questionId: uuid("QuestionId").notNull(),
	choiceAnswer: json("ChoiceAnswer"),
	textAnswer: varchar("TextAnswer"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	mediaAnswer: text("MediaAnswer"),
	userId: uuid("UserId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("SubmissionAnswer_pkey").on(table.id),
		userIdSubmissionIdQuestionIdKey: uniqueIndex("SubmissionAnswer_UserId_SubmissionId_QuestionId_key").on(table.userId, table.submissionId, table.questionId),
	}
});

export const subRole = pgTable("SubRole", {
	id: integer("Id").primaryKey().notNull(),
	subRoleName: text("SubRoleName"),
	roleId: integer("RoleId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("SubRole_pkey").on(table.id),
	}
});

export const subSkill = pgTable("SubSkill", {
	id: integer("Id").default(sql`nextval('"SubSkill_Id_seq"'::regclass)`).primaryKey().notNull(),
	label: text("Label").notNull(),
	skillId: integer("SkillId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("SubSkill_pkey").on(table.id),
		skillIdLabelKey: uniqueIndex("SubSkill_SkillId_Label_key").on(table.skillId, table.label),
	}
});

export const subSkillResponse = pgTable("SubSkillResponse", {
	id: integer("Id").default(sql`nextval('"SubSkillResponse_Id_seq"'::regclass)`).primaryKey().notNull(),
	subSkillId: integer("SubSkillId").notNull(),
	score: integer("Score").notNull(),
	message: text("Message").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("SubSkillResponse_pkey").on(table.id),
		subSkillIdScoreKey: uniqueIndex("SubSkillResponse_SubSkillId_Score_key").on(table.subSkillId, table.score),
	}
});

export const talentDocuments = pgTable("TalentDocuments", {
	id: uuid("id").primaryKey().notNull(),
	summary: text("summary").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("TalentDocuments_pkey").on(table.id),
	}
});

export const talentVectors = pgTable("TalentVectors", {
	id: uuid("id").primaryKey().notNull(),
	vector: vector("vector", {dimensions: 1536}).notNull(),
},
(table) => {
	return {
		idxTalentVectorsEmbedding: index("idx_talent_vectors_embedding").on(table.vector),
		pkey: uniqueIndex("TalentVectors_pkey").on(table.id),
	}
});

export const task = pgTable("Task", {
	title: varchar("Title").notNull(),
	description: varchar("Description"),
	difficulty: integer("Difficulty").default(sql`1`),
	userId: uuid("UserId"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	organisationId: uuid("OrganisationId"),
	defaultFeedback: text("DefaultFeedback"),
	imageUrl: text("ImageUrl"),
	id: integer("Id").default(sql`nextval('"Case_Id_seq"'::regclass)`).primaryKey().notNull(),
	status: integer("Status"),
		searchTaskCol: customType({ dataType: () => 'tsvector' })("SearchTaskCol"),
	skillId: integer("SkillId"),
	type: integer("Type").default(sql`2`).notNull(),
	resources: text("Resources"),
	duration: numeric("Duration", undefined),
	enforceTimer: boolean("enforceTimer").default(sql`false`).notNull(),
	isFeatured: boolean("isFeatured").default(sql`false`).notNull(),
	templateId: uuid("TemplateId"),
},
(table) => {
	return {
		caseIdKey: uniqueIndex("Case_Id_key").on(table.id),
		pkey: uniqueIndex("Task_pkey").on(table.id),
	}
});

export const taskCategory = pgTable("TaskCategory", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	categoryId: integer("CategoryId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	taskId: integer("TaskId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("TaskCategory_pkey").on(table.id),
	}
});

export const taskExperience = pgTable("TaskExperience", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	taskId: integer("TaskId").notNull(),
	experienceId: integer("ExperienceId").notNull(),
	orderNumber: integer("OrderNumber").default(sql`0`).notNull(),
	unlockDate: timestamp("UnlockDate", { withTimezone: true, mode: 'string' }),
	duration: numeric("Duration", undefined),
},
(table) => {
	return {
		pkey: uniqueIndex("TaskExperience_pkey").on(table.id),
	}
});

export const taskRubric = pgTable("TaskRubric", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	rubricId: integer("RubricId"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	taskId: integer("TaskId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("TaskRubric_pkey").on(table.id),
	}
});

export const tasks = pgTable("Tasks", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	title: varchar("Title").notNull(),
	description: text("Description").notNull(),
	version: integer("Version").default(sql`1`).notNull(),
	status: varchar("Status").notNull(),
	questions: jsonb("Questions").default(sql`jsonb_build_array()`).notNull(),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`).notNull(),
	organisationId: uuid("OrganisationId").notNull(),
	image: text("Image").notNull(),
	createdAt: timestamp("CreatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("UpdatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	type: typeEnum("Type").default(sql`PUBLIC`).notNull(),
	skillId: integer("SkillId"),
},
(table) => {
	return {
		pkey: uniqueIndex("Tasks_pkey").on(table.id),
		titleOrganisationIdKey: uniqueIndex("Tasks_Title_OrganisationId_key").on(table.title, table.organisationId),
	}
});

export const taskStatus = pgTable("TaskStatus", {
	id: integer("Id").default(sql`nextval('"CaseStatus_Id_seq"'::regclass)`).primaryKey().notNull(),
	label: text("Label").notNull(),
},
(table) => {
	return {
		caseStatusLabelKey: uniqueIndex("CaseStatus_Label_key").on(table.label),
		caseStatusPkey: uniqueIndex("CaseStatus_pkey").on(table.id),
	}
});

export const taskSubmissions = pgTable("TaskSubmissions", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	taskId: uuid("TaskId").notNull(),
	status: submissionStatusEnum("Status").notNull(),
	submissionAnswers: jsonb("SubmissionAnswers").default(sql`jsonb_build_object()`).notNull(),
	isCompleted: boolean("IsCompleted").default(sql`false`).notNull(),
	averageGrade: integer("AverageGrade"),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`).notNull(),
	createdAt: timestamp("CreatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("UpdatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	gradedBy: uuid("GradedBy"),
},
(table) => {
	return {
		pkey: uniqueIndex("TaskSubmissions_pkey").on(table.id),
		userIdTaskIdKey: uniqueIndex("TaskSubmissions_UserId_TaskId_key").on(table.userId, table.taskId),
	}
});

export const taskSubSkill = pgTable("TaskSubSkill", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	taskId: integer("TaskId").notNull(),
	subSkillId: integer("SubSkillId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("TaskSubSkill_pkey").on(table.id),
		taskIdSubSkillIdKey: uniqueIndex("TaskSubSkill_TaskId_SubSkillId_key").on(table.taskId, table.subSkillId),
	}
});

export const template = pgTable("Template", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	schema: jsonb("Schema"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { mode: 'string' }).defaultNow().notNull(),
	type: text("Type").notNull(),
	organisationId: uuid("OrganisationId"),
	isPublished: boolean("isPublished").default(sql`false`),
	taskId: integer("TaskId"),
},
(table) => {
	return {
		pkey: uniqueIndex("Template_pkey").on(table.id),
	}
});

export const user = pgTable("User", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userName: varchar("UserName"),
	roleId: integer("RoleId").default(sql`40`).notNull(),
	firstName: varchar("FirstName"),
	lastName: varchar("LastName"),
	imageUrl: varchar("ImageUrl"),
	email: varchar("Email").notNull(),
	phone: varchar("Phone"),
	gender: varchar("Gender"),
	city: varchar("City"),
	country: varchar("Country"),
	organisationId: uuid("OrganisationId"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
	lastLogin: timestamp("LastLogin", { withTimezone: true, mode: 'string' }).defaultNow(),
	isActive: boolean("IsActive").default(sql`true`).notNull(),
	isDeleted: boolean("IsDeleted"),
	dateOfBirth: date("DateOfBirth"),
	emailVerified: timestamp("EmailVerified", { withTimezone: true, mode: 'string' }),
	socials: jsonb("Socials").default(sql`jsonb_build_object()`).notNull(),
	updatedUserNameOn: date("UpdatedUserNameOn").default(sql`(now() - '3 mons'::interval)`).notNull(),
	shouldRegister: boolean("ShouldRegister").default(sql`true`).notNull(),
	whatsappVerified: boolean("WhatsappVerified").default(sql`false`).notNull(),
	gwenToken: text("GwenToken"),
	subRoleId: integer("SubRoleId"),
	organisationInviteStatus: text("OrganisationInviteStatus").default(sql`'NO_INVITE'`).notNull(),
	cvLink: varchar("CVLink"),
	isStudent: boolean("IsStudent").default(sql`true`).notNull(),
	mode: integer("Mode").default(sql`1`).notNull(),
	plan: integer("Plan").default(sql`1`).notNull(),
	metadata: jsonb("Metadata").default(sql`jsonb_build_object()`),
	resumeCompletion: integer("ResumeCompletion").default(sql`0`).notNull(),
},
(table) => {
	return {
		emailKey: uniqueIndex("User_Email_key").on(table.email),
		phoneKey: uniqueIndex("User_Phone_key").on(table.phone),
		pkey: uniqueIndex("User_pkey").on(table.id),
		userNameKey: uniqueIndex("User_UserName_key").on(table.userName),
	}
});

export const userAbsence = pgTable("user_absence", {
	id: uuid("Id"),
	absentdays: integer("Absentdays"),
	firstName: text("FirstName"),
	email: text("Email"),
	phone: varchar("Phone"),
	whatsappVerified: boolean("WhatsappVerified"),
});

export const userDrafts = pgTable("user_drafts", {
	userId: uuid("UserId"),
	submissionNumber: integer("SubmissionNumber"),
});

export const userAvailability = pgTable("UserAvailability", {
	id: integer("Id").default(sql`nextval('"UserAvailability_Id_seq"'::regclass)`).primaryKey().notNull(),
	name: varchar("Name").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("UserAvailability_pkey").on(table.id),
	}
});

export const userCategory = pgTable("UserCategory", {
	id: uuid("Id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("UserId"),
	categoryId: integer("CategoryId"),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		studentInterestPkey: uniqueIndex("StudentInterest_pkey").on(table.id),
		categoryIdUserIdKey: uniqueIndex("UserCategory_CategoryId_UserId_key").on(table.categoryId, table.userId),
	}
});

export const userEmailPreference = pgTable("UserEmailPreference", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	subscriptionId: integer("SubscriptionId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("UserEmailPreference_pkey").on(table.id),
	}
});

export const userGroup = pgTable("UserGroup", {
	userId: uuid("UserId"),
	userEmail: varchar("UserEmail").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	id: integer("Id").default(sql`nextval('"UserGroup_Id_seq"'::regclass)`).primaryKey().notNull(),
	groupId: uuid("GroupId").notNull(),
	metadata: jsonb("Metadata"),
	inviteStatus: integer("InviteStatus"),
},
(table) => {
	return {
		idKey: uniqueIndex("UserGroup_Id_key").on(table.id),
		pkey: uniqueIndex("UserGroup_pkey").on(table.id),
		userEmailGroupIdKey: uniqueIndex("UserGroup_UserEmail_GroupId_key").on(table.userEmail, table.groupId),
	}
});

export const userHiringStatus = pgTable("UserHiringStatus", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	statusId: uuid("StatusId").notNull(),
	userId: uuid("UserId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organisationId: uuid("OrganisationId").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("UserHiringStatus_pkey").on(table.id),
	}
});

export const userInterest = pgTable("UserInterest", {
	id: integer("Id").default(sql`nextval('"UserInterest_Id_seq"'::regclass)`).primaryKey().notNull(),
	skillId: integer("SkillId").notNull(),
	userId: uuid("UserId").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("UserInterest_pkey").on(table.id),
		userIdSkillIdKey: uniqueIndex("UserInterest_UserId_SkillId_key").on(table.userId, table.skillId),
	}
});

export const userSubSkill = pgTable("UserSubSkill", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	subSkillId: integer("SubSkillId").notNull(),
	contribution: numeric("Contribution", undefined).notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedOn: timestamp("UpdatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	skillId: integer("SkillId"),
},
(table) => {
	return {
		_pkey: uniqueIndex("UserSubSkills_pkey").on(table.id),
		_userIdSubSkillIdKey: uniqueIndex("UserSubSkills_UserId_SubSkillId_key").on(table.userId, table.subSkillId),
	}
});

export const verificationToken = pgTable("VerificationToken", {
	token: text("Token").primaryKey().notNull(),
	identifier: text("Identifier").notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("VerificationToken_pkey").on(table.token),
	}
});

export const vouchers = pgTable("Vouchers", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	code: varchar("Code").notNull(),
	discountPercentage: integer("DiscountPercentage").notNull(),
	validFrom: timestamp("ValidFrom", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	validUntil: timestamp("ValidUntil", { withTimezone: true, mode: 'string' }),
	maximumUses: integer("MaximumUses").default(sql`100`).notNull(),
	currentUses: integer("CurrentUses").default(sql`0`).notNull(),
	applicablePlans: varchar("ApplicablePlans").array().notNull(),
	createdAt: timestamp("CreatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("UpdatedAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		codeKey: uniqueIndex("Vouchers_Code_key").on(table.code),
		pkey: uniqueIndex("Vouchers_pkey").on(table.id),
	}
});

export const whatsappVerification = pgTable("WhatsappVerification", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	userId: uuid("UserId").notNull(),
	code: integer("Code").notNull(),
	createdOn: timestamp("CreatedOn", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("ExpiresAt", { withTimezone: true, mode: 'string' }).notNull(),
	redeemedOn: timestamp("RedeemedOn", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("WhatsappVerification_pkey").on(table.id),
	}
});

export const workExperience = pgTable("WorkExperience", {
	id: uuid("Id").defaultRandom().primaryKey().notNull(),
	title: text("Title").notNull(),
	organisationId: uuid("OrganisationId"),
	description: text("Description"),
	isVerified: boolean("IsVerified").default(sql`false`).notNull(),
	startDate: date("StartDate").notNull(),
	endDate: date("EndDate"),
	organisationName: text("OrganisationName"),
	resumeId: uuid("ResumeId").notNull(),
	isCurrent: boolean("IsCurrent").default(sql`true`).notNull(),
	verificationStatus: integer("VerificationStatus").default(sql`1`).notNull(),
	metadata: jsonb("Metadata").default(sql`'{}'`).notNull(),
	skillId: integer("SkillId"),
	yearsOfExperience: integer("YearsOfExperience"),
},
(table) => {
	return {
		pkey: uniqueIndex("WorkExperience_pkey").on(table.id),
	}
});

export const __drizzleMigrationsInDrizzle = drizzle.table("__drizzle_migrations", {
	id: serial("id").primaryKey().notNull(),
	hash: text("hash").notNull(),
	createdAt: bigint("created_at", { mode: "number" }),
},
(table) => {
	return {
		pkey: uniqueIndex("__drizzle_migrations_pkey").on(table.id),
	}
});

export const eventInvocationLogsInHdbCatalog = hdbCatalog.table("event_invocation_logs", {
	id: text("id").default(sql`hdb_catalog.gen_hasura_uuid()`).primaryKey().notNull(),
	eventId: text("event_id"),
	status: integer("status"),
	request: json("request"),
	response: json("response"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	triggerName: text("trigger_name"),
},
(table) => {
	return {
		eventIdIdx: index("event_invocation_logs_event_id_idx").on(table.eventId),
		pkey: uniqueIndex("event_invocation_logs_pkey").on(table.id),
	}
});

export const eventLogInHdbCatalog = hdbCatalog.table("event_log", {
	id: text("id").default(sql`hdb_catalog.gen_hasura_uuid()`).primaryKey().notNull(),
	schemaName: text("schema_name").notNull(),
	tableName: text("table_name").notNull(),
	triggerName: text("trigger_name").notNull(),
	payload: jsonb("payload").notNull(),
	delivered: boolean("delivered").default(sql`false`).notNull(),
	error: boolean("error").default(sql`false`).notNull(),
	tries: integer("tries").default(sql`0`).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	locked: timestamp("locked", { withTimezone: true, mode: 'string' }),
	nextRetryAt: timestamp("next_retry_at", { mode: 'string' }),
	archived: boolean("archived").default(sql`false`).notNull(),
},
(table) => {
	return {
		fetchEvents: index("event_log_fetch_events").on(table.locked, table.nextRetryAt, table.createdAt),
		pkey: uniqueIndex("event_log_pkey").on(table.id),
		triggerNameIdx: index("event_log_trigger_name_idx").on(table.triggerName),
	}
});

export const hdbActionLogInHdbCatalog = hdbCatalog.table("hdb_action_log", {
	id: uuid("id").default(sql`hdb_catalog.gen_hasura_uuid()`).primaryKey().notNull(),
	actionName: text("action_name"),
	inputPayload: jsonb("input_payload").notNull(),
	requestHeaders: jsonb("request_headers").notNull(),
	sessionVariables: jsonb("session_variables").notNull(),
	responsePayload: jsonb("response_payload"),
	errors: jsonb("errors"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	responseReceivedAt: timestamp("response_received_at", { withTimezone: true, mode: 'string' }),
	status: text("status").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("hdb_action_log_pkey").on(table.id),
	}
});

export const hdbCronEventInvocationLogsInHdbCatalog = hdbCatalog.table("hdb_cron_event_invocation_logs", {
	id: text("id").default(sql`hdb_catalog.gen_hasura_uuid()`).primaryKey().notNull(),
	eventId: text("event_id"),
	status: integer("status"),
	request: json("request"),
	response: json("response"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		hdbCronEventInvocationEventId: index("hdb_cron_event_invocation_event_id").on(table.eventId),
		pkey: uniqueIndex("hdb_cron_event_invocation_logs_pkey").on(table.id),
	}
});

export const hdbCronEventsInHdbCatalog = hdbCatalog.table("hdb_cron_events", {
	id: text("id").default(sql`hdb_catalog.gen_hasura_uuid()`).primaryKey().notNull(),
	triggerName: text("trigger_name").notNull(),
	scheduledTime: timestamp("scheduled_time", { withTimezone: true, mode: 'string' }).notNull(),
	status: text("status").default(sql`'scheduled'`).notNull(),
	tries: integer("tries").default(sql`0`).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	nextRetryAt: timestamp("next_retry_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		hdbCronEventStatus: index("hdb_cron_event_status").on(table.status),
		pkey: uniqueIndex("hdb_cron_events_pkey").on(table.id),
	}
});

export const hdbEventLogCleanupsInHdbCatalog = hdbCatalog.table("hdb_event_log_cleanups", {
	id: text("id").default(sql`hdb_catalog.gen_hasura_uuid()`).primaryKey().notNull(),
	triggerName: text("trigger_name").notNull(),
	scheduledAt: timestamp("scheduled_at", { mode: 'string' }).notNull(),
	deletedEventLogs: integer("deleted_event_logs"),
	deletedEventInvocationLogs: integer("deleted_event_invocation_logs"),
	status: text("status").notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("hdb_event_log_cleanups_pkey").on(table.id),
		triggerNameScheduledAtKey: uniqueIndex("hdb_event_log_cleanups_trigger_name_scheduled_at_key").on(table.triggerName, table.scheduledAt),
	}
});

export const hdbMetadataInHdbCatalog = hdbCatalog.table("hdb_metadata", {
	id: integer("id").primaryKey().notNull(),
	metadata: json("metadata").notNull(),
	resourceVersion: integer("resource_version").default(sql`1`).notNull(),
},
(table) => {
	return {
		pkey: uniqueIndex("hdb_metadata_pkey").on(table.id),
		resourceVersionKey: uniqueIndex("hdb_metadata_resource_version_key").on(table.resourceVersion),
	}
});

export const hdbScheduledEventInvocationLogsInHdbCatalog = hdbCatalog.table("hdb_scheduled_event_invocation_logs", {
	id: text("id").default(sql`hdb_catalog.gen_hasura_uuid()`).primaryKey().notNull(),
	eventId: text("event_id"),
	status: integer("status"),
	request: json("request"),
	response: json("response"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		pkey: uniqueIndex("hdb_scheduled_event_invocation_logs_pkey").on(table.id),
	}
});

export const hdbScheduledEventsInHdbCatalog = hdbCatalog.table("hdb_scheduled_events", {
	id: text("id").default(sql`hdb_catalog.gen_hasura_uuid()`).primaryKey().notNull(),
	webhookConf: json("webhook_conf").notNull(),
	scheduledTime: timestamp("scheduled_time", { withTimezone: true, mode: 'string' }).notNull(),
	retryConf: json("retry_conf"),
	payload: json("payload"),
	headerConf: json("header_conf"),
	status: text("status").default(sql`'scheduled'`).notNull(),
	tries: integer("tries").default(sql`0`).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	nextRetryAt: timestamp("next_retry_at", { withTimezone: true, mode: 'string' }),
	comment: text("comment"),
},
(table) => {
	return {
		hdbScheduledEventStatus: index("hdb_scheduled_event_status").on(table.status),
		pkey: uniqueIndex("hdb_scheduled_events_pkey").on(table.id),
	}
});

export const hdbSchemaNotificationsInHdbCatalog = hdbCatalog.table("hdb_schema_notifications", {
	id: integer("id").primaryKey().notNull(),
	notification: json("notification").notNull(),
	resourceVersion: integer("resource_version").default(sql`1`).notNull(),
	instanceId: uuid("instance_id").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		pkey: uniqueIndex("hdb_schema_notifications_pkey").on(table.id),
	}
});

export const hdbSourceCatalogVersionInHdbCatalog = hdbCatalog.table("hdb_source_catalog_version", {
	version: text("version").notNull(),
	upgradedOn: timestamp("upgraded_on", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		oneRow: uniqueIndex("hdb_source_catalog_version_one_row").on(table.versionIsNotNull),
	}
});

export const hdbVersionInHdbCatalog = hdbCatalog.table("hdb_version", {
	hasuraUuid: uuid("hasura_uuid").default(sql`hdb_catalog.gen_hasura_uuid()`).primaryKey().notNull(),
	version: text("version").notNull(),
	upgradedOn: timestamp("upgraded_on", { withTimezone: true, mode: 'string' }).notNull(),
	cliState: jsonb("cli_state").default(sql`'{}'`).notNull(),
	consoleState: jsonb("console_state").default(sql`'{}'`).notNull(),
	eeClientId: text("ee_client_id"),
	eeClientSecret: text("ee_client_secret"),
},
(table) => {
	return {
		oneRow: uniqueIndex("hdb_version_one_row").on(table.versionIsNotNull),
		pkey: uniqueIndex("hdb_version_pkey").on(table.hasuraUuid),
	}
});export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({one, many}) => ({
	accounts: many(account),
	aiTokenUsageLogs: many(aiTokenUsageLogs),
	banners: many(banner),
	certificates: many(certificate),
	deactivatedAccounts: many(deactivatedAccounts),
	experienceSubmissions: many(experienceSubmission),
	groups: many(group),
	hiringTemplates: many(hiringTemplates),
	invitations: many(invitation),
	jobs: many(job),
	jobSubmissions: many(jobSubmission),
	organisations: many(organisation, {
		relationName: "organisation_createdBy_user_id"
	}),
	pathwaySubmissions: many(pathwaySubmissions),
	premiumRequests: many(premiumRequest),
	prescreens: many(prescreen),
	prescreenAnswers: many(prescreenAnswer),
	programSubmissions: many(programSubmissions),
	referrals_referred: many(referral, {
		relationName: "referral_referred_user_id"
	}),
	referrals_userId: many(referral, {
		relationName: "referral_userId_user_id"
	}),
	resumes: many(resume),
	sessions: many(session),
	sharedCandidateLists_accessGrantedBy: many(sharedCandidateList, {
		relationName: "sharedCandidateList_accessGrantedBy_user_id"
	}),
	sharedCandidateLists_accessRequestedBy: many(sharedCandidateList, {
		relationName: "sharedCandidateList_accessRequestedBy_user_id"
	}),
	sharedCandidateLists_accessRevokedBy: many(sharedCandidateList, {
		relationName: "sharedCandidateList_accessRevokedBy_user_id"
	}),
	sharedCandidateLists_sharedByAdminId: many(sharedCandidateList, {
		relationName: "sharedCandidateList_sharedByAdminId_user_id"
	}),
	sharedCandidateLists_termsAcceptedByUserId: many(sharedCandidateList, {
		relationName: "sharedCandidateList_termsAcceptedByUserId_user_id"
	}),
	submissions_gradedBy: many(submission, {
		relationName: "submission_gradedBy_user_id"
	}),
	submissions_userId: many(submission, {
		relationName: "submission_userId_user_id"
	}),
	submissionAnswers: many(submissionAnswer),
	talentDocuments: many(talentDocuments),
	tasks: many(task),
	taskSubmissions_gradedBy: many(taskSubmissions, {
		relationName: "taskSubmissions_gradedBy_user_id"
	}),
	taskSubmissions_userId: many(taskSubmissions, {
		relationName: "taskSubmissions_userId_user_id"
	}),
	mode: one(mode, {
		fields: [user.mode],
		references: [mode.id]
	}),
	organisation: one(organisation, {
		fields: [user.organisationId],
		references: [organisation.id],
		relationName: "user_organisationId_organisation_id"
	}),
	organisationInviteStatus: one(organisationInviteStatus, {
		fields: [user.organisationInviteStatus],
		references: [organisationInviteStatus.value]
	}),
	planMode: one(planMode, {
		fields: [user.plan],
		references: [planMode.mode]
	}),
	role: one(role, {
		fields: [user.roleId],
		references: [role.id]
	}),
	subRole: one(subRole, {
		fields: [user.subRoleId],
		references: [subRole.id]
	}),
	userCategories: many(userCategory),
	userEmailPreferences: many(userEmailPreference),
	userGroups: many(userGroup),
	userHiringStatuses: many(userHiringStatus),
	userInterests: many(userInterest),
	userSubSkills: many(userSubSkill),
	whatsappVerifications: many(whatsappVerification),
}));

export const aiTokenUsageLogsRelations = relations(aiTokenUsageLogs, ({one}) => ({
	organisation: one(organisation, {
		fields: [aiTokenUsageLogs.organisationId],
		references: [organisation.id]
	}),
	user: one(user, {
		fields: [aiTokenUsageLogs.userId],
		references: [user.id]
	}),
}));

export const organisationRelations = relations(organisation, ({one, many}) => ({
	aiTokenUsageLogs: many(aiTokenUsageLogs),
	companyOnboardings: many(companyOnboarding),
	companySignatures: many(companySignatures),
	experiences: many(experience),
	groups: many(group),
	hiringStatuses: many(hiringStatus),
	hiringTemplates: many(hiringTemplates),
	institutions: many(institution),
	invitations: many(invitation),
	jobs: many(job),
	openPositions: many(openPosition),
	user: one(user, {
		fields: [organisation.createdBy],
		references: [user.id],
		relationName: "organisation_createdBy_user_id"
	}),
	planMode: one(planMode, {
		fields: [organisation.plan],
		references: [planMode.mode]
	}),
	organisationType: one(organisationType, {
		fields: [organisation.type],
		references: [organisationType.id]
	}),
	organisationInterests: many(organisationInterest),
	pathways: many(pathways),
	prescreens: many(prescreen),
	programs: many(program),
	sharedCandidateLists: many(sharedCandidateList),
	tasks_organisationId: many(task),
	tasks_organisationId: many(tasks),
	templates: many(template),
	users: many(user, {
		relationName: "user_organisationId_organisation_id"
	}),
	userHiringStatuses: many(userHiringStatus),
	workExperiences: many(workExperience),
}));

export const bannerRelations = relations(banner, ({one}) => ({
	user: one(user, {
		fields: [banner.userId],
		references: [user.id]
	}),
}));

export const bookmarkRelations = relations(bookmark, ({one}) => ({
	resume: one(resume, {
		fields: [bookmark.studentId],
		references: [resume.id]
	}),
	task: one(task, {
		fields: [bookmark.taskId],
		references: [task.id]
	}),
}));

export const resumeRelations = relations(resume, ({one, many}) => ({
	bookmarks: many(bookmark),
	educations: many(education),
	userAvailability: one(userAvailability, {
		fields: [resume.availability],
		references: [userAvailability.id]
	}),
	user: one(user, {
		fields: [resume.userId],
		references: [user.id]
	}),
	resumeLanguages: many(resumeLanguage),
	resumeSkills: many(resumeSkill),
	workExperiences: many(workExperience),
}));

export const taskRelations = relations(task, ({one, many}) => ({
	bookmarks: many(bookmark),
	jobs: many(job),
	questions: many(question),
	submissions: many(submission),
	difficulty: one(difficulty, {
		fields: [task.difficulty],
		references: [difficulty.id]
	}),
	organisation: one(organisation, {
		fields: [task.organisationId],
		references: [organisation.id]
	}),
	skill: one(skill, {
		fields: [task.skillId],
		references: [skill.id]
	}),
	taskStatus: one(taskStatus, {
		fields: [task.status],
		references: [taskStatus.id]
	}),
	template: one(template, {
		fields: [task.templateId],
		references: [template.id]
	}),
	contentType: one(contentType, {
		fields: [task.type],
		references: [contentType.id]
	}),
	user: one(user, {
		fields: [task.userId],
		references: [user.id]
	}),
	taskCategories: many(taskCategory),
	taskExperiences: many(taskExperience),
	taskRubrics: many(taskRubric),
	taskSubSkills: many(taskSubSkill),
}));

export const categoryRelations = relations(category, ({one, many}) => ({
	category: one(category, {
		fields: [category.parent],
		references: [category.id],
		relationName: "category_parent_category_id"
	}),
	categories: many(category, {
		relationName: "category_parent_category_id"
	}),
	experienceCategories: many(experienceCategory),
	taskCategories: many(taskCategory),
	userCategories: many(userCategory),
}));

export const certificateRelations = relations(certificate, ({one, many}) => ({
	experienceSubmission: one(experienceSubmission, {
		fields: [certificate.experienceSubmissionId],
		references: [experienceSubmission.id]
	}),
	pathwaySubmission: one(pathwaySubmissions, {
		fields: [certificate.pathwaySubmissionId],
		references: [pathwaySubmissions.id],
		relationName: "certificate_pathwaySubmissionId_pathwaySubmissions_id"
	}),
	programSubmission: one(programSubmissions, {
		fields: [certificate.programSubmissionId],
		references: [programSubmissions.id],
		relationName: "certificate_programSubmissionId_programSubmissions_id"
	}),
	user: one(user, {
		fields: [certificate.userId],
		references: [user.id]
	}),
	pathwaySubmissions: many(pathwaySubmissions, {
		relationName: "pathwaySubmissions_certificateId_certificate_id"
	}),
	programSubmissions: many(programSubmissions, {
		relationName: "programSubmissions_certificateId_certificate_id"
	}),
}));

export const experienceSubmissionRelations = relations(experienceSubmission, ({one, many}) => ({
	certificates: many(certificate),
	experience: one(experience, {
		fields: [experienceSubmission.experienceId],
		references: [experience.id]
	}),
	gradingStatus_gradingStatus: one(gradingStatus, {
		fields: [experienceSubmission.gradingStatus],
		references: [gradingStatus.id],
		relationName: "experienceSubmission_gradingStatus_gradingStatus_id"
	}),
	gradingStatus_status: one(gradingStatus, {
		fields: [experienceSubmission.status],
		references: [gradingStatus.id],
		relationName: "experienceSubmission_status_gradingStatus_id"
	}),
	user: one(user, {
		fields: [experienceSubmission.userId],
		references: [user.id]
	}),
	experienceTaskSubmissions: many(experienceTaskSubmission),
	jobSubmissions: many(jobSubmission),
	pathwayExperienceSubmissions: many(pathwayExperienceSubmission),
	prescreenAnswers: many(prescreenAnswer),
}));

export const pathwaySubmissionsRelations = relations(pathwaySubmissions, ({one, many}) => ({
	certificates: many(certificate, {
		relationName: "certificate_pathwaySubmissionId_pathwaySubmissions_id"
	}),
	certificate: one(certificate, {
		fields: [pathwaySubmissions.certificateId],
		references: [certificate.id],
		relationName: "pathwaySubmissions_certificateId_certificate_id"
	}),
	pathway: one(pathways, {
		fields: [pathwaySubmissions.pathwayId],
		references: [pathways.id]
	}),
	user: one(user, {
		fields: [pathwaySubmissions.userId],
		references: [user.id]
	}),
}));

export const programSubmissionsRelations = relations(programSubmissions, ({one, many}) => ({
	certificates: many(certificate, {
		relationName: "certificate_programSubmissionId_programSubmissions_id"
	}),
	certificate: one(certificate, {
		fields: [programSubmissions.certificateId],
		references: [certificate.id],
		relationName: "programSubmissions_certificateId_certificate_id"
	}),
	prescreenAnswer: one(prescreenAnswer, {
		fields: [programSubmissions.prescreenAnswerId],
		references: [prescreenAnswer.id]
	}),
	program: one(program, {
		fields: [programSubmissions.programId],
		references: [program.id]
	}),
	user: one(user, {
		fields: [programSubmissions.userId],
		references: [user.id]
	}),
}));

export const companyOnboardingRelations = relations(companyOnboarding, ({one}) => ({
	organisation: one(organisation, {
		fields: [companyOnboarding.organisationId],
		references: [organisation.id]
	}),
}));

export const companySignaturesRelations = relations(companySignatures, ({one, many}) => ({
	organisation: one(organisation, {
		fields: [companySignatures.organisationId],
		references: [organisation.id]
	}),
	experienceSignatures: many(experienceSignatures),
}));

export const deactivatedAccountsRelations = relations(deactivatedAccounts, ({one}) => ({
	user: one(user, {
		fields: [deactivatedAccounts.deactivatedBy],
		references: [user.id]
	}),
}));

export const educationRelations = relations(education, ({one}) => ({
	institution: one(institution, {
		fields: [education.institutionId],
		references: [institution.id]
	}),
	resume: one(resume, {
		fields: [education.resumeId],
		references: [resume.id]
	}),
}));

export const institutionRelations = relations(institution, ({one, many}) => ({
	educations: many(education),
	organisation: one(organisation, {
		fields: [institution.organisationId],
		references: [organisation.id]
	}),
}));

export const experienceRelations = relations(experience, ({one, many}) => ({
	difficulty: one(difficulty, {
		fields: [experience.difficulty],
		references: [difficulty.id]
	}),
	organisation: one(organisation, {
		fields: [experience.organisationId],
		references: [organisation.id]
	}),
	prescreen: one(prescreen, {
		fields: [experience.prescreenId],
		references: [prescreen.id]
	}),
	taskStatus: one(taskStatus, {
		fields: [experience.status],
		references: [taskStatus.id]
	}),
	experienceType: one(experienceType, {
		fields: [experience.type],
		references: [experienceType.id]
	}),
	experienceCategories: many(experienceCategory),
	experienceSignatures: many(experienceSignatures),
	experienceSkills: many(experienceSkill),
	experienceSubmissions: many(experienceSubmission),
	groupExperiences: many(groupExperience),
	jobExperiences: many(jobExperience),
	prescreenAnswers: many(prescreenAnswer),
	programPrices: many(programPrice),
	taskExperiences: many(taskExperience),
}));

export const difficultyRelations = relations(difficulty, ({many}) => ({
	experiences: many(experience),
	tasks: many(task),
}));

export const prescreenRelations = relations(prescreen, ({one, many}) => ({
	experiences: many(experience),
	jobPrescreens: many(jobPrescreen),
	user: one(user, {
		fields: [prescreen.createdBy],
		references: [user.id]
	}),
	organisation: one(organisation, {
		fields: [prescreen.organisationId],
		references: [organisation.id]
	}),
	prescreenAnswers: many(prescreenAnswer),
}));

export const taskStatusRelations = relations(taskStatus, ({many}) => ({
	experiences: many(experience),
	programs: many(program),
	tasks: many(task),
}));

export const experienceTypeRelations = relations(experienceType, ({many}) => ({
	experiences: many(experience),
}));

export const experienceCategoryRelations = relations(experienceCategory, ({one}) => ({
	category: one(category, {
		fields: [experienceCategory.categoryId],
		references: [category.id]
	}),
	experience: one(experience, {
		fields: [experienceCategory.experienceId],
		references: [experience.id]
	}),
}));

export const experienceSignaturesRelations = relations(experienceSignatures, ({one}) => ({
	experience: one(experience, {
		fields: [experienceSignatures.experienceId],
		references: [experience.id]
	}),
	companySignature: one(companySignatures, {
		fields: [experienceSignatures.signatureId],
		references: [companySignatures.id]
	}),
}));

export const experienceSkillRelations = relations(experienceSkill, ({one}) => ({
	experience: one(experience, {
		fields: [experienceSkill.experienceId],
		references: [experience.id]
	}),
	skill: one(skill, {
		fields: [experienceSkill.skillId],
		references: [skill.id]
	}),
}));

export const skillRelations = relations(skill, ({many}) => ({
	experienceSkills: many(experienceSkill),
	jobSkills: many(jobSkill),
	organisationInterests: many(organisationInterest),
	pathways: many(pathways),
	resumeSkills: many(resumeSkill),
	subSkills: many(subSkill),
	tasks_skillId: many(task),
	tasks_skillId: many(tasks),
	userInterests: many(userInterest),
	userSubSkills: many(userSubSkill),
	workExperiences: many(workExperience),
}));

export const gradingStatusRelations = relations(gradingStatus, ({many}) => ({
	experienceSubmissions_gradingStatus: many(experienceSubmission, {
		relationName: "experienceSubmission_gradingStatus_gradingStatus_id"
	}),
	experienceSubmissions_status: many(experienceSubmission, {
		relationName: "experienceSubmission_status_gradingStatus_id"
	}),
	submissions: many(submission),
}));

export const experienceTaskSubmissionRelations = relations(experienceTaskSubmission, ({one}) => ({
	experienceSubmission: one(experienceSubmission, {
		fields: [experienceTaskSubmission.experienceSubmissionId],
		references: [experienceSubmission.id]
	}),
	submission: one(submission, {
		fields: [experienceTaskSubmission.submissionId],
		references: [submission.id]
	}),
}));

export const submissionRelations = relations(submission, ({one, many}) => ({
	experienceTaskSubmissions: many(experienceTaskSubmission),
	grades: many(grade),
	user_gradedBy: one(user, {
		fields: [submission.gradedBy],
		references: [user.id],
		relationName: "submission_gradedBy_user_id"
	}),
	gradingStatus: one(gradingStatus, {
		fields: [submission.status],
		references: [gradingStatus.id]
	}),
	task: one(task, {
		fields: [submission.taskId],
		references: [task.id]
	}),
	user_userId: one(user, {
		fields: [submission.userId],
		references: [user.id],
		relationName: "submission_userId_user_id"
	}),
	submissionAnswers: many(submissionAnswer),
}));

export const gradeRelations = relations(grade, ({one}) => ({
	question: one(question, {
		fields: [grade.questionId],
		references: [question.id]
	}),
	submission: one(submission, {
		fields: [grade.submissionId],
		references: [submission.id]
	}),
	subSkill: one(subSkill, {
		fields: [grade.subSkillId],
		references: [subSkill.id]
	}),
}));

export const questionRelations = relations(question, ({one, many}) => ({
	grades: many(grade),
	media: many(media),
	questionType: one(questionType, {
		fields: [question.qType],
		references: [questionType.id]
	}),
	subSkill: one(subSkill, {
		fields: [question.subSkillId],
		references: [subSkill.id]
	}),
	task: one(task, {
		fields: [question.taskId],
		references: [task.id]
	}),
	questionChoices: many(questionChoice),
	submissionAnswers: many(submissionAnswer),
}));

export const subSkillRelations = relations(subSkill, ({one, many}) => ({
	grades: many(grade),
	jobSubSkills: many(jobSubSkill),
	questions: many(question),
	skill: one(skill, {
		fields: [subSkill.skillId],
		references: [skill.id]
	}),
	subSkillResponses: many(subSkillResponse),
	taskSubSkills: many(taskSubSkill),
	userSubSkills: many(userSubSkill),
}));

export const groupRelations = relations(group, ({one, many}) => ({
	user: one(user, {
		fields: [group.createdBy],
		references: [user.id]
	}),
	organisation: one(organisation, {
		fields: [group.organisationId],
		references: [organisation.id]
	}),
	groupExperiences: many(groupExperience),
	userGroups: many(userGroup),
}));

export const groupExperienceRelations = relations(groupExperience, ({one}) => ({
	experience: one(experience, {
		fields: [groupExperience.experienceId],
		references: [experience.id]
	}),
	group: one(group, {
		fields: [groupExperience.groupId],
		references: [group.id]
	}),
}));

export const hiringStatusRelations = relations(hiringStatus, ({one, many}) => ({
	job: one(job, {
		fields: [hiringStatus.jobId],
		references: [job.id]
	}),
	organisation: one(organisation, {
		fields: [hiringStatus.organisationId],
		references: [organisation.id]
	}),
	jobSubmissions: many(jobSubmission),
}));

export const jobRelations = relations(job, ({one, many}) => ({
	hiringStatuses: many(hiringStatus),
	user: one(user, {
		fields: [job.createdBy],
		references: [user.id]
	}),
	hiringTemplate: one(hiringTemplates, {
		fields: [job.hiringTemplateId],
		references: [hiringTemplates.id]
	}),
	organisation: one(organisation, {
		fields: [job.organisationId],
		references: [organisation.id]
	}),
	task: one(task, {
		fields: [job.taskId],
		references: [task.id]
	}),
	jobExperiences: many(jobExperience),
	jobPrescreens: many(jobPrescreen),
	jobSkills: many(jobSkill),
	jobSubmissions: many(jobSubmission),
	jobSubSkills: many(jobSubSkill),
}));

export const hiringTemplatesRelations = relations(hiringTemplates, ({one, many}) => ({
	organisation: one(organisation, {
		fields: [hiringTemplates.organisationId],
		references: [organisation.id]
	}),
	user: one(user, {
		fields: [hiringTemplates.userId],
		references: [user.id]
	}),
	jobs: many(job),
}));

export const invitationRelations = relations(invitation, ({one}) => ({
	user: one(user, {
		fields: [invitation.invitedBy],
		references: [user.id]
	}),
	organisation: one(organisation, {
		fields: [invitation.organisationId],
		references: [organisation.id]
	}),
	role: one(role, {
		fields: [invitation.role],
		references: [role.id]
	}),
}));

export const roleRelations = relations(role, ({many}) => ({
	invitations: many(invitation),
	subRoles: many(subRole),
	users: many(user),
}));

export const jobExperienceRelations = relations(jobExperience, ({one}) => ({
	experience: one(experience, {
		fields: [jobExperience.experienceId],
		references: [experience.id]
	}),
	job: one(job, {
		fields: [jobExperience.jobId],
		references: [job.id]
	}),
}));

export const jobPrescreenRelations = relations(jobPrescreen, ({one}) => ({
	job: one(job, {
		fields: [jobPrescreen.jobId],
		references: [job.id]
	}),
	prescreen: one(prescreen, {
		fields: [jobPrescreen.prescreenId],
		references: [prescreen.id]
	}),
}));

export const jobSkillRelations = relations(jobSkill, ({one}) => ({
	job: one(job, {
		fields: [jobSkill.jobId],
		references: [job.id]
	}),
	skill: one(skill, {
		fields: [jobSkill.skillId],
		references: [skill.id]
	}),
}));

export const jobSubmissionRelations = relations(jobSubmission, ({one}) => ({
	experienceSubmission: one(experienceSubmission, {
		fields: [jobSubmission.experienceSubmissionId],
		references: [experienceSubmission.id]
	}),
	job: one(job, {
		fields: [jobSubmission.jobId],
		references: [job.id]
	}),
	prescreenAnswer: one(prescreenAnswer, {
		fields: [jobSubmission.prescreenAnswerId],
		references: [prescreenAnswer.id]
	}),
	hiringStatus: one(hiringStatus, {
		fields: [jobSubmission.status],
		references: [hiringStatus.id]
	}),
	user: one(user, {
		fields: [jobSubmission.userId],
		references: [user.id]
	}),
}));

export const prescreenAnswerRelations = relations(prescreenAnswer, ({one, many}) => ({
	jobSubmissions: many(jobSubmission),
	experience: one(experience, {
		fields: [prescreenAnswer.experienceId],
		references: [experience.id]
	}),
	experienceSubmission: one(experienceSubmission, {
		fields: [prescreenAnswer.experienceSubmissionId],
		references: [experienceSubmission.id]
	}),
	prescreen: one(prescreen, {
		fields: [prescreenAnswer.prescreenId],
		references: [prescreen.id]
	}),
	user: one(user, {
		fields: [prescreenAnswer.submittedBy],
		references: [user.id]
	}),
	programSubmissions: many(programSubmissions),
}));

export const jobSubSkillRelations = relations(jobSubSkill, ({one}) => ({
	job: one(job, {
		fields: [jobSubSkill.jobId],
		references: [job.id]
	}),
	subSkill: one(subSkill, {
		fields: [jobSubSkill.subSkillId],
		references: [subSkill.id]
	}),
}));

export const mediaRelations = relations(media, ({one}) => ({
	question: one(question, {
		fields: [media.questionId],
		references: [question.id]
	}),
	mediaType: one(mediaType, {
		fields: [media.type],
		references: [mediaType.id]
	}),
}));

export const mediaTypeRelations = relations(mediaType, ({many}) => ({
	media: many(media),
}));

export const openPositionRelations = relations(openPosition, ({one}) => ({
	organisation: one(organisation, {
		fields: [openPosition.organisationId],
		references: [organisation.id]
	}),
}));

export const planModeRelations = relations(planMode, ({many}) => ({
	organisations: many(organisation),
	users: many(user),
}));

export const organisationTypeRelations = relations(organisationType, ({many}) => ({
	organisations: many(organisation),
}));

export const organisationInterestRelations = relations(organisationInterest, ({one}) => ({
	organisation: one(organisation, {
		fields: [organisationInterest.organisationId],
		references: [organisation.id]
	}),
	skill: one(skill, {
		fields: [organisationInterest.skillId],
		references: [skill.id]
	}),
}));

export const pathwayExperienceSubmissionRelations = relations(pathwayExperienceSubmission, ({one}) => ({
	experienceSubmission: one(experienceSubmission, {
		fields: [pathwayExperienceSubmission.experienceSubmissionId],
		references: [experienceSubmission.id]
	}),
}));

export const pathwaysRelations = relations(pathways, ({one, many}) => ({
	organisation: one(organisation, {
		fields: [pathways.organisationId],
		references: [organisation.id]
	}),
	skill: one(skill, {
		fields: [pathways.skillId],
		references: [skill.id]
	}),
	pathwaySubmissions: many(pathwaySubmissions),
}));

export const premiumRequestRelations = relations(premiumRequest, ({one}) => ({
	user: one(user, {
		fields: [premiumRequest.userId],
		references: [user.id]
	}),
}));

export const programRelations = relations(program, ({one, many}) => ({
	organisation: one(organisation, {
		fields: [program.organisationId],
		references: [organisation.id]
	}),
	taskStatus: one(taskStatus, {
		fields: [program.status],
		references: [taskStatus.id]
	}),
	programType: one(programType, {
		fields: [program.type],
		references: [programType.id]
	}),
	programSubmissions: many(programSubmissions),
}));

export const programTypeRelations = relations(programType, ({many}) => ({
	programs: many(program),
}));

export const programPriceRelations = relations(programPrice, ({one}) => ({
	experience: one(experience, {
		fields: [programPrice.experienceId],
		references: [experience.id]
	}),
}));

export const questionTypeRelations = relations(questionType, ({many}) => ({
	questions: many(question),
}));

export const questionChoiceRelations = relations(questionChoice, ({one}) => ({
	question: one(question, {
		fields: [questionChoice.questionId],
		references: [question.id]
	}),
}));

export const referralRelations = relations(referral, ({one}) => ({
	user_referred: one(user, {
		fields: [referral.referred],
		references: [user.id],
		relationName: "referral_referred_user_id"
	}),
	user_userId: one(user, {
		fields: [referral.userId],
		references: [user.id],
		relationName: "referral_userId_user_id"
	}),
}));

export const userAvailabilityRelations = relations(userAvailability, ({many}) => ({
	resumes: many(resume),
}));

export const resumeLanguageRelations = relations(resumeLanguage, ({one}) => ({
	language: one(language, {
		fields: [resumeLanguage.languageId],
		references: [language.id]
	}),
	resume: one(resume, {
		fields: [resumeLanguage.resumeId],
		references: [resume.id]
	}),
}));

export const languageRelations = relations(language, ({many}) => ({
	resumeLanguages: many(resumeLanguage),
}));

export const resumeSkillRelations = relations(resumeSkill, ({one}) => ({
	resume: one(resume, {
		fields: [resumeSkill.resumeId],
		references: [resume.id]
	}),
	skill: one(skill, {
		fields: [resumeSkill.skillId],
		references: [skill.id]
	}),
}));

export const rubricResponseRelations = relations(rubricResponse, ({one}) => ({
	rubric: one(rubric, {
		fields: [rubricResponse.rubricId],
		references: [rubric.id]
	}),
}));

export const rubricRelations = relations(rubric, ({many}) => ({
	rubricResponses: many(rubricResponse),
	taskRubrics: many(taskRubric),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const sharedCandidateListRelations = relations(sharedCandidateList, ({one}) => ({
	user_accessGrantedBy: one(user, {
		fields: [sharedCandidateList.accessGrantedBy],
		references: [user.id],
		relationName: "sharedCandidateList_accessGrantedBy_user_id"
	}),
	user_accessRequestedBy: one(user, {
		fields: [sharedCandidateList.accessRequestedBy],
		references: [user.id],
		relationName: "sharedCandidateList_accessRequestedBy_user_id"
	}),
	user_accessRevokedBy: one(user, {
		fields: [sharedCandidateList.accessRevokedBy],
		references: [user.id],
		relationName: "sharedCandidateList_accessRevokedBy_user_id"
	}),
	organisation: one(organisation, {
		fields: [sharedCandidateList.organisationId],
		references: [organisation.id]
	}),
	user_sharedByAdminId: one(user, {
		fields: [sharedCandidateList.sharedByAdminId],
		references: [user.id],
		relationName: "sharedCandidateList_sharedByAdminId_user_id"
	}),
	user_termsAcceptedByUserId: one(user, {
		fields: [sharedCandidateList.termsAcceptedByUserId],
		references: [user.id],
		relationName: "sharedCandidateList_termsAcceptedByUserId_user_id"
	}),
}));

export const submissionAnswerRelations = relations(submissionAnswer, ({one}) => ({
	question: one(question, {
		fields: [submissionAnswer.questionId],
		references: [question.id]
	}),
	submission: one(submission, {
		fields: [submissionAnswer.submissionId],
		references: [submission.id]
	}),
	user: one(user, {
		fields: [submissionAnswer.userId],
		references: [user.id]
	}),
}));

export const subRoleRelations = relations(subRole, ({one, many}) => ({
	role: one(role, {
		fields: [subRole.roleId],
		references: [role.id]
	}),
	users: many(user),
}));

export const subSkillResponseRelations = relations(subSkillResponse, ({one}) => ({
	subSkill: one(subSkill, {
		fields: [subSkillResponse.subSkillId],
		references: [subSkill.id]
	}),
}));

export const talentDocumentsRelations = relations(talentDocuments, ({one, many}) => ({
	user: one(user, {
		fields: [talentDocuments.id],
		references: [user.id]
	}),
	talentVectors: many(talentVectors),
}));

export const talentVectorsRelations = relations(talentVectors, ({one}) => ({
	talentDocument: one(talentDocuments, {
		fields: [talentVectors.id],
		references: [talentDocuments.id]
	}),
}));

export const templateRelations = relations(template, ({one, many}) => ({
	tasks: many(task),
	organisation: one(organisation, {
		fields: [template.organisationId],
		references: [organisation.id]
	}),
}));

export const contentTypeRelations = relations(contentType, ({many}) => ({
	tasks: many(task),
}));

export const taskCategoryRelations = relations(taskCategory, ({one}) => ({
	category: one(category, {
		fields: [taskCategory.categoryId],
		references: [category.id]
	}),
	task: one(task, {
		fields: [taskCategory.taskId],
		references: [task.id]
	}),
}));

export const taskExperienceRelations = relations(taskExperience, ({one}) => ({
	experience: one(experience, {
		fields: [taskExperience.experienceId],
		references: [experience.id]
	}),
	task: one(task, {
		fields: [taskExperience.taskId],
		references: [task.id]
	}),
}));

export const taskRubricRelations = relations(taskRubric, ({one}) => ({
	rubric: one(rubric, {
		fields: [taskRubric.rubricId],
		references: [rubric.id]
	}),
	task: one(task, {
		fields: [taskRubric.taskId],
		references: [task.id]
	}),
}));

export const tasksRelations = relations(tasks, ({one, many}) => ({
	organisation: one(organisation, {
		fields: [tasks.organisationId],
		references: [organisation.id]
	}),
	skill: one(skill, {
		fields: [tasks.skillId],
		references: [skill.id]
	}),
	taskSubmissions: many(taskSubmissions),
}));

export const taskSubmissionsRelations = relations(taskSubmissions, ({one}) => ({
	user_gradedBy: one(user, {
		fields: [taskSubmissions.gradedBy],
		references: [user.id],
		relationName: "taskSubmissions_gradedBy_user_id"
	}),
	task: one(tasks, {
		fields: [taskSubmissions.taskId],
		references: [tasks.id]
	}),
	user_userId: one(user, {
		fields: [taskSubmissions.userId],
		references: [user.id],
		relationName: "taskSubmissions_userId_user_id"
	}),
}));

export const taskSubSkillRelations = relations(taskSubSkill, ({one}) => ({
	subSkill: one(subSkill, {
		fields: [taskSubSkill.subSkillId],
		references: [subSkill.id]
	}),
	task: one(task, {
		fields: [taskSubSkill.taskId],
		references: [task.id]
	}),
}));

export const modeRelations = relations(mode, ({many}) => ({
	users: many(user),
}));

export const organisationInviteStatusRelations = relations(organisationInviteStatus, ({many}) => ({
	users: many(user),
}));

export const userCategoryRelations = relations(userCategory, ({one}) => ({
	category: one(category, {
		fields: [userCategory.categoryId],
		references: [category.id]
	}),
	user: one(user, {
		fields: [userCategory.userId],
		references: [user.id]
	}),
}));

export const userEmailPreferenceRelations = relations(userEmailPreference, ({one}) => ({
	emailSubscription: one(emailSubscription, {
		fields: [userEmailPreference.subscriptionId],
		references: [emailSubscription.id]
	}),
	user: one(user, {
		fields: [userEmailPreference.userId],
		references: [user.id]
	}),
}));

export const emailSubscriptionRelations = relations(emailSubscription, ({many}) => ({
	userEmailPreferences: many(userEmailPreference),
}));

export const userGroupRelations = relations(userGroup, ({one}) => ({
	group: one(group, {
		fields: [userGroup.groupId],
		references: [group.id]
	}),
	user: one(user, {
		fields: [userGroup.userId],
		references: [user.id]
	}),
}));

export const userHiringStatusRelations = relations(userHiringStatus, ({one}) => ({
	organisation: one(organisation, {
		fields: [userHiringStatus.organisationId],
		references: [organisation.id]
	}),
	user: one(user, {
		fields: [userHiringStatus.userId],
		references: [user.id]
	}),
}));

export const userInterestRelations = relations(userInterest, ({one}) => ({
	skill: one(skill, {
		fields: [userInterest.skillId],
		references: [skill.id]
	}),
	user: one(user, {
		fields: [userInterest.userId],
		references: [user.id]
	}),
}));

export const userSubSkillRelations = relations(userSubSkill, ({one}) => ({
	skill: one(skill, {
		fields: [userSubSkill.skillId],
		references: [skill.id]
	}),
	subSkill: one(subSkill, {
		fields: [userSubSkill.subSkillId],
		references: [subSkill.id]
	}),
	user: one(user, {
		fields: [userSubSkill.userId],
		references: [user.id]
	}),
}));

export const whatsappVerificationRelations = relations(whatsappVerification, ({one}) => ({
	user: one(user, {
		fields: [whatsappVerification.userId],
		references: [user.id]
	}),
}));

export const workExperienceRelations = relations(workExperience, ({one}) => ({
	organisation: one(organisation, {
		fields: [workExperience.organisationId],
		references: [organisation.id]
	}),
	resume: one(resume, {
		fields: [workExperience.resumeId],
		references: [resume.id]
	}),
	skill: one(skill, {
		fields: [workExperience.skillId],
		references: [skill.id]
	}),
}));

export const hdbCronEventInvocationLogsInHdbCatalogRelations = relations(hdbCronEventInvocationLogsInHdbCatalog, ({one}) => ({
	hdbCronEventsInHdbCatalog: one(hdbCronEventsInHdbCatalog, {
		fields: [hdbCronEventInvocationLogsInHdbCatalog.eventId],
		references: [hdbCronEventsInHdbCatalog.id]
	}),
}));

export const hdbCronEventsInHdbCatalogRelations = relations(hdbCronEventsInHdbCatalog, ({many}) => ({
	hdbCronEventInvocationLogsInHdbCatalogs: many(hdbCronEventInvocationLogsInHdbCatalog),
}));

export const hdbScheduledEventInvocationLogsInHdbCatalogRelations = relations(hdbScheduledEventInvocationLogsInHdbCatalog, ({one}) => ({
	hdbScheduledEventsInHdbCatalog: one(hdbScheduledEventsInHdbCatalog, {
		fields: [hdbScheduledEventInvocationLogsInHdbCatalog.eventId],
		references: [hdbScheduledEventsInHdbCatalog.id]
	}),
}));

export const hdbScheduledEventsInHdbCatalogRelations = relations(hdbScheduledEventsInHdbCatalog, ({many}) => ({
	hdbScheduledEventInvocationLogsInHdbCatalogs: many(hdbScheduledEventInvocationLogsInHdbCatalog),
}));