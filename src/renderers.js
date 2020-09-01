export const renderAlert = (message) => `
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;

export const renderList = ({ channels }) => {
  const feedsElement = document.getElementById('feeds');
  const listHtml = channels.map(({
    channelTitle, channelDesc, channelId, items,
  }) => `
    <a href="#${channelId}" class="text-decoration-none text-body" role="button" data-toggle="collapse" aria-expanded="true" aria-controls="${channelId}">
      <div>
        <h2>${channelTitle}</h2>
        <p>${channelDesc}</p>
      </div>
    <ul class="list-group list-group collapse show" id="${channelId}">
      ${items.map(({ itemTitle, itemLink, id }) => `<li class="list-group-item fadeIn" style="display:none">
        <a href="${itemLink}">${itemTitle}</a>
        <button type="button" class="btn btn-outline-secondary btn-sm float-right" data-toggle="modal" data-target="#${id}">
          Preview
        </button>
      </li>`).join('')}
    </ul><p></p>`).join('');
  feedsElement.innerHTML = listHtml;
};

export const renderModal = ({ channels }) => {
  const modalContainer = document.getElementById('modalContainer');
  const modalHtml = channels.map(({ items }) => items.map(({ itemTitle, itemDesc, id }) => `
    <div>
      <div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${itemTitle}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ${itemDesc}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>`).join('')).join('');
  modalContainer.innerHTML = modalHtml;
};

export const renderUpdate = ({ toUpdate }) => {
  toUpdate.forEach(({
    channelId, id, itemLink, itemTitle,
  }) => {
    const channelEl = document.getElementById(channelId);
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'fadeIn');
    liEl.setAttribute('style', 'display:none');
    liEl.innerHTML = `
      <a href="${itemLink}">${itemTitle}</a>
      <button type="button" class="btn btn-outline-secondary btn-sm float-right" data-toggle="modal" data-target="#${id}">
        Preview
      </button>`;
    channelEl.prepend(liEl);
  });
  const modalContainer = document.getElementById('modalContainer');
  const divEl = document.createElement('div');
  const modalHtml = toUpdate.map(({ itemTitle, itemDesc, id }) => `
    <div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${itemTitle}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ${itemDesc}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`).join('');
  divEl.innerHTML = modalHtml;
  modalContainer.append(divEl);
};
