export interface GalleryPageData {
  _id: string;
  _type: "project";
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description: string;
  featuredImage: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
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
  };
  googleDriveFolder: string;
}
