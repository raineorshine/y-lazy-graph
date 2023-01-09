# y-lazy-graph

An offline-first, lazy-loaded, reactive graph type using yjs subdocuments.

## Install

```
npm install y-lazy-graph
```

## Usage

```js
import lazyGraph from 'y-lazy-graph'
import * as Y from 'yjs'

const Node = lazyGraph({ Y })

const a = new Node({ data: 'a' })

console.log(a.toJSON())
/*
{
  id: A_ID,
  data: 'a',
}
*/

// create a chain of nodes: a -> b -> c
const b = new Node({ data: 'b' })
const c = new Node({ data: 'c' })

console.log(a.toJSON())
/*
{
  id: A_ID,
  data: 'a',
  links: {
    '': {
      [B_ID]: {
        id: B_ID,
        data: 'b',
        links: {
          '': {
            [C_ID]: {
              id: C_ID,
              data: 'c',
            }
          }
        }
      }
    }
  }
}
*/
```

## API

### default export

The default export is a function that returns the Node constructor. Pass your instance of Y.

If someone knows how to import Y without getting the "Yjs was already imported" error, then I can get rid of this wrapper.

See: https://github.com/yjs/yjs/issues/438

```js
import lazyGraph from 'y-lazy-graph'
import * as Y from 'yjs'

const Node = lazyGraph({ Y })
```

### constructor

A nestable graph node that contains a Y.Doc for syncing across clients.

```ts
constructor(data: T, options: { id?: string })
```

- `data: T` - Your custom data that is attached to the node.
- `options.id: string` - Set the id. Defaults to a nanoid.

Example:

```js
const a = new Node('a')
```

### add

Links two nodes together with an edge.

```ts
public add(node: Node, type?: string): void
static add(a: Node, b: Node, type?: string): void
```

- `node: Node` - The node to link with the instance.
- `type?: string` - A custom type that can be assigned to a link. Allows symmetric, asymmetric, and invertible relations.

Example:

```js
const a = new Node('a')
const b = new Node('b')
a.add(b)
```
