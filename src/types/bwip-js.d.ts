declare module "bwip-js" {
  type BcOptions = {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
    paddingwidth?: number;
    paddingheight?: number;
    backgroundcolor?: string;
  };

  type Callback = (error: Error | null, png: Buffer) => void;

  const bwipjs: {
    toBuffer(options: BcOptions, callback: Callback): void;
    toSVG(options: BcOptions): string;
  };

  export default bwipjs;
}
