const fs = require('fs');
const path = require('path');

const TOKEN_FILE = path.join(__dirname, 'tokens.json');

function readTokens() {
  try {
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  } catch (err) {
    return {};
  }
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

function getToken(discordId) {
  const tokens = readTokens();
  return tokens[discordId];
}

function setToken(discordId, token) {
  const tokens = readTokens();
  tokens[discordId] = token;
  saveTokens(tokens);
}

function deleteToken(discordId) {
  const tokens = readTokens();
  delete tokens[discordId];
  saveTokens(tokens);
}

module.exports = { getToken, setToken, deleteToken };
