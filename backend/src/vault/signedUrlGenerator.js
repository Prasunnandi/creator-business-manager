import crypto from 'crypto';

/**
 * Time-Expiring Signed URL Generator & Verifier for Digital Asset Vault
 * Enforces cryptographic HMAC-SHA256 token verification, expiry timestamps, and download quotas.
 */

export class SignedUrlGenerator {
  /**
   * @param {Object} [options]
   * @param {string} [options.secretKey] - Cryptographic signing secret
   * @param {string} [options.baseUrl='https://vault.creatorhub.com/download'] - Endpoint base URL
   * @param {number} [options.defaultTtlSeconds=900] - Default link lifespan (15 minutes)
   */
  constructor(options = {}) {
    this.secretKey = options.secretKey || 'default-vault-hmac-secret-key-32-chars';
    this.baseUrl = options.baseUrl || 'https://vault.creatorhub.com/download';
    this.defaultTtlSeconds = options.defaultTtlSeconds || 900;
  }

  /**
   * Generate a tamper-proof time-limited download URL
   * @param {Object} params
   * @param {string} params.assetId - Unique digital file identifier
   * @param {string} params.buyerId - Customer account ID
   * @param {number} [params.ttlSeconds] - Custom lifetime in seconds
   * @param {number} [params.maxDownloads=3] - Maximum permitted access attempts
   * @returns {Object} Signed URL details and expiration timestamp
   */
  generateSignedUrl(params) {
    const { assetId, buyerId, ttlSeconds = this.defaultTtlSeconds, maxDownloads = 3 } = params;

    if (!assetId || !buyerId) {
      throw new Error('assetId and buyerId are required to generate signed download link');
    }

    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
    const nonce = crypto.randomBytes(8).toString('hex');

    // Canonical payload string to sign
    const payload = `assetId=${assetId}&buyerId=${buyerId}&expires=${expiresAt}&maxDownloads=${maxDownloads}&nonce=${nonce}`;
    const signature = crypto.createHmac('sha256', this.secretKey).update(payload).digest('hex');

    const signedUrl = `${this.baseUrl}?${payload}&sig=${signature}`;

    return {
      signedUrl,
      assetId,
      buyerId,
      expiresAt: new Date(expiresAt * 1000).toISOString(),
      expiresAtEpoch: expiresAt,
      maxDownloads,
      nonce,
      signature
    };
  }

  /**
   * Verify an incoming request signature and expiry
   * @param {string|Object} urlOrParams - Full signed URL string or parsed query params
   * @returns {Object} Verification outcome and decoded payload
   */
  verifySignedUrl(urlOrParams) {
    let params;

    if (typeof urlOrParams === 'string') {
      const urlObj = new URL(urlOrParams);
      params = Object.fromEntries(urlObj.searchParams.entries());
    } else {
      params = urlOrParams;
    }

    const { assetId, buyerId, expires, maxDownloads, nonce, sig } = params;

    if (!assetId || !buyerId || !expires || !nonce || !sig) {
      return {
        isValid: false,
        reason: 'MISSING_MANDATORY_PARAMETERS'
      };
    }

    // 1. Check expiration timestamp
    const nowEpoch = Math.floor(Date.now() / 1000);
    const expiresEpoch = parseInt(expires, 10);

    if (isNaN(expiresEpoch) || nowEpoch > expiresEpoch) {
      return {
        isValid: false,
        reason: 'URL_EXPIRED',
        expiredAt: new Date(expiresEpoch * 1000).toISOString(),
        evaluatedAt: new Date(nowEpoch * 1000).toISOString()
      };
    }

    // 2. Recompute HMAC-SHA256 signature
    const canonicalPayload = `assetId=${assetId}&buyerId=${buyerId}&expires=${expires}&maxDownloads=${maxDownloads}&nonce=${nonce}`;
    const expectedSig = crypto.createHmac('sha256', this.secretKey).update(canonicalPayload).digest('hex');

    const isValidSig = crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'));

    if (!isValidSig) {
      return {
        isValid: false,
        reason: 'SIGNATURE_MISMATCH_TAMPERED'
      };
    }

    return {
      isValid: true,
      assetId,
      buyerId,
      expiresAt: new Date(expiresEpoch * 1000).toISOString(),
      maxDownloads: parseInt(maxDownloads, 10)
    };
  }
}

export default SignedUrlGenerator;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SignedUrlGenerator;
  module.exports.SignedUrlGenerator = SignedUrlGenerator;
}
