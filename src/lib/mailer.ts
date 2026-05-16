import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
})

export const FROM = 'Fiesta de María <ramiroperez12@hotmail.com>'
export const ADMIN_EMAIL = 'ramiroperez12@hotmail.com'
