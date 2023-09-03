import { AddressObject } from "mailparser";

interface Email {
  subject?: string;
  from?: AddressObject | AddressObject[];
  to?: AddressObject | AddressObject[];
  cc?: AddressObject | AddressObject[];
  date?: Date;
  text?: string;
}

class EmailEmbedBulder {

  private subject: string;
  private from: string;
  private to: string;
  private cc?: string;
  private date: string;
  private text: string;

  constructor (options: Email = {}) {
    this.subject = options.subject ?? 'Subject not found';

    let fromValue = (options.from as AddressObject | undefined)?.value[0];
    this.from = (fromValue?.name) ? `**${fromValue.name}** (${fromValue.address})` : `**${fromValue?.address || 'Sender\'s address not found'}**`;
    
    if (options.to !== undefined) this.to = this.addressObjectStringParse(options.to as AddressObject, 'Receiver');
    else this.to = 'Receiver/s not found at all';

    if (options.cc !== undefined) this.to = this.addressObjectStringParse(options.to as AddressObject, 'Another receiver');
    else this.cc = 'nobody';

    this.date = this.formatDate(options.date) ?? 'Date not found';
    this.text = options.text ?? 'Content not found';

    
  }

  private addressObjectStringParse(addressObject: AddressObject, stringFallback: string) {
    let receivers: string[] = [];
    for (const value of (addressObject as AddressObject).value) 
      receivers.push((value.name) ? `${value.name} (${value.address})` : value?.address || stringFallback + '\'s address not found');
    return receivers.join(', ');
  }

  private readonly MAX_LENGTH_CONTENT = 1024;
  private readonly MAX_LENGTH_HEADER = 256;
  
  build() {
    const embededEmail = {
      type: 'rich',
      color: 0x00aaff,
      author: {
        name: 'DC Email'
      },
      title: this.subject,
      fields: [
        {
          name: 'Sender:',
          value: this.from,
          inline: true
        },
        {
          name: 'Receiver:',
          value: this.to,
          inline: true
        },
        {
          name: 'Copies:',
          value: this.cc,
          inline: true
        },
        {
          name: 'Content',
          value: this.text
        }
      ],
      footer: {
        text: 'Sent on ' + this.date
      }
    }

    // Remove CC if needed
    if (this.cc === 'nobody') embededEmail.fields.splice(2, 1);

    // Splitting text content into parts
    if (this.text.length > this.MAX_LENGTH_CONTENT) {
      let textParts = this.splitStringByMaxLength(this.text, this.MAX_LENGTH_CONTENT);
      embededEmail.fields.pop();
      
      for (let i = 0; i < textParts.length; i++) {
        embededEmail.fields.push({
          name: 'Part ' + (i + 1),
          value: textParts[i]
        });
      }
    }

    return embededEmail;
  }

  private readonly dateFormatter = new Intl.DateTimeFormat('cs-CZ', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  private formatDate(date: Date | undefined) {
    if (date === undefined) return undefined;
    return this.dateFormatter.format(date);
  }

  private splitStringByMaxLength(inputString: string, maxLength: number) {
    const result: string[] = [];
    for (let i = 0; i < inputString.length; i += maxLength) {
      const segment = inputString.slice(i, i + maxLength);
      result.push(segment);
    }
    return result;
  }
}

export default EmailEmbedBulder;