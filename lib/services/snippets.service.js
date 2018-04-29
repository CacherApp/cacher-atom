'use babel';

import config from '../config';
import store from '../store';
import * as util from '../util';

const _ = require('lodash');
const request = require('request');

// 1 hour
const REFRESH_INTERVAL_TIME = 1000 * 60 * 60;

export class SnippetsService {
  refreshInterval: null;
  initialized: false;
  notification: null;

  constructor() {
    this.initialized = false;
  }

  initialize() {
    this.fetchSnippets();

    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(
      () => this.fetchSnippets(),
      REFRESH_INTERVAL_TIME
    );
  }

  fetchSnippets() {
    if (!util.credentialsExist()) {
      return;
    }

    request({
      method: 'GET',
      url: `${config.apiHost}/atom/snippets`,
      headers: this.requestHeaders(),
      strictSSL: config.env === 'production'
    }, (error: any, response: any, body: any) => {
      if (error) {
        return;
      }

      let json = JSON.parse(body);
      store.personalLibrary = json.personalLibrary;

      this.setSnippets(json);
      this.setTeams(json);

      this.initialized = true;

      this.notification =
        atom.notifications.addSuccess(
          'Cacher snippets loaded.'
        );
    });
  }

  setSnippets(response: any) {
    let labels = response.personalLibrary.labels;

    let personalSnippets = _.map(
      response.personalLibrary.snippets,
      (snippet) => {
        // Personal snippet
        let newSnippet = _.clone(snippet);
        newSnippet.team = null;

        // Find labels
        newSnippet.labels = this.snippetLabels(labels, snippet);
        return newSnippet;
      }
    );

    let teamSnippets = [];

    _.each(response.teams, (team) => {
      let labels = team.library.labels;

      _.each(team.library.snippets, (snippet) => {
        let newSnippet = _.clone(snippet);
        newSnippet.team = team;

        newSnippet.labels = this.snippetLabels(labels, snippet);
        teamSnippets.push(newSnippet);
      });
    });

    store.snippets = personalSnippets.concat(teamSnippets);
  }

  snippetLabels(labels, snippet) {
    return _.map(
      _.filter(labels, (label) => {
        return _.find(label.snippets, {
          guid: snippet.guid
        });
      }),
      (label) => label.title
    );
  }

  setTeams(response) {
    store.teams = response.teams;
  }

  requestHeaders() {
    let credentials = util.getCredentials();

    return {
      'X-Api-Key': credentials.key,
      'X-Api-Token': credentials.token
    };
  }

  dispose() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    if (this.notification) {
      this.notification.dismiss();
    }
  }
}
