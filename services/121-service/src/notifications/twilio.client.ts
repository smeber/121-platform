/* eslint-disable @typescript-eslint/no-var-requires */
import { TwilioClientMock } from './twilio.mock';

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
  console.log('process.env.MOCK_TWILIO: ', process.env.MOCK_TWILIO);
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  wiremockClient = {
    httpClient: new PrismClient('http://wiremock:8080', new RequestClient()),
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
