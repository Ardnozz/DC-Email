import Imap from 'imap';

interface EmailLink {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

class ImapConnector {
  readonly user: string;
  readonly password: string;
  readonly host: string;
  readonly port: number;
  readonly tls: boolean;

  readonly imap: Imap;

  constructor (user: string, password: string, host: string, port: number, tls: boolean) {
    this.user = user;
    this.password = password;
    this.host = host;
    this.port = port;
    this.tls = tls;

    this.imap = new Imap({
      user: this.user,
      password: this.password,
      host: this.host,
      port: this.port,
      tls: this.tls,
      tlsOptions: {
        rejectUnauthorized: false
      }
    });
  }

  validateImap() {
    return new Promise(promiseResolve => {
      this.imap.connect();
      
      this.imap.on('error', (err: Error) => {
        if (err) console.error(err);
        if (err) promiseResolve(false);
      });

      this.imap.on('end', () => promiseResolve(true));

      this.imap.end();
    });
  }
}

export default ImapConnector;
export type { EmailLink }