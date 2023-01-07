-- CreateTable
CREATE TABLE "Snap" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "tags" TEXT[],
    "title" TEXT NOT NULL,
    "author" TEXT,
    "content" TEXT,
    "textContent" TEXT,
    "htmlContent" TEXT,
    "excerpt" TEXT,
    "length" INTEGER,
    "lang" TEXT,
    "screenshotUrl" TEXT NOT NULL,
    "snapImageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Snap_pkey" PRIMARY KEY ("id")
);
