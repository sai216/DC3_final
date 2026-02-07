-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('draft', 'manifest_submitted', 'identity_verified', 'otp_verified', 'meeting_scheduled', 'submitted', 'under_review', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "storage_url" TEXT NOT NULL,
    "signed_url" TEXT,
    "signed_url_expiry" TIMESTAMPTZ(6),
    "bucket_path" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_manifests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "loom_url" TEXT,
    "docs_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "audit_manifests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_manifest_files" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manifest_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_manifest_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_identities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "linkedin_url" TEXT,
    "business_email" VARCHAR(255),
    "whatsapp_number" VARCHAR(20),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "audit_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "manifest_id" UUID,
    "identity_id" UUID,
    "meeting_id" UUID,
    "goals" JSONB,
    "status" "AuditStatus" NOT NULL DEFAULT 'draft',
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "google_meet_link" TEXT,
    "scheduled_date" TIMESTAMPTZ(6),
    "submitted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "audit_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_uploaded_files_user" ON "uploaded_files"("user_id");

-- CreateIndex
CREATE INDEX "idx_uploaded_files_created" ON "uploaded_files"("created_at");

-- CreateIndex
CREATE INDEX "idx_audit_manifest_user" ON "audit_manifests"("user_id");

-- CreateIndex
CREATE INDEX "idx_manifest_files_manifest" ON "audit_manifest_files"("manifest_id");

-- CreateIndex
CREATE INDEX "idx_manifest_files_file" ON "audit_manifest_files"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_manifest_files_manifest_id_file_id_key" ON "audit_manifest_files"("manifest_id", "file_id");

-- CreateIndex
CREATE INDEX "idx_audit_identity_user" ON "audit_identities"("user_id");

-- CreateIndex
CREATE INDEX "idx_audit_identity_email" ON "audit_identities"("business_email");

-- CreateIndex
CREATE INDEX "idx_audit_submission_user" ON "audit_submissions"("user_id");

-- CreateIndex
CREATE INDEX "idx_audit_submission_status" ON "audit_submissions"("status");

-- CreateIndex
CREATE INDEX "idx_audit_submission_created" ON "audit_submissions"("created_at");

-- AddForeignKey
ALTER TABLE "audit_manifest_files" ADD CONSTRAINT "audit_manifest_files_manifest_id_fkey" FOREIGN KEY ("manifest_id") REFERENCES "audit_manifests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_manifest_files" ADD CONSTRAINT "audit_manifest_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "uploaded_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_submissions" ADD CONSTRAINT "audit_submissions_manifest_id_fkey" FOREIGN KEY ("manifest_id") REFERENCES "audit_manifests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_submissions" ADD CONSTRAINT "audit_submissions_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "audit_identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
