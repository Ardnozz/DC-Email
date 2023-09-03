import ImapConnector from './imapConnector';
import { ParsedMail, Source, simpleParser } from 'mailparser';
import { dateToIMAPFormat, getDaysBefore } from './dateFormatter';
import { notifyById } from '../errorHandler';
import mainStorage from '../mainStorage';

const SEEN_FLAG = '\\Seen';

function getUnreadEmails(imapConnector: ImapConnector, userId: string): Promise<ParsedMail[]> {
  return new Promise((promiseResolve, promiseError) => {
    imapConnector.imap.connect();

    imapConnector.imap.on('ready', () => {
      imapConnector.imap.openBox('INBOX', (err, _) => {
        if (err) promiseError(err);

        const SEVEN_DAYS_BEFORE = dateToIMAPFormat(getDaysBefore(new Date(), 7));
        const SEARCH_CRITERIA = ['UNSEEN', ['SENTSINCE', SEVEN_DAYS_BEFORE]];

        imapConnector.imap.search(SEARCH_CRITERIA, (err, result_uids) => {
          if (err) promiseError(err);
          if (result_uids.length === 0) {
            promiseResolve([]);
            return;
          }
          
          imapConnector.imap.addFlags(result_uids, SEEN_FLAG, (err) => {
            if (err) promiseError(err);
          });

          const fetch = imapConnector.imap.fetch(result_uids, { bodies: '' });

          const parsedEmails: ParsedMail[] = [];

          fetch.on('message', message => {
            message.on('body', (stream, _) => {
              simpleParser(stream as unknown as Source, (err, parsed) => {
                if (err) promiseError(err);
                parsedEmails.push(parsed);
              });
            });
          });

          const endInterval = setInterval(() => {
            if (parsedEmails.length == result_uids.length) {
              promiseResolve(parsedEmails);
              clearInterval(endInterval);
              return;
            }
          }, 1000);
        });
      });
    });

    imapConnector.imap.on('error', (error: Error) => {
      /*if (error.message === 'Incorrect authentication data') {
        if (userId !== undefined) notifyById(userId, 'I cannot conennect to one of your email addresses. For now, I\'m removing it from my database. Please, renew the email link by creating a new one.');
        mainStorage.removeEmailLink(userId, imapConnector);
        return;
      }
      
      logIfPresent(error);*/
      if (userId !== undefined) notifyById(userId, 'I cannot conennect to one of your email addresses. For now, I\'m removing it from my database. Please, renew the email link by creating a new one.');
      mainStorage.removeEmailLink(userId, imapConnector);
    });
  });
}

export { getUnreadEmails };