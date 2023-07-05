import { IPlayerReq, IPlayerRes } from '../models/index.js';
import { addUser, findUserByName } from '../dbHelpers/index.js';

function loginHandler(req: IPlayerReq): IPlayerRes {
  const res = {
    type: req.type,
    data: {
      index: NaN,
      name: '',
      error: true,
      errorText: 'Incorrect password!',
    },
    id: req.id,
  };
  const user = { ...req.data, index: req.id };
  const foundUser = findUserByName(user.name);

  if (!foundUser || (foundUser && foundUser.password === user.password)) {
    const { index, name } = foundUser ? foundUser : addUser(user);
    res.data = {
      index,
      name,
      error: false,
      errorText: '',
    };
  }

  return res;
}

export default loginHandler;
