# Cacher

[Cacher](https://www.cacher.io/) is the code snippet organizer for pro developers. It is a cross-platform, cloud-based app used to curate a snippet library for you and your team.

Features:
- Support for editing and viewing 100+ programming languages.
- Flexible, nest-able, color-coded labels to categorize snippets.
- Shareable snippet pages via Cacher's code-sharing community: [snippets.cacher.io](https://snippets.cacher.io/)
- Team and organization features like shared libraries, notifications, role management and code reviews.
- Desktop clients for Windows, macOS and Linux.
- Full-featured web app: [app.cacher.io](https://app.cacher.io/)

## Cacher for Atom

This package offers Cacher users the ability to perform popular actions on their personal and team snippet libraries from within the editor.

Demo of finding and inserting a Cacher snippet:

![Cacher Demo](https://cdn.cacher.io/atom/atom-demo.gif "Cacher Demo")

## Getting Started

1. Install the Cacher for Atom package using [apm](https://flight-manual.atom.io/using-atom/sections/atom-packages/#command-line):

  ```bash
  apm install cacher
  ```

2. Once Atom has loaded, you will be prompted to setup Cacher. Click the **Setup Cacher** button. (You can also start the setup wizard by using the **Cacher: Setup** command.)

  ![Setup Cacher](https://cdn.cacher.io/atom/atom-setup.png "Setup Cacher")

3. In the prompt to "Enter Cacher Credentials", click the **Open Cacher** link to view your API credentials. You can also navigate to the page via: [app.cacher.io/enter?action=view_api_creds](https://app.cacher.io/enter?action=view_api_creds)

  ![Cacher Credentials](https://cdn.cacher.io/atom/atom-credentials.png "Cacher Credentials")

4. From the popped up webpage, sign up or sign in as a Cacher user.
5. Once you are signed in, you should see a dialog open with your **API KEY** and **API TOKEN**.

  ![API Credentials](https://cdn.cacher.io/atom/atom-api-creds.png "API Credentials")

6. Back in Atom, enter your API key and token from step 5 into the prompt.

7. You're all set! Open the Command Palette and type in **Cacher: Find Snippet** to search for a snippet from your Cacher libraries.

## Commands

### Find Snippet

> Shortcut: Alt+Shift+I

Find a snippet from your personal and team Cacher libraries. Searches across snippets' title, description and file content.

Once you've found what you're looking for, you'll see buttons in the footer to:

- Insert the file's content, replacing your selection in the active editor.
- Copy the file's content to the clipboard.
- Open the snippet in the Cacher web app.
- Open the snippet's page.

### Create snippet

> Shortcut: Alt+Shift+C

Create a snippet from either the text selection or the entire file (no selection). The command opens up a prompt for you to choose:

 - Personal or team library (if using teams)
 - Title
 - Description - *Optional*
 - Filename
 - Public/private permission
 - Label - *Optional*

### Refresh

> Shortcut: Alt+Shift+R

Reload your Cacher snippets. Do this once you've made a change to your snippets outside of Atom.

*The package auto-refreshes once every hour.*

### Setup

Kick off the setup wizard to authenticate your Cacher account. Run this command if you need to switch users.

## Context Menu

Right-click on an active editor to bring up Cacher context menu actions:

- **Create Snippet** - Create a new snippet using the selected text or the entire file if there is no text selected.
- **Insert Snippet** - Search for a snippet and insert the content in-place.

![Context Menu](https://cdn.cacher.io/atom/atom-context-menu.png "Context Menu")

## Requirements

The Cacher for Atom package is available for registered users on a Pro/Team plan. For a 14-day free Team trial, sign up at [app.cacher.io](https://app.cacher.io).

## Getting Help

Find help articles and file support tickets: [support.cacher.io](https://support.cacher.io)

## Contributing

Thanks for deciding to help!

Cacher for Atom is written in ES7 and transpiled with [Babel](https://babeljs.io/). The [Atom Flight Manual](https://flight-manual.atom.io/hacking-atom/) has an excellent guide on writing plugins.

Before submitting a pull request, be sure to check for errors with ESLint:

```bash
npx eslint .
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
