import $ from 'jquery';
import { watch } from 'melanke-watchjs';
import { flatten, maxBy } from 'lodash';
import axios from 'axios';
import isValid from './validator';
import parseChannel from './parser';
import {
  renderList, renderAlert, renderModal, renderUpdate,
} from './renderers';

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
  const loading = document.getElementById('loading-icon');
  const alert = document.getElementById('alert');
  const proxi = 'https://cors-anywhere.herokuapp.com/';

  const stateForms = {
    valid() {
      input.classList.add('is-invalid');
      button.setAttribute('disabled');
    },
    invalid() {
      input.classList.add('is-invalid');
      button.setAttribute('disabled', 'disabled');
    },
    loading() {
      button.setAttribute('disabled', 'disabled');
      loading.classList.remove('invisible');
    },
    init() {
      loading.classList.add('invisible');
      input.value = '';
      button.setAttribute('disabled', 'disabled');
    },
    error() {
      loading.classList.add('invisible');
      console.log(states.error);
      alert.innerHTML = renderAlert('Error!');
      setTimeout(() => {
        $('.alert').alert('close');
      }, 7000);
    },
  };

  const getLatestItem = (item) => maxBy(item, 'pubDate').pubDate;

  input.addEventListener('input', ({ target }) => {
    states.input = target.value;
    states.formState = isValid(states) ? 'valid' : 'invalid';
  });

  button.addEventListener('click', () => {
    const feed = states.input;
    axios.formState = 'loading';
    axios.get(`${proxi}${feed}`)
      .then((response) => {
        const parsedch1 = parseChannel(response.data);
        parsedch1.channelFeed = response.config.url;
        parsedch1.latestItem = getLatestItem(parsedch1.items);
        states.channels.push(parsedch1);
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
    const latestItemDate = getLatestItem(items);
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
      // eslint-disable-next-line no-unused-vars
      .finally(() => setTimeout(updateChannels, 5000));
  };

  watch(states, 'formState', () => {
    stateForms[states.formState]();
  });

  watch(states, 'feeds', () => {
    renderList(states);
    renderModal(states);
    $('.fadeIn').fadeIn('slow');
  });

  watch(states, 'toUpdate', () => {
    renderUpdate(states);
    $('.fadeIn').fadeIn('slow');
  });

  updateChannels(states);
};
