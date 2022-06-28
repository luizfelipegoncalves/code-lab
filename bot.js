import confetti from "https://cdn.skypack.dev/canvas-confetti";

window.confetti = confetti;

console.clear();

////////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function* enumerate(iter) {
  let i = 0;
  for (const item of iter) {
    yield [i++, item];
  }
}

function* withNext(iterable) {
  const iterator = iterable[Symbol.iterator]();
  let curr = iterator.next();
  let next = iterator.next();
  while (!curr.done) {
    yield { curr: curr.value, next: next.value };
    [curr, next] = [next, iterator.next()];
  }
}

// Taken from my answer on `pt.stackoverflow.com`.
// https://pt.stackoverflow.com/a/527126
function* withLast(iterable) {
  const iterator = iterable[Symbol.iterator]();
  let curr = iterator.next();
  let next = iterator.next();
  while (!curr.done) {
    yield [next.done, curr.value];
    [curr, next] = [next, iterator.next()];
  }
}

////////////////////////////////////////////////////////////////////////////////
// BOT UTILITY FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function genButton(bot, nextBotFn) {
  const button = document.createElement("button");
  button.textContent = "Próximo";
  button.classList.add("bot-button");
  button.addEventListener("click", nextBotFn);
  bot.appendChild(button);
}

function genAvatar(wrapper) {
  const sub = document.createElement("div");
  wrapper.appendChild(sub);
}

////////////////////////////////////////////////////////////////////////////////
// BOT STARTUP
////////////////////////////////////////////////////////////////////////////////

const bots = document.querySelectorAll(".bot");

for (const [i, [isLastBot, { curr: bot, next }]] of enumerate(
  withLast(withNext(bots))
)) {
  bot.dataset.index = i;
  bot.dataset.hidden = !(i === 0);

  const avatarWrapper = bot.querySelector(".bot-avatar");
  genAvatar(avatarWrapper);

  const children = bot.querySelector(".bot-content").children;

  for (const [
    i,
    [isLastChildren, { curr: child, next: nextChild }],
  ] of enumerate(withLast(withNext(children)))) {
    child.dataset.hidden = !(i === 0);

    genButton(child, function (event) {
      confetti();

      if (isLastChildren) {
        // next bot
        bot.dataset.hidden = true;
        if (!isLastBot) {
          next.dataset.hidden = false;
        }
      } else {
        // next bot screen
        child.dataset.hidden = true;
        nextChild.dataset.hidden = false;
      }
    });
  }
}
