import nodemailer from 'nodemailer'
import config from '../config/index.js'
import logger from '../utils/logger.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
})

async function sendEmailSafe({ to, subject, html }) {
  try {
    if (!config.email.user || !config.email.pass) {
      logger.warn(`Email skipped (Gmail SMTP not configured): ${subject} -> ${to}`)
      return { success: false }
    }

    await transporter.sendMail({
      from: `"QuickBasket" <${config.email.user}>`,
      to,
      subject,
      html,
    })

    logger.info(`Email sent: ${subject} -> ${to}`)
    return { success: true }
  } catch (error) {
    logger.error(`Email failed (${subject} -> ${to}): ${error.message}`)
    return { success: false }
  }
}

export async function sendRegistrationEmail(userEmail, ownerName, shopName) {
  return sendEmailSafe({
    to: userEmail,
    subject: 'QuickBasket — Shop Owner Application Received',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Hello ${ownerName},</h2>
        <p>Thank you for registering with <strong>QuickBasket</strong>.</p>
        <p>Your shop <strong>${shopName}</strong> has been received and is <strong>pending admin approval</strong>.</p>
        <p>You will receive another email once your application has been reviewed.</p>
        <p>— QuickBasket Team</p>
      </div>
    `,
  })
}

export async function sendApprovalEmail(userEmail, ownerName, shopName) {
  const clientUrl = Array.isArray(config.clientUrl) ? config.clientUrl[0] : config.clientUrl
  return sendEmailSafe({
    to: userEmail,
    subject: 'Your Shop Has Been Approved 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Hello ${ownerName},</h2>
        <p>Congratulations! Your shop <strong>${shopName}</strong> has been <strong>approved</strong> on QuickBasket.</p>
        <p>You can now log in and access your shop owner dashboard.</p>
        <p><a href="${clientUrl}/auth">Log in to QuickBasket</a></p>
        <p>— QuickBasket Team</p>
      </div>
    `,
  })
}

export async function sendRejectionEmail(userEmail, ownerName, shopName) {
  return sendEmailSafe({
    to: userEmail,
    subject: 'QuickBasket — Shop Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Hello ${ownerName},</h2>
        <p>Thank you for applying to QuickBasket.</p>
        <p>After review, your application for <strong>${shopName}</strong> was <strong>not approved</strong> at this time.</p>
        <p>If you believe this was a mistake, please contact our support team.</p>
        <p>— QuickBasket Team</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(userEmail, ownerName, resetUrl) {
  return sendEmailSafe({
    to: userEmail,
    subject: 'QuickBasket — Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
        <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-style: italic;">QuickBasket</h1>
        </div>
        <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0; font-size: 20px;">Reset Your Password</h2>
          <p>Hello <strong>${ownerName}</strong>,</p>
          <p>We received a request to reset the password for your QuickBasket account. Click the button below to choose a new password.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}"
               style="background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 13px;">This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password will not change.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #4f46e5; word-break: break-all;">${resetUrl}</a>
          </p>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-bottom: 0;">— QuickBasket Team</p>
        </div>
      </div>
    `,
  })
}

