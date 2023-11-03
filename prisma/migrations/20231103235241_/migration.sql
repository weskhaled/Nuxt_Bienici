-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "House" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id" TEXT NOT NULL,
    "blurInfo" JSONB,
    "city" TEXT,
    "postalCode" TEXT,
    "chargingStations" JSONB,
    "thresholdDate" TIMESTAMP(3),
    "availableDate" TIMESTAMP(3),
    "hasGeorisquesMention" BOOLEAN,
    "useJuly2021EnergyPerformanceDiagnostic" BOOLEAN,
    "adType" TEXT,
    "newOrOld" TEXT,
    "propertyType" TEXT,
    "reference" TEXT,
    "description" TEXT,
    "publicationDate" TEXT,
    "modificationDate" TEXT,
    "newProperty" BOOLEAN,
    "yearOfConstruction" INTEGER,
    "toiletQuantity" INTEGER,
    "landSurfaceArea" INTEGER,
    "accountType" TEXT,
    "isBienIciExclusive" BOOLEAN,
    "isSubjectToRentControl" BOOLEAN,
    "energyClassification" TEXT,
    "greenhouseGazClassification" TEXT,
    "energyValue" INTEGER,
    "greenhouseGazValue" INTEGER,
    "energyPerformanceDiagnosticDate" TEXT,
    "agencyFeeUrl" TEXT,
    "energySimulationReferenceDate" TEXT,
    "inventoryOfFixturesFees" INTEGER,
    "averageAnnualEnergyConsumption" INTEGER,
    "maxEnergyConsumption" INTEGER,
    "minEnergyConsumption" INTEGER,
    "safetyDeposit" INTEGER,
    "charges" INTEGER,
    "agencyRentalFee" INTEGER,
    "floor" INTEGER,
    "floorQuantity" INTEGER,
    "roomsQuantity" INTEGER,
    "bedroomsQuantity" INTEGER,
    "bathroomsQuantity" INTEGER,
    "showerRoomsQuantity" INTEGER,
    "terracesQuantity" INTEGER,
    "balconyQuantity" INTEGER,
    "parkingPlacesQuantity" INTEGER,
    "cellarsOrUndergroundsQuantity" INTEGER,
    "surfaceArea" INTEGER,
    "garagesQuantity" INTEGER,
    "enclosedParkingQuantity" INTEGER,
    "isDisabledPeopleFriendly" BOOLEAN,
    "hasIntercom" BOOLEAN,
    "hasFirePlace" BOOLEAN,
    "hasCaretaker" BOOLEAN,
    "isDuplex" BOOLEAN,
    "hasElevator" BOOLEAN,
    "isFurnished" BOOLEAN,
    "hasTerrace" BOOLEAN,
    "hasPool" BOOLEAN,
    "hasAirConditioning" BOOLEAN,
    "exposition" TEXT,
    "chargesMethod" TEXT,
    "photos" JSONB,
    "price" INTEGER,
    "rentExtra" INTEGER,
    "adCreatedByPro" BOOLEAN,
    "heating" TEXT,
    "district" JSONB,
    "relevanceBonus" INTEGER,
    "status" JSONB,
    "addressKnown" BOOLEAN,
    "isRecent" BOOLEAN,
    "displayDistrictName" BOOLEAN,
    "pricePerSquareMeter" INTEGER,
    "postalCodeForSearchFilters" TEXT,
    "descriptionTextLength" INTEGER,
    "title" TEXT,
    "userRelativeData" JSONB,
    "priceHasDecreased" BOOLEAN,
    "transactionType" TEXT,
    "adTypeFR" TEXT,
    "with3dModel" BOOLEAN,
    "hasGarden" BOOLEAN,
    "endOfPromotedAsExclusive" INTEGER,
    "opticalFiberStatus" TEXT,
    "nothingBehindForm" BOOLEAN,
    "highlightMailContact" BOOLEAN,
    "hasCellar" BOOLEAN,
    "customerId" TEXT,
    "displayInsuranceEstimation" BOOLEAN,
    "phoneDisplays" JSONB,

    CONSTRAINT "House_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "House_id_key" ON "House"("id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
