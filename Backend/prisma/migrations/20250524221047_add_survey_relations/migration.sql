/*
  Warnings:

  - You are about to drop the column `userid` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the `Options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Questions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Options" DROP CONSTRAINT "Options_questionsid_fkey";

-- DropForeignKey
ALTER TABLE "Questions" DROP CONSTRAINT "Questions_surveyid_fkey";

-- DropForeignKey
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_userid_fkey";

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "userid",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Options";

-- DropTable
DROP TABLE "Questions";

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
