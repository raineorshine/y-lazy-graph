import lazyGraph from '../index'
import * as Y from 'yjs'

it('constructor', () => {
  const Node = lazyGraph({ Y })
  const a = new Node('a')
})

it('toJSON', () => {
  const Node = lazyGraph({ Y })
  const a = new Node('a')

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
  })
})

it('link two nodes', () => {
  const Node = lazyGraph({ Y })
  const a = new Node('a')
  const b = new Node('b')
  a.add(b)

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
    links: {
      [b.id]: {
        id: b.id,
        data: 'b',
      },
    },
  })
})
