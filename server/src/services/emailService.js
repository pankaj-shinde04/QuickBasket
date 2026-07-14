import { Resend } from 'resend'
import config from '../config/index.js'
import logger from '../utils/logger.js'

let resendClient = null

function getResendClient() {
  if (!config.email.resendApiKey) {
    return null
  }

  if (!resendClient) {
    resendClient = new Resend(config.email.resendApiKey)
  }

  return resendClient
}

export async function sendEmailSafe({ to, subject, html }) {
  try {
    const resend = getResendClient()

    if (!resend) {
      logger.warn(`Email skipped (Resend not configured): ${subject} -> ${to}`)
      return
    }

    const { error } = await resend.emails.send({
      from: config.email.from,
      to,
      subject,
      html,
    })

    if (error) {
      logger.error(`Email failed (${subject} -> ${to}): ${error.message}`)
      return
    }

    logger.info(`Email sent: ${subject} -> ${to}`)
  } catch (error) {
    logger.error(`Email failed (${subject} -> ${to}): ${error.message}`)
  }
}

export function sendShopOwnerPendingEmail(user, shopName) {
  const name = `${user.firstName} ${user.lastName}`

  return sendEmailSafe({
    to: user.email,
    subject: 'QuickBasket — Shop owner application received',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Hello ${name},</h2>
        <p>Thank you for applying to sell on <strong>QuickBasket</strong>.</p>
        <p>Your shop <strong>${shopName}</strong> is <strong>pending verification</strong> by our admin team.</p>
        <p>We will email you once your application has been reviewed. You will not be able to log in until your account is approved.</p>
        <p>— QuickBasket Team</p>
      </div>
    `,
  })
}

export function sendShopOwnerApprovedEmail(user, shopName) {
  const name = `${user.firstName} ${user.lastName}`

  return sendEmailSafe({
    to: user.email,
    subject: 'QuickBasket — Your shop has been approved',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Hello ${name},</h2>
        <p>Great news! Your shop <strong>${shopName}</strong> has been <strong>approved</strong> on QuickBasket.</p>
        <p>You can now log in and access your shop owner dashboard.</p>
        <p><a href="${config.clientUrl}/auth">Log in to QuickBasket</a></p>
        <p>— QuickBasket Team</p>
      </div>
    `,
  })
}

export function sendShopOwnerRejectedEmail(user, shopName) {
  const name = `${user.firstName} ${user.lastName}`

  return sendEmailSafe({
    to: user.email,
    subject: 'QuickBasket — Shop owner application update',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Hello ${name},</h2>
        <p>Thank you for your interest in selling on QuickBasket.</p>
        <p>After review, your application for <strong>${shopName}</strong> was <strong>not approved</strong> at this time.</p>
        <p>If you believe this was a mistake, please contact our support team.</p>
        <p>— QuickBasket Team</p>
      </div>
    `,
  })
}

export function sendPasswordResetEmail(user, resetUrl) {
  const name = `${user.firstName} ${user.lastName}`

  return sendEmailSafe({
    to: user.email,
    subject: 'QuickBasket — Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
        <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-style: italic;">QuickBasket</h1>
        </div>
        <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0; font-size: 20px;">Reset Your Password</h2>
          <p>Hello <strong>${name}</strong>,</p>
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

