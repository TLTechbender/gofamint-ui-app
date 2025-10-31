export interface SanityImage {
  _type: "image";
  url: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
    };
  };
  asset:
    | {
        _ref: string;
        _type: "reference";
        url?: string;
        alt?: string;
      }
    | {
        _id: string;
        url: string;
      };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string; 
}



export interface SanityImageWithAlt extends SanityImage {
  alt: string;
  caption?: string;
}