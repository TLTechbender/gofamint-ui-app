import crypto from "crypto";

const SECRET = process.env.NEXT_OTP_SECRET;
const STEP_SECONDS = 600; // 10 minute window

export default function generateToken(
  userId: string,
  purpose: string,
  atSeconds: number = Math.floor(Date.now() / 1000) // default to now
) {
  const window = Math.floor(atSeconds / STEP_SECONDS);
  const msg = `${userId}|${purpose}|${window}`;
  const h = crypto.createHmac("sha256", SECRET!).update(msg).digest();
  const offset = h[h.length - 1] & 0xf;
  const bin =
    ((h[offset] & 0x7f) << 24) |
    ((h[offset + 1] & 0xff) << 16) |
    ((h[offset + 2] & 0xff) << 8) |
    (h[offset + 3] & 0xff);
  const num = bin % 1000000;
  return num.toString().padStart(6, "0");
}
