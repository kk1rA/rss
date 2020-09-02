import { watch } from 'melanke-watchjs';
import $ from 'jquery';
import { renderList, renderModal, renderUpdate } from './renderers';

const watchers = (methods, states) => {
  watch(states, 'formState', () => {
    methods[states.formState]();
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
};

export default watchers;
