const { v4: uuid } = require("uuid");
// const namesJson = require("./data/names.json");

const users = [];
const rooms = [
  {
    id: uuid(),
    name: "Dummy room for dummy users",
    password: "",
    isPrivate: false,
    users: [],
  },
  {
    id: uuid(),
    name: "Flamingo",
    password: "",
    isPrivate: false,
    users: [],
  },
  {
    id: uuid(),
    name: "Dododododo",
    password: "",
    isPrivate: false,
    users: [],
  },
  {
    id: uuid(),
    name: "Random name for room",
    password: "",
    isPrivate: false,
    users: [],
  },
];

const eventEmitList = {
  server: [
    "user/new-user-connected",
    "user/user-disconnected",
    "user/new-user",
    "update-user-info",
    "room/room-list",
    "room/room-created",
    "room/user-joined",
    "room/user-left",
  ],
  client: [
    "user/new-user-username",
    "room/get-rooms",
    "room/create-room",
    "room/join-room",
    "room/leave-room",
    "disconnect",
  ],
};

module.exports = function (socket, io) {
  console.log("A user connected");

  // const new_user = newUser({
  //   userData: {
  //     username,
  //     id: uuid(),
  //   },
  //   socket,
  // });

  socket.user = {
    id: uuid(),
    username: null,
    socketId: socket.id,
  };

  socket.emit("user/new-user", socket.user);

  socket.on("user/new-user-username", ({ username }) => {
    socket.user.username = username;

    socket.emit("user/update-user-info", socket.user);
    socket.broadcast.emit("user/new-user-connected", socket.user);
  });

  socket.on("room/get-rooms", () => {
    socket.emit(
      "room/room-list",
      rooms.map(({ password, ...room }) => ({ ...room }))
    );
  });

  socket.on("room/create-room", (roomInfo) => {
    const room = createRoom(roomInfo);
    joinRoom({ roomInfo: room, userData: socket.user, socket });
    io.broadcast.emit("room/room-created", room);
  });

  socket.on("room/join-room", (roomInfo) => {
    const { id, name, password } = roomInfo;

    const room = joinRoom(roomInfo, socket.user);

    // notify all users in the room
    io.to(id).emit("room/user-joined", room);

    // notify all users outside the room for users count
    //? io.broadcast.emit("room/user-joined", room);
  });

  socket.on("room/leave-room", (roomInfo) => {
    const { id } = roomInfo;
    const room = leaveRoom(roomInfo, socket.user);
    io.to(id).emit("room/user-left", { room, users: room.users });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    disconnectUser({ userData: socket.user, socket });

    socket.broadcast.emit("user/user-disconnected", socket.user);
  });
};

function newUser({ username, socket }) {
  // const adjective =
  //   namesJson.adjective[Math.floor(Math.random() * namesJson.adjective.length)];
  // const animal =
  //   namesJson.animal[Math.floor(Math.random() * namesJson.animal.length)];
  const user = {
    // username: `${adjective} ${animal}`,
    ...socket.user,
    username,
  };
  users.push(user);
  return user;
}

function disconnectUser({ userData, socket }) {
  const { id } = userData;
  const user = users.find((user) => user.id === id);
  if (user) {
    users = users.filter((user) => user.id !== id);
  }
  const userExists = rooms.find((room) =>
    room.users.some((user) => user.id === userData.id)
  );

  if (userExists) {
    leaveRoom({ roomInfo: userExists, userData, socket });
  }

  return user;
}

function createRoom({ roomInfo }) {
  const {
    name = getRandomNamesForRooms(),
    password = null,
    isPrivate = false,
  } = roomInfo;
  const roomId = uuid();
  const room = { id: roomId, name, password, users: [], isPrivate };
  rooms.push(room);
  return room;
}

function joinRoom({ roomInfo, userData, socket }) {
  const { roomId, password } = roomInfo;
  const room = rooms.find((room) => room.id === roomId);
  if (!room) {
    return { error: "Room not found" };
  }
  if (room.isPrivate && room.password !== password) {
    return { error: "Incorrect password" };
  }
  if (room.users.find((user) => user.id === userData.id)) {
    return { error: "User already in room" };
  }

  const userExists = rooms.find((room) =>
    room.users.some((user) => user.id === userData.id)
  );

  if (userExists) {
    leaveRoom({ roomInfo: userExists, userData, socket });
  }

  socket.join(roomId);
  room.users.push(userData);
  return room;
}

function leaveRoom({ roomInfo, userData, socket }) {
  const { roomId } = roomInfo;
  const room = rooms.find((room) => room.id === roomId);
  if (!room) {
    return { error: "Room not found" };
  }

  socket.leave(roomId);
  room.users = room.users.filter((user) => user.id !== userData.id);
  return room;
}

function getRooms({ io }) {
  return io.sockets.adapter.rooms;
}

function getRoom({ roomInfo }) {}

function getRandomNamesForRooms() {
  const names = [
    "Let's go crack this game",
    "Come and play with me",
    "Don't be shy, join me",
    "I'm waiting for you to play this",
    "I'm bored, let's play",
    "I'm lonely, come and play with me",
    "I'm feeling lucky, let's play",
    "I'm feeling lucky, come and play with me",
    "Let's play together",
    "Do you want to play with me?",
    "Can you beat me?",
    "Hey noob, come and play with me",
  ];
  return names[Math.floor(Math.random() * names.length)];
}
