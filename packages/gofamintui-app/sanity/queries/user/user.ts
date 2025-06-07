export const existingUserQuery = `*[_type == "user" && email == $email][0]`;
