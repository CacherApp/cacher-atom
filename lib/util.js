'use babel';

import * as fs from 'fs';
import * as os from 'os';

const CACHER_DIR = `${os.homedir()}/.cacher`;
const CREDENTIALS_FILE = `${CACHER_DIR}/credentials.json`;

/**
 * Returns true if the Cacher credentials file exists.
 * @return {boolean} Whether credentials file exists.
 */
export function credentialsExist() {
  return fs.existsSync(CREDENTIALS_FILE);
}

/**
 * Returns the Cacher credentials as an object.
 * @return {object}
 */
export function getCredentials() {
    if (fs.existsSync(CREDENTIALS_FILE)) {
        const json = JSON.parse(fs.readFileSync(CREDENTIALS_FILE).toString());
        return {
            key: json.key,
            token: json.token
        };
    }

    return {
      key: '',
      token: ''
    };
}

/**
 * Saves the API key/token in credentials file.
 * @param {string} key The API key.
 * @param {string} token The API token.
 */
export function saveCredentials(key, token) {
    if (!fs.existsSync(CACHER_DIR)) {
        fs.mkdirSync(CACHER_DIR);
    }

    const json = {key, token};
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(json));
}
