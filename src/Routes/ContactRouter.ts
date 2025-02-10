import express from 'express';
import * as ContactController from '../Controllers/ContactController.js';
import {
  validateContactId,
  validateCreateContact,
  validateListContacts,
  validateTransferBalance,
} from '../Middlewares/contactValidators.js';

const router = express.Router();

router
  .route('/')
  .post(validateCreateContact, ContactController.createContact)
  .get(validateListContacts, ContactController.listContacts);

router
  .route('/:id')
  .get(validateContactId, ContactController.getContactById)
  .patch(validateContactId, ContactController.updateContactPartial)
  .delete(validateContactId, ContactController.deleteContact);

router.post('/transfer', validateTransferBalance, ContactController.transferContactBalance);
router.get('/:id/audit', validateContactId, ContactController.getContactAuditHistory);

export { router };
