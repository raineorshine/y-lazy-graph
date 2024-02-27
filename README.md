# DEPRECATED: The basic graph structure is set up with tests. Feel free to use. Cycles likely don't work, but it may be possible with a custom subdocument implementation. I decided to take a different approach in my own project.

# y-lazy-graph

An offline-first, lazy-loaded, reactive graph type using yjs subdocuments.

- [x] Two-way edges
- [ ] Cycles
- [ ] Provider support

## Install

```
npm install y-lazy-graph
```

## Usage

```js
import lazyGraph from 'y-lazy-graph'
import * as Y from 'yjs'

const Node = lazyGraph({ Y })

// create a doubly linked list
const a = new Node({ data: 'a' })
const b = new Node({ data: 'b' })
const c = new Node({ data: 'c' })
a.add(b)
b.add(c)

// Outputs a JSON representation of a ⟷ b ⟷ c
console.log(a.toJSON())
```

Use `.get()` to get an array of all linked nodes.

Because links are **2-way** and **symmetric** by default, `b.get()` returns both a and c:

```js
// returns all linked nodes
const linkedNodes = b.get()

// Outputs [{ data: 'a' }, { data: 'c' }]
console.log(linkedNodes.map(node => node.toJSON()))
```

### NOT IMPLEMENTED

Use `.add$()` to add an **assymetric** link.

```js
import lazyGraph from 'y-lazy-graph'
import * as Y from 'yjs'

// tell lazyGraph that child nodes are inverse of parent nodes
const Node = lazyGraph({ Y, inversePairs: [['child', 'parent']] })

const a = new Node({ data: 'a' })
const b = new Node({ data: 'b' })
const c = new Node({ data: 'c' })

// add b as a child of a
a.add$(b, 'child')

// add c as a child of b
b.add$(c, 'child')

const children = b.get('child')
const parents = b.get('parent') // thank you inversePairs ♡

console.log(
  'children',
  children.map(node => node.toJSON()),
)

console.log(
  'parents',
  parents.map(node => node.toJSON()),
)
/* 
  children
  [
    { data: 'c' },
  ]

  parents
  [
    { data: 'a' },
  ]

*/
```

## API

- [default export](https://github.com/raineorshine/y-lazy-graph#default-export)
- [constructor](https://github.com/raineorshine/y-lazy-graph#constructor)
- [add](https://github.com/raineorshine/y-lazy-graph#add)
- [delete](https://github.com/raineorshine/y-lazy-graph#delete)
- [get](https://github.com/raineorshine/y-lazy-graph#get)

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
constructor(data: T | Y.Doc, options: { id?: string })
```

- `data: T | Doc` - Your custom data that is attached to the node. You can also pass the Y.Doc of another Node to clone it, i.e. create a new Node instance that wraps the Doc without creating any additional data.
- `options.id: string` - Set the id. Defaults to a new, globally unique identifier (nanoid).

Example:

```js
const a = new Node('a')
```

### add

Links two nodes together with an edge.

```ts
add(node: Node, type?: string): void
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

### delete

**NOT IMPLEMENTED: deep**

Deletes a node.

```ts
delete({ deep?: boolean }): void
```

### get

Gets all linked Nodes.

```ts
get(type?: string): void
```

- `type?: string | null` - Gets linked nodes (O(1)).
  - If no type is given, returns untyped nodes (default).
  - If a type is given, returns only linked nodes of the given type (still O(1)).
  - If null is given, returns all nodes regardless of type. It is recommended to only pass null if you have mixed node types.

Example:

```js
const a = new Node('a')
const b = new Node('b')
const c = new Node('c')
a.add(b)
a.add(c)
const linkedNodes = a.get()
/*
[
  { id: B_ID, data: 'b' },
  { id: C_ID, data: 'c' },
]
*/
```
