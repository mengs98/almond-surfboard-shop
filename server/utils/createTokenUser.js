const createTokenUser = (user) => ({
  name: user.name,
  userId: user._id,
  role: user.role,
});

export default createTokenUser;
