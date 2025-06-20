export interface ExcecutivesPageData {
  heroSection: {
    title: string;
    subtitle: string;
    image: {
      asset: {
        url: string;
        metadata?: {
          lqip?: string;
        };
      };
      alt?: string;
    };
  };
  overallHead: {
    posterImage: {
      asset: {
        url: string;
        metadata?: {
          lqip?: string;
        };
      };
      alt?: string;
    };
    title: string;
    subtitle: string;
   
  };
  infoSection: {
    title: string;
    subTitle: string;
  };
  excosSection: {
    title: string;
    subTitle: string;
    excos: {
      name: string;
      operatingCapacity: string;
      picture: {
        asset: {
          url: string;
          metadata?: {
            lqip?: string;
          };
        };
        alt?: string;
      };
    }[];
  };
}
