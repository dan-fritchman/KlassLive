import Twilio from 'twilio';


const {
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER, NOTIFY_NUMBER
} = process.env;

const client = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export default async function sms(body) {
    const message = await client.messages
        .create({
            body,
            from: TWILIO_NUMBER,
            to: NOTIFY_NUMBER
        });
    console.log(`SMS Sent: ${message.sid}`);
}

