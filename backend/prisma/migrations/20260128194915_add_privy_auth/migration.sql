/*
  Warnings:

  - A unique constraint covering the columns `[wallet_address]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[privy_user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "privy_user_id" VARCHAR(255),
ADD COLUMN     "wallet_address" VARCHAR(255),
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "users_privy_user_id_key" ON "users"("privy_user_id");

-- CreateIndex
CREATE INDEX "idx_users_wallet" ON "users"("wallet_address");

-- CreateIndex
CREATE INDEX "idx_users_privy_id" ON "users"("privy_user_id");
