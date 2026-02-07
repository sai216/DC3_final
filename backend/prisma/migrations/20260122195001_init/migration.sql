-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('creative', 'fullstack', 'web3', 'ai_automation');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('standard', 'urgent', 'critical');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('initiated', 'assessment_complete', 'quote_generated', 'strategy_call_booked', 'quote_accepted', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('pending', 'sent', 'accepted', 'declined', 'expired');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('email', 'whatsapp', 'phone');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_e164" VARCHAR(20),
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "whatsapp_verified" BOOLEAN NOT NULL DEFAULT false,
    "business_name" VARCHAR(255),
    "auth_stage" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "last_login" TIMESTAMPTZ(6),
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_assessments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "project_name" VARCHAR(255) NOT NULL,
    "project_type" "ProjectType" NOT NULL,
    "project_description" TEXT,
    "project_scope" JSONB,
    "budget_range" VARCHAR(50),
    "urgency" "Urgency",
    "complexity_score" DECIMAL(3,2),
    "status" "ProjectStatus" NOT NULL DEFAULT 'initiated',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_quotes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "base_rate" DECIMAL(10,2) NOT NULL,
    "complexity_adjustment" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "urgency_adjustment" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_estimate" DECIMAL(10,2) NOT NULL,
    "not_to_exceed" DECIMAL(10,2) NOT NULL,
    "estimated_timeline_weeks" INTEGER,
    "delivery_date" DATE,
    "payment_structure" JSONB,
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "accepted_at" TIMESTAMPTZ(6),
    "valid_until" DATE NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "project_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategy_calls" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "project_id" UUID,
    "google_event_id" VARCHAR(255),
    "scheduled_at" TIMESTAMPTZ(6) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 60,
    "meet_link" VARCHAR(500),
    "status" "CallStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "strategy_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50),
    "entity_id" UUID,
    "ip_address" INET,
    "user_agent" TEXT,
    "request_data" JSONB,
    "response_status" INTEGER,
    "logged_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "otp_type" "OtpType" NOT NULL,
    "otp_code" VARCHAR(6) NOT NULL,
    "destination" VARCHAR(255) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_phone" ON "users"("phone_e164");

-- CreateIndex
CREATE INDEX "idx_users_auth_stage" ON "users"("auth_stage");

-- CreateIndex
CREATE INDEX "idx_projects_user" ON "project_assessments"("user_id");

-- CreateIndex
CREATE INDEX "idx_projects_status" ON "project_assessments"("status");

-- CreateIndex
CREATE INDEX "idx_projects_type" ON "project_assessments"("project_type");

-- CreateIndex
CREATE INDEX "idx_quotes_project" ON "project_quotes"("project_id");

-- CreateIndex
CREATE INDEX "idx_quotes_user" ON "project_quotes"("user_id");

-- CreateIndex
CREATE INDEX "idx_quotes_status" ON "project_quotes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "strategy_calls_google_event_id_key" ON "strategy_calls"("google_event_id");

-- CreateIndex
CREATE INDEX "idx_strategy_calls_user" ON "strategy_calls"("user_id");

-- CreateIndex
CREATE INDEX "idx_strategy_calls_scheduled" ON "strategy_calls"("scheduled_at");

-- CreateIndex
CREATE INDEX "idx_audit_user" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_audit_action" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "idx_audit_logged" ON "audit_logs"("logged_at" DESC);

-- CreateIndex
CREATE INDEX "idx_otp_user" ON "otp_verifications"("user_id");

-- CreateIndex
CREATE INDEX "idx_otp_destination" ON "otp_verifications"("destination");

-- CreateIndex
CREATE INDEX "idx_otp_expires" ON "otp_verifications"("expires_at");

-- AddForeignKey
ALTER TABLE "project_assessments" ADD CONSTRAINT "project_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_quotes" ADD CONSTRAINT "project_quotes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_quotes" ADD CONSTRAINT "project_quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_calls" ADD CONSTRAINT "strategy_calls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_calls" ADD CONSTRAINT "strategy_calls_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project_assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_verifications" ADD CONSTRAINT "otp_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
