import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

export const UserContext = createContext({
  user: {
    id: null,
    username: null,
    imgUrl: null, // https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&&seed=Felix
  },
  setUser: () => { },
});

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    id: "1naop34lkDO3KASD2123",
    username: "Felix",
    imgUrl: "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&&seed=Felix-1naop34lkDO3KASD2123",
    // id: null,
    // username: null,
    // imgUrl: null,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}