import fs from 'fs';
import ImapConnector, { EmailLink } from './imap/imapConnector';
import { throwIfPresent } from './errorHandler';

// Callable ONLY from mainStorage.ts
function linkEmail(userId: number | string, imapConnector: ImapConnector) {
  const fileData = readStorage();

  if (fileData[userId] === undefined) fileData[userId] = [];

  fileData[userId].push({
    user: imapConnector.user,
    password: imapConnector.password,
    host: imapConnector.host,
    port: imapConnector.port,
    tls: imapConnector.tls,
  });

  fs.writeFile('storage.json', JSON.stringify(fileData, null, 2), err => throwIfPresent(err));
}

// Callable only from mainStorage.ts
function unlinkEmail(userId: number | string, imapConnector: ImapConnector) {
  const fileData = readStorage();

  if (fileData[userId] === undefined) fileData[userId] = [];

  let objToRemove: EmailLink | undefined;

  fileData[userId].map((link_info) => {
    if (link_info['user'] !== imapConnector.user) return;
      
    objToRemove = link_info;
  });

  if (objToRemove === undefined) return;

  fileData[userId].splice(fileData[userId].indexOf(objToRemove), 1);
  fs.writeFile('storage.json', JSON.stringify(fileData, null, 2), err => throwIfPresent(err));
}

function removeUser(userId: number | string) {
  const fileData = readStorage();

  if (fileData[userId] === undefined) return;

  delete fileData[userId];

  fs.writeFile('storage.json', JSON.stringify(fileData, null, 2), err => throwIfPresent(err));
}

function readStorage(): {[key: string]: EmailLink[]} {
  return JSON.parse(fs.readFileSync('storage.json').toString());
}

function setupStorage() {
  if (fs.existsSync('storage.json')) return;
  fs.writeFileSync('storage.json', JSON.stringify({}));
}

export { linkEmail, unlinkEmail, readStorage, setupStorage, removeUser }