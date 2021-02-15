//Array of users
const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    user => user.room === room
  );

  if ( !room) return { error: 'Username and room are required.' };
  if (existingUser) return { error: 'room already exists.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
};

module.exports = { addUser };