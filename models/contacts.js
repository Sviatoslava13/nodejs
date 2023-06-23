const fs = require('fs/promises')
const path = require("path");
const contactsPath = path.resolve(__dirname, './contacts.json');

const listContacts = async () => {
 const getContacts = await fs.readFile(contactsPath, 'utf8');
 return JSON.parse(getContacts)
}

const getContactById = async (contactId) => {
  const getByIdContacts = await listContacts();
  return getByIdContacts.find((contact)=> contact.id === contactId)

}

const removeContact = async (contactId) => {
  const removeByIdContacts = await listContacts();
  const filterContacts = removeByIdContacts.filter((contact)=>contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(filterContacts));
  return filterContacts
}

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: String(contacts.length + 1),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;

}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === contactId);
  if (idx === -1) {
    return null;
  }
  contacts[idx] = {  ...contacts[idx], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contacts[idx];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
