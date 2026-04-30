const request = require("supertest");
const { createApp } = require("./app");

describe("app health", () => {
  it("returns healthy response", async () => {
    const app = createApp();
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("returns api root metadata", async () => {
    const app = createApp();
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.docs).toBe("/api/docs");
  });
});
