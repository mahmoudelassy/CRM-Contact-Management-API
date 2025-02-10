import { NextFunction, Request, Response } from 'express';
import { contactRepository } from '../Models/ContactModel';
import { Contact } from '../Models/Entities/Contact';
import { AppError } from '../Utils/AppError';
import { asyncHandler } from '../Utils/asyncHandler';
import { MoreThan } from 'typeorm';
import { ContactAuditRepository } from '../Models/ContactAuditModel';

export const createContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { first_name, last_name, email, company, balance } = req.body;

  const existingContact = await contactRepository.findOne({
    where: { email, company },
  });

  if (existingContact) {
    throw new AppError('Contact with this email already exists in the given company.', 409, 'CONTACT_EXISTS');
  }

  const contact = new Contact();
  contact.first_name = first_name;
  contact.last_name = last_name;
  contact.email = email;
  contact.company = company;
  contact.balance = Number(balance) || 0;

  await contactRepository.save(contact);

  res.status(201).json({
    status: 'success',
    message: 'Contact created successfully',
    data: contact,
  });
});

export const listContacts = asyncHandler(async (req: Request, res: Response) => {
  const { company, is_deleted, created_after } = req.query;

  const filters: any = {
    is_deleted: is_deleted === 'true' ? true : false,
  };

  if (company) filters.company = company;
  if (created_after) {
    filters.created_at = MoreThan(new Date(created_after as string));
  }

  const contacts = await contactRepository.find({
    where: filters,
    order: { created_at: 'DESC' },
  });

  res.status(200).json({
    status: 'success',
    message: 'Contacts fetched successfully',
    data: contacts,
  });
});

export const getContactById = asyncHandler(async (req: Request, res: Response) => {
  const contact = await contactRepository.findOne({
    where: { id: req.params.id, is_deleted: false },
  });

  if (!contact) {
    throw new AppError('Contact not found', 404, 'CONTACT_NOT_FOUND');
  }

  res.status(200).json({
    status: 'success',
    message: 'Contact fetched successfully',
    data: contact,
  });
});

export const updateContactPartial = asyncHandler(async (req: Request, res: Response) => {
  const contact = await contactRepository.findOne({
    where: { id: req.params.id, is_deleted: false },
  });

  if (!contact) {
    throw new AppError('Contact not found', 404, 'CONTACT_NOT_FOUND');
  }

  if (req.body.email && req.body.email !== contact.email) {
    const existing = await contactRepository.findOne({
      where: { email: req.body.email, company: contact.company },
    });
    if (existing) {
      throw new AppError('Email already exists in this company', 409, 'CONTACT_EMAIL_EXISTS');
    }
  }

  contactRepository.merge(contact, req.body);
  await contactRepository.save(contact);

  res.status(200).json({
    status: 'success',
    message: 'Contact updated successfully',
    data: contact,
  });
});

export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await contactRepository.findOne({
    where: { id: req.params.id, is_deleted: false },
  });

  if (!contact) {
    throw new AppError('Contact not found', 404, 'CONTACT_NOT_FOUND');
  }

  contact.is_deleted = true;
  await contactRepository.save(contact);

  res.status(200).json({
    status: 'success',
    message: 'Contact deleted successfully',
  });
});

export const transferContactBalance = asyncHandler(async (req: Request, res: Response) => {
  const { from_contact_id, to_contact_id, amount } = req.body;

  const fromContact = await contactRepository.findOne({
    where: { id: from_contact_id, is_deleted: false },
  });
  const toContact = await contactRepository.findOne({
    where: { id: to_contact_id, is_deleted: false },
  });

  if (!fromContact || !toContact) {
    throw new AppError('One or both contacts not found', 404, 'CONTACT_NOT_FOUND');
  }

  if (fromContact.balance < amount) {
    throw new AppError('Sender does not have enough balance', 400, 'INSUFFICIENT_BALANCE');
  }

  fromContact.balance = Number(fromContact.balance) - amount;
  toContact.balance = Number(toContact.balance) + amount;

  await contactRepository.save([fromContact, toContact]);

  res.status(200).json({
    status: 'success',
    message: 'Balance transferred successfully',
    data: {
      from_contact: fromContact,
      to_contact: toContact,
    },
  });
});

export const getContactAuditHistory = asyncHandler(async (req: Request, res: Response) => {
  const auditLogs = await ContactAuditRepository.find({
    where: { contact: { id: req.params.id } },
  });

  if (!auditLogs.length) {
    throw new AppError('No audit history found for this contact', 404, 'NO_AUDIT_HISTORY');
  }

  res.status(200).json({
    status: 'success',
    message: 'Audit history fetched successfully',
    data: auditLogs,
  });
});
