import { AppDataSource } from '../data-source.js';
import { ContactAudit } from './Entities/ContactAudit.js';

export const ContactAuditRepository = AppDataSource.getRepository(ContactAudit);
