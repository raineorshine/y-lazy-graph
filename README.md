y-lazy-tree

## Install

```
npm install y-lazy-tree
```

## Demo

See: `/examples/getting-started`

## Usage

```js
import * as Y from 'yjs'
import LazyTree from 'y-lazy-tree'

const ydoc = new Y.Doc()
const tree = new LazyTree(ydoc)

const node1 = tree.add({ value: 'a' })
const node2 = tree.add({ value: 'b' })
const node3 = tree.add({ value: 'c' })
```
