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

  if (product !== '') {
    const pro = await Product.findById(product);

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- <link rel="stylesheet" href="styles.css"> -->
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
        <title>Email</title>
        <style>
            .container {
      background: linear-gradient(50deg, #ffffff, rgb(235, 229, 229));
      background-size: cover;
      min-width: 100vw;
      min-height: 100vh;
      margin: auto;
      position: relative;
      display: flex;
    
      
    }
    body {
      min-width: 100%;
      min-height: 100%;
      font-family: 'Roboto', sans-serif;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    .p {
        font-size: 1.1rem;
        padding: 10px;
        margin: 1rem;
    }
    .content {
    
     display: flex;
     flex-direction: column;
     max-width: 800px;
     height: 80vh;
     margin: auto;
     box-shadow: 1px 10px 5px 8px rgba(0, 0, 0, 0.2);
     padding: 30px;
    }
    a {
      margin-top: 1.5rem;
    }
    .content > p {
      padding: 10px 5px;
      text-transform: capitalize;

    }
    
    .btn {
      padding: 10px 30px;
      border: none;
      background-color: #01579b;
      color: #eee;
      cursor: pointer;
      transition: all 250ms ease-in;
      border-radius: 2px;
      display: inline-block;
      font-size: 1.1rem;
      text-decoration: none;
      max-width: 15rem;
      text-align: center;
    }
    .btn_div {
        background-color: beige;
    }
    
    h6 {
      font-size: 1rem;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .title {
      font-size: 1.2rem;
      text-align: center;
      margin: 20px;
    }
    
    
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h4 class='title'>Robert Melendez has a question for you</h4>
    
                <h6>The question is about this product</h6>
                <p><strong>Product ID:</strong> ${product}</p>
                <p><strong>Name:</strong> ${pro.name}</p>
                <p><strong>Price:</strong> $${pro.price}</p>
                
                <p>${message}</p>
            </div>
        </div>
        
    </body>
    </html>
  `;

    await transport.sendMail(
      {
        to: 'emmydashartsy@gmail.com',
        from: from,
        subject: 'Question about a Product',
        replyTo: from,

        html: html,
      },
      (err, info) => {
        if (err) {
          console.error(err);
          res.status(400);
          throw new Error('error sending email');
        }
        console.log(info);
        return res.status(200).json(true);
      }
    );
    // } else {
    //   const html = `
    //   <!DOCTYPE html>
    //   <html lang="en">
    //   <head>
    //       <meta charset="UTF-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <!-- <link rel="stylesheet" href="styles.css"> -->
    //       <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    //       <title>Email</title>
    //       <style>
    //           .container {
    //     background: #fff;
    //     background-size: cover;
    //     min-width: 100vw;
    //     min-height: 100vh;
    //     margin: auto;
    //     position: relative;
    //     display: flex;

    //   }
    //   body {
    //     min-width: 100%;
    //     min-height: 100%;
    //     font-family: 'Roboto', sans-serif;
    //   }

    //   * {
    //     box-sizing: border-box;
    //     margin: 0;
    //     padding: 0;
    //   }
    //   .p {
    //       font-size: 1.1rem;
    //       padding: 10px;
    //       margin: 1rem;
    //   }
    //   .content {

    //    display: flex;
    //    flex-direction: column;
    //    max-width: 800px;
    //    height: 80vh;
    //    margin: auto;
    //    box-shadow: 1px 10px 5px 8px rgba(0, 0, 0, 0.2);
    //    padding: 30px;
    //   }
    //   a {
    //     margin-top: 1.5rem;
    //   }
    //   .content > p {
    //     padding: 10px 5px;
    //     text-transform: capitalize;

    //   }

    //   .btn {
    //     padding: 10px 30px;
    //     border: none;
    //     background-color: #01579b;
    //     color: #eee;
    //     cursor: pointer;
    //     transition: all 250ms ease-in;
    //     border-radius: 2px;
    //     display: inline-block;
    //     font-size: 1.1rem;
    //     text-decoration: none;
    //     max-width: 15rem;
    //     text-align: center;
    //   }
    //   .btn_div {
    //       background-color: beige;
    //   }

    //   h6 {
    //     font-size: 1rem;
    //     text-align: center;
    //     margin-bottom: 30px;
    //   }

    //   .title {
    //     font-size: 1.3rem;
    //     text-align: center;
    //     margin: 20px;
    //     text-transform: capitalize;
    //   }

    //       </style>
    //   </head>
    //   <body>
    //       <div class="container">
    //           <div class="content">
    //               <h4 class='title'>${name} ${lastName} has a general question for you</h4>

    //               <p>${message}</p>
    //           </div>
    //       </div>

    //   </body>
    //   </html>
    //   `;

    //   await transport.sendMail(
    //     {
    //       to: 'robertm3lendez@gmail.com',
    //       from: from,
    //       subject: 'A General Question',
    //       html: html,
    //     },
    //     (err, info) => {
    //       if (err) {
    //         console.error(err);
    //         res.status(400);
    //         throw new Error('error sending email');
    //       }
    //       console.log(info.messageId);
    //       return res.status(200).json(true);
    //     }
    //   );
  }
});
