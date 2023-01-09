import * as Y from 'yjs'
import lazyGraph from '../index'

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

it('add', () => {
  const Node = lazyGraph({ Y })
  const a = new Node('a')
  const b = new Node('b')
  a.add(b)

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
    links: {
      '': {
        [b.id]: {
          id: b.id,
          data: 'b',
        },
      },
    },
  })
})

it('add typed link', () => {
  const Node = lazyGraph({ Y })
  const a = new Node('a')
  const b = new Node('b')
  a.add(b, 'friend')

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
    links: {
      friend: {
        [b.id]: {
          id: b.id,
          data: 'b',
        },
      },
    },
  })
})

describe('static methods', () => {
  it('add', () => {
    const Node = lazyGraph({ Y })
    const a = new Node('a')
    const b = new Node('b')
    Node.add(a, b)

    expect(a.toJSON()).toEqual({
      id: a.id,
      data: 'a',
      links: {
        '': {
          [b.id]: {
            id: b.id,
            data: 'b',
          },
        },
      },
    })
  })
  it('add typed link', () => {
    const Node = lazyGraph({ Y })
    const a = new Node('a')
    const b = new Node('b')
    Node.add(a, b, 'friend')

    expect(a.toJSON()).toEqual({
      id: a.id,
      data: 'a',
      links: {
        friend: {
          [b.id]: {
            id: b.id,
            data: 'b',
          },
        },
      },
    })
  })
})
