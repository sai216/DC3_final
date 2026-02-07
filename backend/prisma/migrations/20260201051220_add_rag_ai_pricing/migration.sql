-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('pdf', 'terms', 'bundle', 'general');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('user', 'assistant', 'system');

-- CreateTable
CREATE TABLE "knowledge_base" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "document_type" "DocumentType" NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "title" VARCHAR(255),
    "category" VARCHAR(100),
    "version" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "initial_context" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "thought_signature" JSONB,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revenue_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_scales" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "revenue_min" DECIMAL(15,2),
    "revenue_max" DECIMAL(15,2),
    "multiplier" DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_scales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complexity_tiers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rating" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "adjustment_multiplier" DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "complexity_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_pricing" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bundle_id" VARCHAR(100) NOT NULL,
    "bundle_name" VARCHAR(255) NOT NULL,
    "revenue_category_id" UUID NOT NULL,
    "company_scale_id" UUID NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "base_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_kb_doc_type" ON "knowledge_base"("document_type");

-- CreateIndex
CREATE INDEX "idx_kb_category" ON "knowledge_base"("category");

-- CreateIndex
CREATE INDEX "idx_conversation_user" ON "conversations"("user_id");

-- CreateIndex
CREATE INDEX "idx_conversation_created" ON "conversations"("created_at");

-- CreateIndex
CREATE INDEX "idx_message_conversation" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "idx_message_timestamp" ON "messages"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_categories_name_key" ON "revenue_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_categories_code_key" ON "revenue_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "company_scales_name_key" ON "company_scales"("name");

-- CreateIndex
CREATE UNIQUE INDEX "company_scales_code_key" ON "company_scales"("code");

-- CreateIndex
CREATE UNIQUE INDEX "complexity_tiers_rating_key" ON "complexity_tiers"("rating");

-- CreateIndex
CREATE INDEX "idx_base_pricing_bundle" ON "base_pricing"("bundle_id");

-- CreateIndex
CREATE INDEX "idx_base_pricing_category" ON "base_pricing"("revenue_category_id");

-- CreateIndex
CREATE INDEX "idx_base_pricing_scale" ON "base_pricing"("company_scale_id");

-- CreateIndex
CREATE UNIQUE INDEX "base_pricing_bundle_id_revenue_category_id_company_scale_id_key" ON "base_pricing"("bundle_id", "revenue_category_id", "company_scale_id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_pricing" ADD CONSTRAINT "base_pricing_revenue_category_id_fkey" FOREIGN KEY ("revenue_category_id") REFERENCES "revenue_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_pricing" ADD CONSTRAINT "base_pricing_company_scale_id_fkey" FOREIGN KEY ("company_scale_id") REFERENCES "company_scales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
