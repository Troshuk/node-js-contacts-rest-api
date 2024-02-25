import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");
const rewriteContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function listContacts() {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts) ?? [];
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  return contact || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) return null;

  const [contact] = contacts.splice(index, 1);

  await rewriteContacts(contacts);

  return contact;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const contact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contacts.push(contact);

  await rewriteContacts(contacts);

  return contact;
}

export async function updateContact(contactId, contactData) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...contactData };

  await rewriteContacts(contacts);

  return contacts[index];
}
