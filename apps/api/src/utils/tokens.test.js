const { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken } = require("./tokens");

describe("token utilities", () => {
  const payload = { id: "u_1", email: "user@example.com" };

  it("creates and verifies an access token", () => {
    const token = createAccessToken(payload);
    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it("creates and verifies a refresh token", () => {
    const token = createRefreshToken(payload);
    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });
});
