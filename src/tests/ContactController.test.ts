import request from 'supertest';
import { DataSource, QueryRunner } from 'typeorm';
import { contactRepository } from '../Models/ContactModel';
import { AppDataSource } from '../data-source';
import { app } from '../app';
import { Contact } from '../Models/Entities/Contact';

let queryRunner: QueryRunner;
let testDataSource: DataSource;

beforeAll(async () => {
  testDataSource = await AppDataSource.initialize();
});

afterAll(async () => {
  await testDataSource.destroy();
});

describe('Contact API Tests', () => {
  let contact1: Contact;
  let contact2: Contact;

  beforeEach(async () => {
    queryRunner = testDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    const email1 = `john.doe-${Date.now()}@example.com`;
    const email2 = `jane.doe-${Date.now()}@example.com`;

    contact1 = await contactRepository.save({
      first_name: 'John',
      last_name: 'Doe',
      email: email1,
      company: 'TestCorp',
      balance: 100,
    });

    contact2 = await contactRepository.save({
      first_name: 'Jane',
      last_name: 'Doe',
      email: email2,
      company: 'TestCorp',
      balance: 50,
    });
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('should transfer balance between contacts', async () => {
    const transferData = {
      from_contact_id: contact1.id,
      to_contact_id: contact2.id,
      amount: 20,
    };

    const response = await request(app).post('/contacts/transfer').send(transferData).expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Balance transferred successfully');

    const updatedContact1 = await contactRepository.findOne({ where: { id: contact1.id } });
    const updatedContact2 = await contactRepository.findOne({ where: { id: contact2.id } });

    expect(updatedContact1?.balance).toBe('80.00');
    expect(updatedContact2?.balance).toBe('70.00');
  });

  it('should not allow creating contact with duplicate email in the same company', async () => {
    const duplicateContactData = {
      first_name: 'Mike',
      last_name: 'Smith',
      email: contact1.email,
      company: 'TestCorp',
      balance: 0,
    };

    const response = await request(app).post('/contacts').send(duplicateContactData);

    expect(response.status).toBe(409);
    expect(response.body.status).toBe('error');
    expect(response.body.code).toBe('CONTACT_EXISTS');
    expect(response.body.message).toBe('Contact with this email already exists in the given company.');
  });

  it('should soft delete a contact without removing it from the database', async () => {
    const deleteResponse = await request(app).delete(`/contacts/${contact1.id}`).expect(200);

    expect(deleteResponse.body.status).toBe('success');
    expect(deleteResponse.body.message).toBe('Contact deleted successfully');

    const deletedContact = await contactRepository.findOne({ where: { id: contact1.id } });

    expect(deletedContact).not.toBeNull();
    expect(deletedContact?.is_deleted).toBe(true);
  });
});
