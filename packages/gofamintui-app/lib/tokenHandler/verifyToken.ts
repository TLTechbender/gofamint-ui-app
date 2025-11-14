import generateToken from "./generateToken";

export default function verifyToken(
  userId: string,
  purpose: string,
  code: string
): boolean {
  const candidate = generateToken(userId, purpose); // ✅ no need to pass "now"
  return candidate === code;
}
