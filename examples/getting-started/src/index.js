import * as Y from 'yjs'
import lazyTree from '../../../build/index.js'
import { WebsocketProvider } from 'y-websocket'

const websocketUrl = 'ws://localhost:1234'
const tree = lazyTree({ Y })

const rootDoc = tree.create({ id: 'root', value: 'root' })
const rootWebsocketProvider = new WebsocketProvider(websocketUrl, 'root', rootDoc)

rootWebsocketProvider.on('status', event => {
  console.log(event.status)
})

const syncSubdocs = ({ loaded }) => {
  console.log('subdocs event', { loaded: loaded.size })
  loaded.forEach(subdoc => {
    console.log('loaded', subdoc.getMap().get('value'), subdoc.guid)
    new WebsocketProvider(websocketUrl, subdoc.guid, subdoc)
  })
}

// sync all subdocs through the WebsocketProvider
rootDoc.on('subdocs', syncSubdocs)

/** Creates children as a subdoc of the root doc. */
window.init = () => {
  const a = tree.add(rootDoc, { value: 'a' })
  a.on('subdocs', syncSubdocs)
  const b = tree.add(a, { value: 'b' })
  b.on('subdocs', syncSubdocs)
}

/** Loads and observes the children subdocument. */
window.load = (doc = rootDoc) => {
  const children = doc.getMap().get('children')
  if (!children) {
    console.error('children do not yet exist. Run init() to create.')
    return
  }

  children.forEach(child => {
    child.load()
    child.on('subdocs', ({ loaded }) => {
      console.log('child subdocs event', { loaded: loaded.size })
      loaded.forEach(subdoc => {
        new WebsocketProvider(websocketUrl, subdoc.guid, subdoc)
      })
    })
    child.on('update', () => {
      console.log('loaded child subdoc', child.getMap().get('value'))
      window.load(child)
    })
  })
}

console.warn(`INSTRUCTIONS

  Run init() from the console to insert a subdoc into the root doc.
  After refreshing the page, run load() to load the subdoc.

`)
