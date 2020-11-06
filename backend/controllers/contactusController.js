import dotenv from 'dotenv';
import nodeMailer from 'nodemailer';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

dotenv.config();

const transport = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'login',
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const contactUs = asyncHandler(async (req, res, next) => {
  const { name, lastName, from, subject, body } = req.body;
  const { message, product } = body;

  let prod;

  if (product !== '') {
    const pro = await Product.findById(product);
    const html = `
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
    <div class="container" style="box-sizing: border-box; padding: 0; background: linear-gradient(50deg, #ffffff, rgb(235, 229, 229)); background-size: cover; min-width: 100vw; min-height: 100vh; margin: auto; position: relative; display: flex;">
        <div class="content" style="box-sizing: border-box; display: flex; flex-direction: column; max-width: 800px; height: 80vh; margin: auto; box-shadow: 1px 10px 5px 8px rgba(0, 0, 0, 0.2); padding: 30px;">
            <h4 class="title" style="box-sizing: border-box; padding: 0; font-size: 1.2rem; text-align: center; margin: 20px;"><span style="text-transform: capitalize;">${name} ${lastName} </span> has a question for you</h4>

            <h6 style="box-sizing: border-box; margin: 0; padding: 0; font-size: 1rem; text-align: center; margin-bottom: 30px;">The question is about this product</h6>
            <p style="box-sizing: border-box; margin: 0; padding: 10px 5px;"><strong style="box-sizing: border-box; margin: 0; padding: 0;">Product ID:</strong> ${product}</p>
            <p style="box-sizing: border-box; margin: 0; padding: 10px 5px;"><strong style="box-sizing: border-box; margin: 0; padding: 0; text-transform: capitalize;">Name:</strong> ${pro.name}</p>
            <p style="box-sizing: border-box; margin: 0; padding: 10px 5px;"><strong style="box-sizing: border-box; margin: 0; padding: 0; ">Price:</strong>  $${pro.price}</p>
            
            <p style="box-sizing: border-box; margin: 0; padding: 10px 5px;">${message}</p>
        </div>
    </div>
    
</body>
</html>
  `;

    transport.sendMail(
      {
        to: 'robertm3lendez@gmail.com',
        from: from,
        subject:
          subject === 'product'
            ? 'Question about a Product'
            : 'A General Question',
        html: html,
      },
      (err, info) => {
        if (err) {
          console.error(err);
          res.status(400);
          throw new Error('error sending email');
        }

        return res.status(200).json(true);
      }
    );
  }

  return res.json(true);
});
