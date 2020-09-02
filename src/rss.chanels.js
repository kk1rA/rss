import axios from 'axios';
import { flatten, maxBy } from 'lodash';
import parseChannel from './parser';

export const getLatestItemDate = (items) => maxBy(items, 'pubDate').pubDate;

const getNewChannelItems = ({ items }, i) => {
  const latestItemDate = getLatestItemDate(items);
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
        states.toUpdate = itemsToUpdate;
      }
    })
    .catch((error) => {
      states.error = error;
      states.formState = 'error';
    })
    .finally(() => setTimeout(updateChannels, 5000));
};
