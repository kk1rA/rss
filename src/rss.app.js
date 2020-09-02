import axios from 'axios';
import $ from 'jquery';
import { updateChannels, getLatestItemDate } from './rss.chanels';
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
  watchers(formStateMethods, states);
  updateChannels(states);
};
