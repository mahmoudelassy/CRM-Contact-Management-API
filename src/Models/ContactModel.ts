import { AppDataSource } from '../data-source.js';
import { Contact } from './Entities/Contact.js';

export const contactRepository = AppDataSource.getRepository(Contact);
