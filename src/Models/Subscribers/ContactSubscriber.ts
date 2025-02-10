import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';

import { Contact } from '../Entities/Contact.js';
import { ContactAuditRepository } from '../ContactAuditModel.js';
import { ContactAudit } from '../Entities/ContactAudit.js';

@EventSubscriber()
export class ContactSubscriber implements EntitySubscriberInterface<Contact> {
  listenTo() {
    return Contact;
  }

  async afterUpdate(event: UpdateEvent<Contact>): Promise<void> {
    const contact = event.entity;

    if (!contact) return;

    const snapshot = { ...contact };
    delete snapshot.id;

    const auditLog = new ContactAudit();
    auditLog.contact = contact as Contact;
    auditLog.updated_snapshot = snapshot;

    await ContactAuditRepository.save(auditLog);
  }
}
