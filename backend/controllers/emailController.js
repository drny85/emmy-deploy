import dotenv from 'dotenv';
import eMail from '@sendgrid/mail';

dotenv.config();

eMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, from, subject, data }) => {
  try {
    const emailBody = `
    <!DOCTYPE html>
    <html lang="en" style="box-sizing: border-box; margin: 0; padding: 0;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- <link rel="stylesheet" href="styles.css"> -->
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
        <title>Email</title>
        
    </head>
    <body style="box-sizing: border-box; margin: 0; padding: 0; min-width: 100%; min-height: 100%; font-family: 'Roboto', sans-serif;">
        <div class="container" style="box-sizing: border-box; padding: 0; background: linear-gradient(50deg, #ffffff, rgb(235, 229, 229)); background-size: cover; min-width: 100vw; min-height: 100vh; margin: auto; position: relative;">
            <div class="content" style="box-sizing: border-box; margin: 0; padding: 0; position: absolute; left: 50%; top: 50%; text-align: center; transform: translate(-50%, -50%);">
                <p class="p" style="box-sizing: border-box; font-size: 1.1rem; padding: 10px; margin: 1rem;">Great news ${data.name}, </p>
                <p style="box-sizing: border-box; margin: 0; padding: 0;">Your order has been shipped</p>
                <a class="btn" href="/api/orders/" style="box-sizing: border-box; margin: 0; margin-top: 1.5rem; padding: 10px 30px; border: none; background-color: #01579b; color: #eee; cursor: pointer; transition: all 250ms ease-in; border-radius: 2px; display: inline-block; font-size: 1.1rem; text-decoration: none; max-width: 15rem; text-align: center;">View Details</a>
            </div>
        </div>
    </body>
    </html>
    `;
    const msg = {
      to: to,
      from: from,
      subject: subject,

      html: emailBody,
    };
    const email = await eMail.send(msg);
    console.log(email);
  } catch (error) {
    console.error(error);
  }
};
