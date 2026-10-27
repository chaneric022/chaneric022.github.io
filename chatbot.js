/* ================================================================
   ERIC'S CHATBOT — ENGINE + CHAT BUBBLE
   ----------------------------------------------------------------
   You normally don't need to edit this file. Change what the bot
   says in chatbot-data.js instead.

   How it answers: it cleans up the visitor's question, compares its
   words to each topic's keywords (allowing small typos), scores
   every topic, and replies with the best match. If nothing scores
   high enough, it gives the fallback reply. No server, no AI API.
   ================================================================ */
(function () {
  "use strict";
  var DATA = window.ERIC_BOT;
  if (!DATA) { console.warn("chatbot-data.js did not load"); return; }

  /* ---------- Text cleanup ---------- */
  function normalize(text) {
    return (" " + text.toLowerCase() + " ")
      .replace(/résumé/g, "resume")
      .replace(/c\+\+/g, " cplusplus ")
      .replace(/c#/g, " csharp ")
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function stem(word) {
    if (word.length > 5 && /ing$/.test(word)) return word.slice(0, -3);
    if (word.length > 4 && /ed$/.test(word)) return word.slice(0, -2);
    if (word.length > 3 && /s$/.test(word) && !/ss$/.test(word)) return word.slice(0, -1);
    return word;
  }
  function words(text) {
    return normalize(text).split(" ").filter(Boolean).map(stem);
  }
  // Allows one typo in words of 5+ letters ("pyhton" → "python")
  function closeEnough(a, b) {
    if (a === b) return true;
    if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1) return false;
    // two neighboring letters swapped ("pyhton")
    if (a.length === b.length) {
      var diff = [];
      for (var d = 0; d < a.length; d++) if (a[d] !== b[d]) diff.push(d);
      if (diff.length === 2 && diff[1] === diff[0] + 1 && a[diff[0]] === b[diff[1]] && a[diff[1]] === b[diff[0]]) return true;
    }
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length] <= 1;
  }

  /* ---------- Prepare topics once ---------- */
  var topics = DATA.topics.map(function (t) {
    return {
      raw: t,
      keys: t.keywords.map(function (k) { return words(k); }).filter(function (k) { return k.length; })
    };
  });

  /* ---------- "Does he know <language>?" ---------- */
  var KNOWN = DATA.languages || [];
  var OTHER_LANGS = ["javascript", "typescript", "rust", "go", "golang", "ruby", "php", "swift", "kotlin",
    "lua", "r", "css", "scala", "perl", "haskell", "dart", "matlab", "bash", "assembly", "gdscript"];
  var LANG_KEY = { "cplusplus": "C++", "csharp": "C#" };
  function languageAnswer(question) {
    var clean = normalize(question);
    if (!/\b(know|knows|use|uses|used|program|programs|code|codes|coding|familiar|experience|work|works|worked|proficient|write|writes)\b/.test(clean)) return null;
    var raw = clean.split(" ");
    for (var i = 0; i < raw.length; i++) {
      var w = raw[i];
      var known = KNOWN.filter(function (k) { return normalize(k) === w || LANG_KEY[w] === k || closeEnough(w, normalize(k)); })[0];
      if (known) return "Yes, " + known + " is one of Eric's languages. He works with " + KNOWN.join(", ") + ".";
      if (OTHER_LANGS.indexOf(w) !== -1) {
        if (w === "assembly") return "Yes, Eric took a course in Assembly Language. His main languages are " + KNOWN.join(", ") + ".";
        var NAMES = { javascript: "JavaScript", typescript: "TypeScript", php: "PHP", css: "CSS", golang: "Go", gdscript: "GDScript", matlab: "MATLAB", r: "R" };
        var name = NAMES[w] || (w.charAt(0).toUpperCase() + w.slice(1));
        return name + " isn't on Eric's résumé. The languages he works with are " + KNOWN.join(", ") + ", and he's always eager to pick up new ones.";
      }
    }
    return null;
  }

  /* ---------- Find the best answer ---------- */
  var lastTopic = null;
  var MORE = /^(tell me more|more|go on|keep going|and|elaborate|details|more details|anything else about that|what else)$/;

  function respond(question) {
    var clean = normalize(question);
    var qWords = words(question);
    if (!qWords.length) return { text: DATA.fallback, suggest: true };

    if (MORE.test(clean) || /^(tell me more|more about that|can you elaborate)/.test(clean)) {
      if (lastTopic && lastTopic.more) return { text: lastTopic.more, links: lastTopic.links };
      if (lastTopic) return { text: "That's everything I have on that topic. Want to ask about something else?", suggest: true };
    }

    var lang = languageAnswer(question);
    if (lang) { lastTopic = null; return { text: lang, links: [{ label: "See all skills", href: "#skills" }] }; }

    var best = null, bestScore = 0;
    topics.forEach(function (t) {
      if (t.raw.short && qWords.length > 4) return;
      var score = 0;
      t.keys.forEach(function (key) {
        if (key.length > 1) {
          // phrase: every word must appear in order
          if ((" " + qWords.join(" ") + " ").indexOf(" " + key.join(" ") + " ") !== -1) score += 3 * key.length;
        } else {
          var k = key[0];
          if (qWords.indexOf(k) !== -1) score += 2;
          else if (qWords.some(function (w) { return closeEnough(w, k); })) score += 1;
        }
      });
      if (score > bestScore) { bestScore = score; best = t.raw; }
    });

    if (!best || bestScore < 2) { lastTopic = null; return { text: DATA.fallback, suggest: true }; }
    lastTopic = best;
    return { text: best.answer, links: best.links };
  }
  window.ERIC_BOT.respond = respond; // handy for testing in the browser console

  /* ---------- Styles (uses the page's colors when available) ---------- */
  var css = "" +
    ".ebot-launch{position:fixed;right:calc(20px + env(safe-area-inset-right,0px));bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:50;display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:999px;border:1px solid var(--accent,#f0a860);background:var(--accent,#f0a860);color:#1b1408;font:600 .95rem var(--font-body,system-ui,sans-serif);cursor:pointer;box-shadow:0 12px 32px -12px #000}" +
    ".ebot-launch:hover{filter:brightness(1.08)}" +
    ".ebot-launch svg{width:18px;height:18px}" +
    ".ebot-panel{position:fixed;right:calc(20px + env(safe-area-inset-right,0px));bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:50;width:min(380px,calc(100vw - 32px - env(safe-area-inset-left,0px) - env(safe-area-inset-right,0px)));height:min(560px,calc(100vh - 120px - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px)));display:flex;flex-direction:column;background:var(--surface,#1a1d28);color:var(--fg,#e6e8ef);border:1px solid var(--line,#2a2e3d);border-radius:14px;overflow:hidden;box-shadow:0 30px 70px -30px #000;font-family:var(--font-body,system-ui,sans-serif)}" +
    ".ebot-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line,#2a2e3d)}" +
    ".ebot-head strong{font-family:var(--font-display,inherit);font-size:1.05rem}" +
    ".ebot-head small{display:block;color:var(--muted,#9095a8);font-family:var(--font-mono,monospace);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase}" +
    ".ebot-x{background:none;border:0;color:var(--muted,#9095a8);font-size:1.4rem;line-height:1;cursor:pointer;padding:4px 8px;border-radius:6px}" +
    ".ebot-x:hover{color:var(--fg,#e6e8ef)}" +
    ".ebot-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}" +
    ".ebot-msg{max-width:85%;padding:10px 13px;border-radius:12px;line-height:1.5;font-size:.93rem;white-space:pre-line;overflow-wrap:anywhere}" +
    ".ebot-bot{align-self:flex-start;background:var(--bg,#12141c);border:1px solid var(--line,#2a2e3d);border-bottom-left-radius:4px}" +
    ".ebot-user{align-self:flex-end;background:var(--accent,#f0a860);color:#1b1408;border-bottom-right-radius:4px}" +
    ".ebot-links,.ebot-chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:100%}" +
    ".ebot-links a,.ebot-chips button{font:500 .82rem var(--font-body,system-ui,sans-serif);padding:6px 11px;border-radius:999px;border:1px solid var(--line,#2a2e3d);background:transparent;color:var(--accent,#f0a860);text-decoration:none;cursor:pointer}" +
    ".ebot-chips button{color:var(--fg,#e6e8ef)}" +
    ".ebot-links a:hover,.ebot-chips button:hover{border-color:var(--accent,#f0a860)}" +
    ".ebot-typing{align-self:flex-start;color:var(--muted,#9095a8);font-size:.85rem;font-family:var(--font-mono,monospace)}" +
    ".ebot-form{display:flex;gap:8px;padding:12px;border-top:1px solid var(--line,#2a2e3d)}" +
    ".ebot-form input{flex:1;min-width:0;padding:10px 12px;border-radius:8px;border:1px solid var(--line,#2a2e3d);background:var(--bg,#12141c);color:var(--fg,#e6e8ef);font:inherit;font-size:16px}" +
    ".ebot-form input:focus{outline:2px solid var(--accent,#f0a860);outline-offset:0;border-color:transparent}" +
    ".ebot-form button{padding:0 14px;border-radius:8px;border:0;background:var(--accent,#f0a860);color:#1b1408;font:600 .9rem var(--font-body,system-ui,sans-serif);cursor:pointer}" +
    ".ebot-launch:focus-visible,.ebot-x:focus-visible,.ebot-chips button:focus-visible,.ebot-links a:focus-visible,.ebot-form button:focus-visible{outline:2px solid var(--fg,#e6e8ef);outline-offset:2px}" +
    "@media (max-width:480px){.ebot-panel{right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(80px + env(safe-area-inset-bottom,0px))}.ebot-launch{right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px))}}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Build the widget ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var launch = el("button", "ebot-launch");
  launch.type = "button";
  launch.setAttribute("aria-expanded", "false");
  launch.setAttribute("aria-controls", "ebot-panel");
  launch.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Ask about me</span>';

  var panel = el("div", "ebot-panel");
  panel.id = "ebot-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", DATA.name);

  var head = el("div", "ebot-head");
  var titleBox = el("div");
  titleBox.appendChild(el("small", null, "Chatbot · answers about Eric only"));
  titleBox.appendChild(el("strong", null, DATA.name));
  var closeBtn = el("button", "ebot-x", "×");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close chat");
  head.appendChild(titleBox);
  head.appendChild(closeBtn);

  var log = el("div", "ebot-log");
  log.setAttribute("aria-live", "polite");

  var form = el("form", "ebot-form");
  var input = el("input");
  input.id = "ebot-input";
  input.type = "text";
  input.maxLength = 200;
  input.autocomplete = "off";
  input.placeholder = "Ask a question about Eric…";
  input.setAttribute("aria-label", "Your question");
  var send = el("button", null, "Send");
  send.type = "submit";
  form.appendChild(input);
  form.appendChild(send);

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(form);
  document.body.appendChild(panel);
  document.body.appendChild(launch);

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addMessage(text, who) {
    log.appendChild(el("div", "ebot-msg " + (who === "user" ? "ebot-user" : "ebot-bot"), text));
    scrollDown();
  }
  function addLinks(links) {
    if (!links || !links.length) return;
    var row = el("div", "ebot-links");
    links.forEach(function (l) {
      var a = el("a", null, l.label);
      a.href = l.href;
      if (l.href.charAt(0) !== "#") { a.target = "_blank"; a.rel = "noopener"; }
      else a.addEventListener("click", function () { if (window.innerWidth < 640) toggle(false); });
      row.appendChild(a);
    });
    log.appendChild(row);
    scrollDown();
  }
  function addSuggestions() {
    var old = log.querySelector(".ebot-chips");
    if (old) old.remove();
    var row = el("div", "ebot-chips");
    DATA.suggestions.forEach(function (s) {
      var b = el("button", null, s);
      b.type = "button";
      b.addEventListener("click", function () { ask(s); });
      row.appendChild(b);
    });
    log.appendChild(row);
    scrollDown();
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var busy = false;
  function ask(question) {
    question = question.trim();
    if (!question || busy) return;
    var chips = log.querySelector(".ebot-chips");
    if (chips) chips.remove();
    addMessage(question, "user");
    input.value = "";
    var reply = respond(question);
    busy = true;
    var typing = el("div", "ebot-typing", "typing…");
    log.appendChild(typing);
    scrollDown();
    setTimeout(function () {
      typing.remove();
      addMessage(reply.text, "bot");
      addLinks(reply.links);
      if (reply.suggest) addSuggestions();
      busy = false;
      input.focus();
    }, reduceMotion ? 0 : 450 + Math.min(reply.text.length * 3, 600));
  }

  var started = false;
  function toggle(open) {
    panel.hidden = !open;
    launch.setAttribute("aria-expanded", String(open));
    if (open) {
      if (!started) { started = true; addMessage(DATA.welcome, "bot"); addSuggestions(); }
      input.focus();
    } else {
      launch.focus();
    }
  }

  launch.addEventListener("click", function () { toggle(panel.hidden); });
  closeBtn.addEventListener("click", function () { toggle(false); });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) toggle(false); });
})();
