import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePets1590521920167 implements MigrationInterface {
  name = 'CreatePets1590521920167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pets" ("id" SERIAL NOT NULL, "name" character varying(40), "breed" character varying(40), "age" Integer, "user_id" Integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7434" PRIMARY KEY ("id"), CONSTRAINT "FK_pet_user" FOREIGN KEY ("user_id") REFERENCES users ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "pets"`, undefined);
  }
}
