//@ts-check
'use strict';

class EventEmitter {
  constructor () {
    this.eventListeners = [];
  }

  trigger (eventName, ...args) {
    this.eventListeners.forEach(listener => {
      const [savedEventName, f] = listener;
      if (savedEventName === eventName) {
        f(...args);
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

class Chat extends EventEmitter {
  constructor ({source, pollInterval}) {
    super();
    this.source = source;
    this.pollInterval = pollInterval || 3000;
    this.isEnabled = false;
    this.timerId = 0;
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
    this.load()
    this.trigger('start')
  }

  stop () {
    this.isEnabled = false;
    if (this.timerId) clearInterval(this.timerId)
    this.trigger('stop')
  }
}

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

let pageNumber = 1;
chat.on('load', () => {
  chat.source = chat.source.replace(/(_page=)\d+/, '$1' + (pageNumber = getNextPageNumber(pageNumber, 1 , 101)));
});

/** Safely increment a number by 1 within the boundaries
 * of min (inclusive) and max (exclusive). When the max boundary
 * is reached. The function will return the min number.
 * @param {number} pageNumber the current number you want to increment
 * @param {number} min
 * @param {number} max
 */
function getNextPageNumber (pageNumber, min, max) {
  return Math.min(100, Math.max(min, (pageNumber + 1) % max));
}
