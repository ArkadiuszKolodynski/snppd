-- CreateTable
CREATE TABLE "Snap" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tags" TEXT[],
    "title" TEXT NOT NULL,
    "htmlContent" TEXT,
    "textContent" TEXT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Snap_pkey" PRIMARY KEY ("id")
);
