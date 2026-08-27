CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");
CREATE UNIQUE INDEX "skills_slug_key" ON "skills"("slug");
