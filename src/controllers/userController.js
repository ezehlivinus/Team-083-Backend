
exports.userList = async (req, res) => {
  const users = await {
    id: 1,
    name: 'some name'
  };

  res.status(200).send({ status: 'Success', data: users });
};
