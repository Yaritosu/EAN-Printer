import { LocationLabel } from "@/domain/location-label/entities/location-label";

describe("LocationLabel", () => {
  it("builds a location code from its segments while preserving leading zeros", () => {
    const label = LocationLabel.create({
      aisle: "01",
      block: "02",
      level: "01",
      bin: "04",
      arrow: "down"
    });

    expect(label.locationCode).toBe("01-02-01-04");
    expect(label.arrow).toBe("down");
  });
});
