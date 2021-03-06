import axios from 'axios';
import $ from 'jquery';
import { flatten, maxBy } from 'lodash';
import isValid from './validator';
import parseChannel from './parser';
import { renderAlert } from './renderers';
import watchers from './watchers';

export default () => {
  const states = {
    formState: '',
    input: '',
    feeds: [],
    error: '',
    channels: [],
    toUpdate: [],
  };

  const input = document.getElementById('feed-input');
  const button = document.getElementById('button-addon2');
  const alert = document.getElementById('alert');
  const proxy = 'https://cors-anywhere.herokuapp.com/';

  const formStateMethods = {
    valid() {
      input.classList.remove('is-invalid');
      button.removeAttribute('disabled');
    },
    loading() {
      button.setAttribute('disabled', 'disabled');
    },
    // отлавливаем ошибку + тригер на закртие
    error() {
      // eslint-disable-next-line no-console
      console.log(states.error);
      alert.innerHTML = renderAlert('Wrong link..Try again');
      setTimeout(() => {
        $('.alert').alert('close');
      }, 5000);
    },
  };

  input.addEventListener('input', ({ target }) => {
    states.input = target.value;
    states.formState = isValid(states) ? 'valid' : 'invalid';
  });

  const getLatestItemDate = (items) => maxBy(items, 'pubDate').pubDate;

  button.addEventListener('click', () => {
    const feed = states.input;
    states.formState = 'loading';
    axios.get(`${proxy}${feed}`)
      .then((response) => {
        const parsedChannel = parseChannel(response.data);
        parsedChannel.channelFeed = response.config.url;
        parsedChannel.latestItemDate = getLatestItemDate(parsedChannel.items);
        states.channels.push(parsedChannel);
        states.feeds.push(feed);
        states.formState = 'init';
      })
      .catch((error) => {
        states.error = error;
        states.formState = 'error';
      });
  });

  input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      button.click();
    }
  });

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

  const updateChannels = () => {
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

  watchers(formStateMethods, states);

  updateChannels(states);
};
