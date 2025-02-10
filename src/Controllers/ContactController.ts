// src/Controllers/ContactController.ts
import { Request, Response } from 'express';
import { contactRepository } from '../Models/ContactModel.js';
import { Contact } from '../Models/Entities/Contact.js';
import { AppError } from '../Utils/AppError.js';
import { asyncHandler } from '../Utils/asyncHandler.js';
import { MoreThan } from 'typeorm';
import { ContactAuditRepository } from '../Models/ContactAuditModel.js';

export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, company, balance } = req.body;

  const existingContact = await contactRepository.findOne({
    where: { email, company },
  });
  if (existingContact) {
    throw new AppError('Contact with this email already exists in the given company.', 409);
  }

  const contact = new Contact();
  contact.first_name = firstName;
  contact.last_name = lastName;
  contact.email = email;
  contact.company = company;
  contact.balance = Number(balance) || 0;

  await contactRepository.save(contact);
  res.status(201).json({ message: 'Contact created successfully' });
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

  res.status(200).json(contacts);
});

export const getContactById = asyncHandler(async (req: Request, res: Response) => {
  const contact = await contactRepository.findOne({
    where: { id: req.params.id, is_deleted: false },
  });

  if (!contact) {
    throw new AppError('Contact not found', 404);
  }

  res.status(200).json(contact);
});

export const updateContactPartial = asyncHandler(async (req: Request, res: Response) => {
  const contact = await contactRepository.findOne({
    where: { id: req.params.id, is_deleted: false },
  });

  if (!contact) {
    throw new AppError('Contact not found', 404);
  }

  if (req.body.email && req.body.email !== contact.email) {
    const existing = await contactRepository.findOne({
      where: { email: req.body.email, company: contact.company },
    });
    if (existing) {
      throw new AppError('Email already exists in this company', 409);
    }
  }

  contactRepository.merge(contact, req.body);
  await contactRepository.save(contact);

  res.status(200).json({ message: 'Contact updated successfully', contact });
});

export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await contactRepository.findOne({
    where: { id: req.params.id, is_deleted: false },
  });

  if (!contact) {
    throw new AppError('Contact not found', 404);
  }

  contact.is_deleted = true;
  await contactRepository.save(contact);

  res.status(200).json({ message: 'Contact deleted successfully' });
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
    throw new AppError('One or both contacts not found', 404);
  }

  if (fromContact.balance < amount) {
    throw new AppError('Sender does not have enough balance', 400);
  }

  fromContact.balance = Number(fromContact.balance) - amount;
  toContact.balance = Number(toContact.balance) + amount;

  await contactRepository.save([fromContact, toContact]);

  res.status(200).json({
    message: 'Balance transferred successfully',
    from_contact: fromContact,
    to_contact: toContact,
  });
});

export const getContactAuditHistory = asyncHandler(async (req: Request, res: Response) => {
  const auditLogs = await ContactAuditRepository.find({
    where: { contact: { id: req.params.id } },
  });

  if (!auditLogs.length) {
    throw new AppError('No audit history found for this contact', 404);
  }

  res.status(200).json(auditLogs);
});
