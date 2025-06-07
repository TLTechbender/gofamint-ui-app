export const buildCommentsListQuery = () => {
  return `*[_type == "comment" && blogPost._ref == $blogPostId ] | order(_createdAt desc) [$start...$end] {
    _id,
    _createdAt,
    content,
    author -> {
      _id,
      firstName,
      lastName,
      email,
      image
    },
    blogPost -> {
      _id,
      title
    },
    likes[] -> {
      _id,
      firstName,
      lastName
    },
    "likesCount": count(likes),
    "repliesCount": count(*[_type == "comment" && parentComment._ref == ^._id && approved == true]),
    "replies": *[_type == "comment" && parentComment._ref == ^._id && approved == true] | order(_createdAt asc) {
      _id,
      _createdAt,
      content,
      author -> {
        _id,
        firstName,
        lastName,
        image
      },
      likes[] -> {
        _id,
        firstName,
        lastName
      },
      "likesCount": count(likes)
    }
  }`;
};

export const buildCommentsCountQuery = () => {
  return `count(*[_type == "comment" && blogPost._ref == $blogPostId && approved == true && !defined(parentComment)])`;
};

