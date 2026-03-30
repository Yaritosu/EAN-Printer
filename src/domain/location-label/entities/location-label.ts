export type LocationArrow = "none" | "up" | "down";

export type LocationLabelInput = {
  aisle: string;
  block: string;
  level: string;
  bin: string;
  arrow: LocationArrow;
};

const clean = (value: string): string => value.trim();

export class LocationLabel {
  private constructor(
    public readonly aisle: string,
    public readonly block: string,
    public readonly level: string,
    public readonly bin: string,
    public readonly arrow: LocationArrow,
    public readonly locationCode: string
  ) {}

  static create(input: LocationLabelInput): LocationLabel {
    const aisle = clean(input.aisle);
    const block = clean(input.block);
    const level = clean(input.level);
    const bin = clean(input.bin);

    if (!aisle || !block || !level || !bin) {
      throw new Error("Regal, Block, Ebene und Fach sind erforderlich.");
    }

    return new LocationLabel(aisle, block, level, bin, input.arrow, [aisle, block, level, bin].join("-"));
  }
}
