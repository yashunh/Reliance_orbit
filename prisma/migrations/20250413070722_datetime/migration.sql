-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "route" TEXT NOT NULL,
    "fromLocation" INTEGER NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "pickupdDate" TIMESTAMP(3) NOT NULL,
    "dropDate" TIMESTAMP(3) NOT NULL,
    "toLocation" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "floor" INTEGER NOT NULL DEFAULT 0,
    "lift" BOOLEAN NOT NULL DEFAULT false,
    "propertyType" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_fromLocation_fkey" FOREIGN KEY ("fromLocation") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_toLocation_fkey" FOREIGN KEY ("toLocation") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
