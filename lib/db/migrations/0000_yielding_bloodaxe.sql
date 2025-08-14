-- CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "talent_documents" (
	"id" varchar(191) PRIMARY KEY NOT ,
	"summary" text NOT NULL,
	"metadata" JSONB NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
