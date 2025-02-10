import { AppDataSource } from '../data-source';
import { Contact } from './Entities/Contact';

export const contactRepository = AppDataSource.getRepository(Contact);
