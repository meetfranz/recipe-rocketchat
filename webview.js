import { ipcRenderer } from 'electron';

const getTeamIcon = function getTeamIcon() {
  console.log('getTeamIcon');

  let manifestElement = document.querySelector('link[rel="manifest"]');

  if (manifestElement == null) {
    return;
  }

  let manifestUrl = manifestElement.getAttribute('href');

  if (manifestUrl == null) {
    return;
  }

  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState != 4 || this.status != 200) {
      return;
    }

    let response = JSON.parse(this.responseText);

    if (response.icons.length >= 1) {
      ipcRenderer.sendToHost('avatar', window.location.protocol + '//' + window.location.host + '/' + response.icons[0]['src']);
    }
  };
  xmlhttp.open('GET', manifestUrl, true);
  xmlhttp.send();
};

module.exports = (Franz) => {
  const getMessages = function getMessages() {
    const directMessages = Math.round(document.querySelectorAll('.unread.unread-mention').length / 2);
    const indirectMessages = Math.round(document.querySelectorAll('.unread:not(.unread-mention)').length / 2);
    Franz.setBadge(directMessages, indirectMessages);
  };

  Franz.loop(getMessages);

  setTimeout(() => {
    getTeamIcon();
  }, 4000);
};
