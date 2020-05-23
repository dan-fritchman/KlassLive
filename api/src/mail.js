import sgMail from '@sendgrid/mail';


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: 'dan@fritch.mn',
    from: 'dan@klass.live',
    subject: 'does it still think this is spam?',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail.send(msg);

