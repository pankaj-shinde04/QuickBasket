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
