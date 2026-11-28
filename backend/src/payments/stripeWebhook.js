/**
 * Verified Stripe Webhook & Automated Order Fulfillment Handler
 * Securely verifies Stripe cryptographic webhook signatures (HMAC-SHA256 with replay defense)
 * and processes checkout.session.completed and invoice.paid fulfillment events.
 */

import crypto from 'crypto';

export const STRIPE_EVENT_TYPES = {
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted'
};

export class StripeWebhookHandler {
  /**
   * @param {Object} [options]
   * @param {string} [options.webhookSecret='whsec_test_secret_key'] - Stripe endpoint signing secret
   * @param {number} [options.timestampToleranceSeconds=300]         - Replay defense window (5 mins)
   */
  constructor(options = {}) {
    this.webhookSecret = options.webhookSecret || 'whsec_test_secret_key';
    this.timestampToleranceSeconds = options.timestampToleranceSeconds || 300;
    this.processedEvents = new Set();
    this.orderFulfillmentLog = [];
  }

  /**
   * Verifies the authenticity of an incoming Stripe webhook payload
   * @param {string|Buffer} rawPayload - Exact unparsed raw request body string or buffer
   * @param {string} signatureHeader - Value of 'stripe-signature' HTTP header ('t=...,v1=...')
   * @returns {Object} Verified Stripe event object
   */
  verifySignature(rawPayload, signatureHeader) {
    if (!signatureHeader) {
      throw new Error('Missing stripe-signature header');
    }

    const payloadString = Buffer.isBuffer(rawPayload) ? rawPayload.toString('utf8') : String(rawPayload);

    // Parse header elements: t=timestamp, v1=signature
    const parts = signatureHeader.split(',').reduce((acc, part) => {
      const [key, val] = part.trim().split('=');
      if (key && val) acc[key] = val;
      return acc;
    }, {});

    const timestamp = parseInt(parts.t, 10);
    const signature = parts.v1;

    if (!timestamp || !signature) {
      throw new Error('Malformed stripe-signature header format');
    }

    // Replay attack defense: verify timestamp is within acceptable tolerance window
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - timestamp) > this.timestampToleranceSeconds) {
      throw new Error(`Webhook timestamp outside tolerance window (${Math.abs(currentTime - timestamp)}s > ${this.timestampToleranceSeconds}s)`);
    }

    // Compute expected HMAC SHA-256 signature
    const signedPayload = `${timestamp}.${payloadString}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    // Constant-time buffer equality check
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      throw new Error('Invalid Stripe webhook signature verification failed');
    }

    return JSON.parse(payloadString);
  }

  /**
   * Constructs a test signature header for automated testing or mock dispatches
   */
  generateTestSignature(payloadString, timestamp = Math.floor(Date.now() / 1000)) {
    const signedPayload = `${timestamp}.${payloadString}`;
    const sig = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');
    return `t=${timestamp},v1=${sig}`;
  }

  /**
   * Dispatches and processes a verified Stripe event
   * @param {Object} event - Verified Stripe event
   * @returns {Object} Execution result and fulfillment status
   */
  handleEvent(event) {
    if (!event || !event.id || !event.type) {
      throw new Error('Invalid Stripe event payload: Missing event id or type');
    }

    // Idempotency: Prevent duplicate order fulfillment on webhook retries
    if (this.processedEvents.has(event.id)) {
      return {
        eventId: event.id,
        status: 'DUPLICATE_IGNORED',
        message: `Event ${event.id} has already been processed.`
      };
    }

    let fulfillment = null;

    switch (event.type) {
      case STRIPE_EVENT_TYPES.CHECKOUT_SESSION_COMPLETED:
        fulfillment = this._fulfillCheckoutSession(event.data.object);
        break;

      case STRIPE_EVENT_TYPES.INVOICE_PAID:
        fulfillment = this._fulfillInvoicePayment(event.data.object);
        break;

      case STRIPE_EVENT_TYPES.INVOICE_PAYMENT_FAILED:
        fulfillment = {
          action: 'PAYMENT_FAILED_ALERT',
          invoiceId: event.data.object.id,
          customer: event.data.object.customer,
          amountDue: event.data.object.amount_due / 100
        };
        break;

      case STRIPE_EVENT_TYPES.CUSTOMER_SUBSCRIPTION_DELETED:
        fulfillment = {
          action: 'SUBSCRIPTION_TERMINATED',
          subscriptionId: event.data.object.id,
          status: 'CANCELED'
        };
        break;

      default:
        fulfillment = {
          action: 'UNHANDLED_EVENT_ACKNOWLEDGED',
          type: event.type
        };
        break;
    }

    this.processedEvents.add(event.id);

    const record = {
      eventId: event.id,
      eventType: event.type,
      processedAt: new Date().toISOString(),
      fulfillment
    };

    this.orderFulfillmentLog.unshift(record);

    return {
      success: true,
      eventId: event.id,
      eventType: event.type,
      fulfillment
    };
  }

  _fulfillCheckoutSession(session) {
    const customerEmail = session.customer_details?.email || session.customer_email || 'customer@example.com';
    const amountUsd = (session.amount_total || 0) / 100;
    const productId = session.metadata?.productId || 'DIGITAL-PRODUCT-GENERIC';
    const licenseKey = `LIC-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    return {
      action: 'ORDER_FULFILLED',
      orderId: `ORD-${Date.now()}-${session.id.slice(-6)}`,
      sessionId: session.id,
      customerEmail,
      amountUsd,
      currency: session.currency || 'usd',
      productId,
      licenseKey,
      accessGranted: true,
      downloadVaultUrl: `https://creators.example.com/vault/download?license=${licenseKey}`,
      fulfillmentStatus: 'COMPLETED'
    };
  }

  _fulfillInvoicePayment(invoice) {
    const amountPaidUsd = (invoice.amount_paid || 0) / 100;
    const subscriptionId = invoice.subscription || null;

    return {
      action: 'INVOICE_RECURRING_EXTENDED',
      invoiceId: invoice.id,
      subscriptionId,
      customerEmail: invoice.customer_email || 'subscriber@example.com',
      amountPaidUsd,
      periodEnd: new Date((invoice.lines?.data?.[0]?.period?.end || Math.floor(Date.now() / 1000) + 30 * 86400) * 1000).toISOString(),
      membershipStatus: 'ACTIVE'
    };
  }
}

// Dual ESM & CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STRIPE_EVENT_TYPES,
    StripeWebhookHandler
  };
}

export default StripeWebhookHandler;
