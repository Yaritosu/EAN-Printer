import { GET } from "@/app/api/barcode/route";

describe("barcode route", () => {
  it("renders a code128 svg for location codes that are not EAN-13", async () => {
    const response = await GET(
      new Request("http://localhost:3000/api/barcode?value=01-01-01-1&scale=2&heightMm=16")
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("image/svg+xml");
  });
});
