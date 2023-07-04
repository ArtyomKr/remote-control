import { IPlayerReq, IPlayerRes } from '../models/index.js';
import { addUser, findUser } from '../dbHelpers/index.js';

function loginHandler(req: IPlayerReq): IPlayerRes {
  const res = {
    type: req.type,
    data: {
      index: 0,
      name: '',
      error: true,
      errorText: 'User not found!',
    },
    id: req.id,
  };
  const user = { ...req.data, id: req.id };
  const foundUser = findUser(user.name);

  if (foundUser && foundUser.password === user.password) {
    const { id, name } = foundUser;
    res.data = {
      index: id,
      name,
      error: false,
      errorText: '',
    };
  } else if (foundUser && foundUser.password !== user.password) res.data.errorText = 'Incorrect password!';
  else if (!foundUser) {
    const { id, name } = addUser(user);
    res.data = {
      index: id,
      name,
      error: false,
      errorText: '',
    };
  }

  return res;
}

export default loginHandler;
