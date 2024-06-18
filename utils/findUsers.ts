export const findUserByUsername = (users: any[], substring: any) => {
  return users.filter(user => {
    const userNameMatch =
      user.userName &&
      typeof user.userName === 'string' &&
      user.userName.includes(substring);

    const fullNameMatch =
      user.fullName &&
      typeof user.fullName === 'string' &&
      user.fullName.toLowerCase().includes(substring.toLowerCase());

    return userNameMatch || fullNameMatch;
  });
};
