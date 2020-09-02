import axios from 'axios';
import { flatten, maxBy } from 'lodash';
import parseChannel from './parser';

export const getLatestItemDate = (items) => maxBy(items, 'pubDate').pubDate;

const getNewChannelItems = ({ items }, i) => {
  const latestItemDate = getLatestItemDate(items);
  // eslint-disable-next-line no-undef
  const channel = states.channels[i];
  if (latestItemDate <= channel.latestItemDate) {
    return [];
  }
  const newChannelItems = items.filter(({ pubDate }) => (
    pubDate > channel.latestItemDate));
  newChannelItems.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.channelId = channel.channelId;
  });
  // eslint-disable-next-line no-undef
  states.channels[i].latestItemDate = latestItemDate;
  return newChannelItems;
};

export const updateChannels = (states) => {
  const { channels } = states;
  const requests = channels.map(({ channelFeed }) => axios.get(channelFeed));
  axios.all(requests)
    .then((responses) => {
      const newChannels = responses.map((response) => parseChannel(response.data));
      const newItems = newChannels.map(getNewChannelItems);
      const itemsToUpdate = flatten(newItems);
      if (itemsToUpdate.length > 0) {
        // eslint-disable-next-line no-param-reassign
        states.toUpdate = itemsToUpdate;
      }
    })
    .catch((state, error) => {
      // eslint-disable-next-line no-param-reassign
      states.error = error;
      // eslint-disable-next-line no-param-reassign
      states.formState = 'error';
    })
    .finally(() => setTimeout(updateChannels, 5000));
};
