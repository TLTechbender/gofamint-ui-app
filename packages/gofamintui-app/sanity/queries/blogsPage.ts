export const blogsPageQuery = `*[_type == "blogsPage"][0]{
  heroSection {
    backgroundImage{
     asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        hotspot,
        crop
        },
    title,
    subtitle
  }
}`;
