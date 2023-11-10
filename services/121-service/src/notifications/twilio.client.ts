/* eslint-disable @typescript-eslint/no-var-requires */
import { TwilioClientMock } from './twilio.mock';
import { v4 as uuid } from 'uuid';

class PrismClient {
  public prismUrl: string;
  public requestClient: any;
  constructor(prismUrl, requestClient) {
    this.prismUrl = prismUrl;
    this.requestClient = requestClient;
  }

  public request(opts): any {
    opts.uri = opts.uri.replace(/^https\:\/\/.*?\.twilio\.com/, this.prismUrl);
    return this.requestClient.request(opts);
  }
}

let wiremockClient = {} as any;
const twilio = require('twilio');
const { RequestClient } = twilio;
if (process.env.MOCK_TWILIO === 'wire') {
  class CustomClient extends RequestClient {
    request(opts): any {
      if (!opts.headers) {
        opts.headers = {};
      }
      // Add a random UUID to headers which is used later to generate unique message sid
      opts.headers['X-Random-UUID'] = uuid();
      return super.request(opts);
    }
  }

  console.log('process.env.MOCK_TWILIO: ', process.env.MOCK_TWILIO);
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  wiremockClient = {
    httpClient: new PrismClient('http://wiremock:8080', new CustomClient()),
    accountSid: accountSid,
  };
  console.log('test: ');
}

export const twilioClient =
  !!process.env.MOCK_TWILIO && process.env.MOCK_TWILIO !== 'wire'
    ? new TwilioClientMock()
    : twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTHTOKEN,
        wiremockClient,
      );
