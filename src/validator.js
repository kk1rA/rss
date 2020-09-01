// eslint-disable-next-line import/no-extraneous-dependencies
import isURL from 'validator/lib/isURL';

export default ({ input, feeds }) => {
  if (isURL(input) && !feeds.includes(input)) {
    return true;
  }
  return false;
};
