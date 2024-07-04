/*
  Warnings:

  - The values [READ] on the enum `Action` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `GoogleCalendarEvent` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Action_new" AS ENUM ('CREATE', 'UPDATE', 'DELETE');
ALTER TABLE "GoogleCalendarEvent" ALTER COLUMN "action" TYPE "Action_new" USING ("action"::text::"Action_new");
ALTER TYPE "Action" RENAME TO "Action_old";
ALTER TYPE "Action_new" RENAME TO "Action";
DROP TYPE "Action_old";
COMMIT;

-- DropIndex
DROP INDEX "GoogleCalendarEvent_userId_idx";

-- AlterTable
ALTER TABLE "GoogleCalendarEvent" DROP COLUMN "userId";
