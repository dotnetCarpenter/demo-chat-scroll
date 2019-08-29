//@ts-check
'use strict';

// Utility
class EventEmitter {
  constructor () {
    this.eventListeners = [];
  }

  trigger (eventName, ...args) {
    this.eventListeners.forEach(listener => {
      const [savedEventName, f] = listener;
      if (savedEventName === eventName) {
        f.call(this, ...args);
      }
    });
  }

  on (eventName, f) {
    this.eventListeners.push([eventName, f]);
  }

  off (eventName, f) {
    this.eventListeners = this.eventListeners.filter(([savedEventName, savedF]) => {
      if (f != null) {
        if (eventName === savedEventName && f === savedF) {
          return false;
        }
      } else {
        if (eventName === savedEventName) {
          return false;
        }
      }
      return true;
    });
  }
}

// Model
class Chat extends EventEmitter {
  constructor ({source, pollInterval}) {
    super();
    this.source = source;
    this.pollInterval = pollInterval || 3000;
    this.isEnabled = false;
    this.timerId = 0;
    this.pageNumber = 1;
  }

  load () {
    fetch(this.source)
      .then(async response => {
        const json = await response.json()
        this.trigger('received', json)
      })

    this.trigger('load')
  }

  start () {
    this.isEnabled = true;
    this.timerId = setInterval(this.load.bind(this), this.pollInterval)

    this.on('load', this.setNextPageNumber);

    this.trigger('start')
    this.load()
  }

  stop () {
    this.isEnabled = false;

    if (this.timerId) clearInterval(this.timerId)
    this.off('load', this.setNextPageNumber);

    this.trigger('stop')
  }

  setNextPageNumber () {
    this.pageNumber = Math.min(100, Math.max(1, (this.pageNumber + 1) % 101));
    this.source = this.source.replace(/(_page=)\d+/, '$1' + this.pageNumber);
  }
}

// Controller

const source = 'https://jsonplaceholder.typicode.com/posts?_page=1&_limit=1'; // or 'load_chat.php'

const element = document.querySelector('.chat');
const output = element.querySelector('.chat__output');
const toggle = element.querySelector('.chat__toggle');

const chat = new Chat({source, pollInterval: 1000});

toggle.addEventListener('click', event => {
  event.preventDefault();

  if (chat.isEnabled) {
    chat.stop();
  } else {
    chat.start();
  }
});

chat.on('start', () => {
  toggle.textContent = 'Disable';
  element.classList.remove('chat--disabled');
  element.classList.add('chat--enabled');
});

chat.on('stop', () => {
  toggle.textContent = 'Enable';
  element.classList.remove('chat--enabled');
  element.classList.add('chat--disabled');
});

chat.on('received', json => {
  if (json && json[0] && json[0].title) {
    const isScrolledToBottom = output.scrollHeight - output.clientHeight <= output.scrollTop + 1;
    const message = json[0].title;
    const messageElement = document.createElement('p');

    messageElement.classList.add('chat__message');
    messageElement.innerHTML = message;
    output.appendChild(messageElement);

    if (isScrolledToBottom) {
      output.scrollTop = output.scrollHeight - output.clientHeight;
    }
  }
});
