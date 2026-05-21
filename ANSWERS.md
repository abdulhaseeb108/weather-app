# ANSWERS.md

## 1. How to run

Clone repository:

```bash
git clone YOUR_REPO_LINK
```

Open `index.html` in browser or use Live Server.

Replace API key in `script.js` with your own OpenWeather API key.


## 2. Stack choice

I used HTML, CSS, and JavaScript because this is a frontend project that only requires API calls and UI updates. JavaScript is ideal because it supports fetch API and runs directly in the browser.

A worse choice would be using backend frameworks like Django or Spring Boot because they are unnecessary for this lightweight frontend application.

## 3. Edge case handled

Invalid city names entered by the user.

File: `script.js`

```js
if (!res.ok) throw new Error("City not found");
```

Without this, the app would crash or show incorrect data.

## 4. AI usage

I used AI to:

* structure README
* structure ANSWERS




## 5. Honest gap

The forecast display logic is not fully optimized and sometimes does not show consistent daily grouping.

Given more time, I would improve forecast grouping and add hourly charts.
