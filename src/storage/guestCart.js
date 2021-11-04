import { getWithExpire, setWithExpire } from '../utils/storage';

const name = 'SONY_STORE_GUEST_CART';

const gc = {
  data: [],
  fetch () {
    const data = getWithExpire(name);
    gc.data = data ? data : [];
  },
  set (data) {
    gc.fetch();

    Array.isArray ? gc.data = gc.data.concat(data) : gc.data.push(data);
    setWithExpire(name, gc.data);
  },
  cover (data) {
    gc.data = data;
    setWithExpire(name, gc.data);
  },
  get items () {
    return gc.data;
  },
};

export default gc;