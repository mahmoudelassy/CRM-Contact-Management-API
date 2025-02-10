import { AppDataSource } from '../data-source';
import { ContactAudit } from './Entities/ContactAudit';

export const ContactAuditRepository = AppDataSource.getRepository(ContactAudit);
