import { test, expect } from "@playwright/test";

test("health check endpoint responds", async ({ request }) => {
  const response = await request.get("http://localhost:8000/health");
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});
