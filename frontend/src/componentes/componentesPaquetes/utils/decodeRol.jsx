export function decodeRol(token) {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload?.rol || null;
  } catch {
    return null;
  }
}
