import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1739179925771 implements MigrationInterface {
    name = 'InitialSchema1739179925771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_audit" ("id" SERIAL NOT NULL, "updated_snapshot" jsonb NOT NULL, "contact_id" uuid, CONSTRAINT "PK_3f9cfc10abceb046a4e4f662c55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "company" character varying(255) NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a23c762119c0575a68a871521eb" UNIQUE ("email", "company"), CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact_audit" ADD CONSTRAINT "FK_26088a1418fcdca7492bd742ba5" FOREIGN KEY ("contact_id") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_audit" DROP CONSTRAINT "FK_26088a1418fcdca7492bd742ba5"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "contact_audit"`);
    }

}
