import '../scss/main.scss';
import '../index.html';
import createWrap from './modules/keyboardWrap';
import createKeyboard from './modules/keyboard';
import keys from './modules/keys';
import createInfo from './modules/info';

const body = document.querySelector('body');
const wrap = createWrap();
const keyboard = createKeyboard();
const info = createInfo();
body.append(wrap);
wrap.append(keyboard);
wrap.append(info);
const display = document.querySelector('.keyboard-wrap__display');
let isCapsLock = false;
let isShift = false;
let isShiftPressed = false;
let lang = 'en';

if (localStorage.getItem('lang') === null) {
  localStorage.setItem('lang', 'en');
} else {
  lang = localStorage.getItem('lang', lang);
}

const updateButtons = (keyId) => {
  const buttons = document.querySelectorAll('.key');
  for (let i = 0; i < buttons.length; i += 1) {
    if (keyId === 'ru') {
      if (isCapsLock) {
        buttons[i].innerHTML = keys[buttons[i].id].capsRu;
      } else {
        buttons[i].innerHTML = keys[buttons[i].id].ru;
      }
    }
    if (keyId === 'en') {
      if (isCapsLock) {
        buttons[i].innerHTML = keys[buttons[i].id].capsEn;
      } else {
        buttons[i].innerHTML = keys[buttons[i].id].en;
      }
    }
    if (keyId === 'CapsLock') {
      if (isCapsLock) {
        buttons[i].innerHTML = keys[buttons[i].id][`${lang === 'en' ? 'capsEn' : 'capsRu'}`];
        document.querySelector('#CapsLock').classList.add('pressed');
      }
      if (!isCapsLock) {
        buttons[i].innerHTML = keys[buttons[i].id][`${lang === 'en' ? 'en' : 'ru'}`];
        document.querySelector('#CapsLock').classList.remove('pressed');
      }
    }
    if (keyId === 'ShiftLeft' || keyId === 'ShiftRight') {
      if (isShift) {
        buttons[i].innerHTML = keys[buttons[i].id][`${lang === 'en' ? 'shiftEn' : 'shiftRu'}`];
        document.querySelector(`#${keyId}`).classList.add('pressed');
      }
      if (!isShift) {
        buttons[i].innerHTML = keys[buttons[i].id][`${lang === 'en' ? 'en' : 'ru'}`];
        document.querySelector(`#${keyId}`).classList.remove('pressed');
      }
    }
  }
};

const keysKeys = Object.keys(keys);

keysKeys.forEach((it) => {
  const keyNode = document.createElement('button');
  keyNode.innerHTML = localStorage.getItem('lang') === 'en' ? keys[it].en : keys[it].ru;
  keyNode.classList.add('key');
  keyNode.id = `${it}`;

  if (keyNode.id === 'Backspace') {
    keyNode.addEventListener('mousedown', () => {
      display.value = display.value.slice(0, display.value.length - 1);
    });
  } else if (keyNode.id === 'Tab') {
    keyNode.addEventListener('mousedown', () => {
      display.value += '  ';
    });
  } else if (keyNode.id === 'CapsLock') {
    keyNode.addEventListener('mousedown', () => {
      isCapsLock = !isCapsLock;
      updateButtons(keyNode.id);
    });
  } else if (keyNode.id === 'Enter') {
    keyNode.addEventListener('mousedown', () => {
      display.value += '\n';
    });
  } else if (keyNode.id === 'ShiftLeft' || keyNode.id === 'ShiftRight') {
    keyNode.addEventListener('mousedown', () => {
      isShiftPressed = true;
      isShift = !isShift;
      updateButtons(keyNode.id);
    });
  } else if (keyNode.id === 'ControlLeft' || keyNode.id === 'ControlRight') {
    keyNode.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
  } else if (keyNode.id === 'AltLeft' || keyNode.id === 'AltRight') {
    keyNode.addEventListener('mousedown', (event) => {
      event.preventDefault();

      if (isShiftPressed) {
        if (lang === 'en') {
          lang = 'ru';
        } else {
          lang = 'en';
        }
        localStorage.setItem('lang', `${lang === 'en' ? 'en' : 'ru'}`);
        updateButtons(lang);
      }
    });

    keyNode.addEventListener('mouseup', () => {
      if (isShiftPressed) {
        document.querySelectorAll('.pressed').forEach((btn) => {
          btn.classList.remove('pressed');
        });
        isShiftPressed = false;
      }
    });
  } else if (keyNode.id === 'Space') {
    keyNode.addEventListener('mousedown', () => {
      display.value += ' ';
    });
  } else {
    keyNode.addEventListener('mousedown', () => {
      display.value += keyNode.textContent;
    });
  }
  keyNode.addEventListener('mousedown', () => {
    keyNode.classList.add('active');
  });

  keyNode.addEventListener('mouseup', () => {
    keyNode.classList.remove('active');
  });

  keyboard.appendChild(keyNode);
});

document.addEventListener('keydown', (event) => {
  if (keys[event.code] === undefined) {
    return;
  }

  event.preventDefault();
  document.getElementById(`${event.code}`).classList.add('active');

  if (event.code === 'Enter') {
    display.value += '\n';
  } else if (event.code === 'Backspace') {
    display.value = display.value.slice(0, display.value.length - 1);
  } else if (event.code === 'CapsLock') {
    isCapsLock = !isCapsLock;
    updateButtons(event.code);
  } else if (event.code === 'Tab') {
    display.value += '  ';
  } else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    isShift = !isShift;
    isShiftPressed = true;
    updateButtons(event.code);
  } else if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
    event.preventDefault();
  } else if (event.code === 'AltLeft' || event.code === 'AltRight') {
    event.preventDefault();
    if (isShiftPressed) {
      if (lang === 'en') {
        lang = 'ru';
      } else {
        lang = 'en';
      }
      localStorage.setItem('lang', `${lang === 'en' ? 'en' : 'ru'}`);
      updateButtons(lang);
    }
  } else if (event.code === 'ArrowUp') {
    display.value += '↑';
  } else if (event.code === 'ArrowRight') {
    display.value += '→';
  } else if (event.code === 'ArrowDown') {
    display.value += '↓';
  } else if (event.code === 'ArrowLeft') {
    display.value += '←';
  } else {
    display.value += lang === 'en' ? keys[event.code].en : keys[event.code].ru;
  }
});

document.addEventListener('keyup', (event) => {
  if (keys[event.code] === undefined) {
    return;
  }

  document.getElementById(`${event.code}`).classList.remove('active');

  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    isShift = !isShift;
    isShiftPressed = false;
    updateButtons(event.code);
  }
});
