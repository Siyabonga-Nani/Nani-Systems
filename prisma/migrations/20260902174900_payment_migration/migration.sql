-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "additionalCharges" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxRate" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxTreatment" TEXT NOT NULL DEFAULT 'EXCLUDED',
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "taxAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "amountPaid" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "amountDue" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "InvoiceLineItem" ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "idempotencyKey" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "additionalCharges" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxRate" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxTreatment" TEXT NOT NULL DEFAULT 'EXCLUDED',
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "taxAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "previousState" TEXT,
    "newState" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_idempotencyKey_key" ON "Payment"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

