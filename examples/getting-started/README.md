websocket-lazy-tree

## Install

Clone this repo and cd into this directory.

```
npm install
```

## Usage

Start the dev server:

```
npm start
```

In a separate shell, start the websocket server:

```
npm run websocket-server
```

Navigate to http://localhost:8080/

Run `init()` from the console to insert a subdoc into the root doc.

After refreshing the page, run `load()` to load the subdoc.
