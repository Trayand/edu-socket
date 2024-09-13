const { v4: uuid } = require("uuid");
// const namesJson = require("./data/names.json");
const axios = require("axios");

const maxPlayers = 6;
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
    status: "waiting", // waiting, playing, finished
  },
];

const eventEmitList = {
  server: [
    "user/new-user-connected",
    "user/user-disconnected",
    "user/new-user",
    "update-user-info",
    "room/room-list",
    "room/room-info",
    "room/room-created",
    "room/user-joined",
    "room/user-left",
  ],
  client: [
    "user/new-user-username",
    "room/get-rooms",
    "room/create-room",
    "room/join-room",
    "room/room-info",
    "room/leave-room",
    "disconnect",
  ],
};

module.exports = function (socket, io) {
  console.log("A user connected");

  socket.user = {
    id: uuid(),
    username: null,
    socketId: socket.id,
    isReady: false,
    point: 0,
  };

  socket.emit("user/new-user", socket.user);

  socket.on("user/new-user-username", ({ username }) => {
    socket.user.username = username;
    socket.user.imgUrl = `https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&&seed=${username}-${socket.user.id}`;

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

    const room = rooms.find((room) => room.id === id);
    if (!room) {
      return socket.emit("error", { error: "Room not found" });
    }

    if (room.users.length >= maxPlayers) {
      return socket.emit("error", { error: "Room is full" });
    }

    if (room.isPrivate && room.password !== password) {
      return socket.emit("error", { error: "Incorrect password" });
    }

    const userExists = rooms.find((room) =>
      room.users.some((user) => user.id === socket.user.id)
    );

    if (userExists) {
      leaveRoom({ roomInfo: userExists, userData: socket.user, socket });
    }

    socket.join(id);
    room.users.push(socket.user);

    // notify all users in the room
    io.to(id).emit("room/user-joined", room);
  });

  socket.on("room/room-info", (roomInfo) => {
    const { id } = roomInfo;
    const room = rooms.find((room) => room.id === id);

    if (!room) {
      return socket.emit("error", { error: "Room not found" });
    }

    socket.emit("room/room-info", room);
  });

  socket.on("room/leave-room", (roomInfo) => {
    const { id } = roomInfo;
    const room = leaveRoom({
      roomInfo: { roomId: id },
      userData: socket.user,
      socket,
    });
    io.to(id).emit("room/user-left", { room, users: room.users });
  });

  socket.on("game/user-state-ready", (roomInfo) => {
    const { id } = roomInfo;
    const room = rooms.find((room) => room.id === id);
    if (!room) {
      return socket.emit("error", { error: "Room not found" });
    }

    socket.user.isReady = !socket.user.isReady;
    io.to(id).emit("game/user-ready", room.users);
  });

  socket.on("leave-all-rooms", () => {
    leaveAllRooms(socket);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    disconnectUser({ userData: socket.user, socket });

    socket.broadcast.emit("user/user-disconnected", socket.user);
  });
};

function disconnectUser({ userData, socket }) {
  const { id } = userData;
  const user = users.find((user) => user.id === id);
  if (user) {
    users = users.filter((user) => user.id !== id);
  }

  leaveAllRooms(socket);

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

function leaveRoom({ roomInfo, userData, socket }) {
  const { roomId } = roomInfo;
  const room = rooms.find((room) => room.id === roomId);
  if (!room) {
    return { error: "Room not found" };
  }

  socket.leave(roomId);
  socket.user.isReady = false;
  room.users = room.users.filter((user) => user.id !== userData.id);
  return room;
}

function leaveAllRooms(socket) {
  rooms.forEach((room) => {
    socket.leave(room.id);
    room.users = room.users.filter((user) => user.id !== socket.user.id);
    socket.to(room.id).emit("room/room-info", room);
  });
}

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

function startGame(io, socket, room) {
  let counter = 5;
  const gameStat = {
    status: "waiting",
    words: [],
    currentWord: "",
    currentWordIndex: 0,
    currentWordGif: [],
    currentWordClue: "",
    currentWordAnswer: "",
    currentWordGuessed: false,
    gameTimer: 60,
  };

  // Server will hit API to get random word
  axios
    .get("https://random-word-api.herokuapp.com/word?number=10")
    .then((response) => {
      gameStat.words = response.data;
      gameStat.currentWord = gameStat.words[gameStat.currentWordIndex];
    })
    .catch((error) => {
      io.to(room.id).emit("error", { error: "Failed to get word" });
    });

  const counterInterval = setInterval(() => {
    counter--;
    io.to(room.id).emit("game/start-game-counter", counter);
    if (counter === 0) {
      clearInterval(counterInterval);
      gameStat.status = "playing";
      // startGame(io, socket, room)
    }
  }, 1000);
}
