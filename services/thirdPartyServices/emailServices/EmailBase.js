import { convert } from 'html-to-text';

export default class EmailBase {
  #transporter;

  from;

  constructor(transporter, from) {
    this.#transporter = transporter;
    this.from = from;
  }

  send({ from = this.from, ...data }) {
    const mailData = data;

    // If html data present, attach text as well
    if (mailData.html && !mailData.text) {
      mailData.text = convert(mailData.html);
    }

    return this.#transporter.sendMail({
      ...mailData,
      from,
    });
  }
}
