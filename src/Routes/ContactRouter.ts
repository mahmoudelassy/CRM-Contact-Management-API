import express from 'express';
import * as ContactController from '../Controllers/ContactController.js';

const router = express.Router();

router
  .route('/')
  .post(ContactController.createContact)
  .get(ContactController.listContacts);

router
  .route('/:id')
  .get(ContactController.getContactById)
  .patch(ContactController.updateContactPartial)
  .delete(ContactController.deleteContact);

router.post('/transfer', ContactController.transferContactBalance);

router.get('/:id/audit', ContactController.getContactAuditHistory);

export { router };
