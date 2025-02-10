import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Contact } from './Contact';

@Entity()
export class ContactAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contact, (contact) => contact.auditLogs)
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @Column('jsonb')
  updated_snapshot: Record<string, unknown>;
}
