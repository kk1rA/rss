import { uniqueId } from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const channelTitle = doc.querySelector('title').textContent;
  const channelDesc = doc.querySelector('description').textContent;
  const channelID = uniqueId('channel_');

  const items = [...doc.querySelectorAll('item')].map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDesc = item.querySelector('description').textContent;
    const pubDateStr = item.querySelector('pubDate').textContent;
    const pubDate = new Date(pubDateStr).getTime();
    const id = uniqueId('item_');
    return {
      id,
      itemTitle,
      itemLink,
      itemDesc,
      pubDate,
    };
  });

  return {
    channelID,
    channelTitle,
    channelDesc,
    items,
  };
};
