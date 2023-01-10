import * as Y from 'yjs'
import lazyGraph from '../index'

const Node = lazyGraph({ Y })

it('constructor', () => {
  const a = new Node('a')
})

it('toJSON', () => {
  const a = new Node('a')

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
  })
})

it('add child', () => {
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

it('add siblings', () => {
  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')
  a.add(b)
  a.add(c)

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
    links: {
      '': {
        [b.id]: {
          id: b.id,
          data: 'b',
        },
        [c.id]: {
          id: c.id,
          data: 'c',
        },
      },
    },
  })
})

it('add typed link', () => {
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

it('delete', () => {
  const a = new Node('a')
  const b = new Node('b')
  a.add(b)
  b.delete()

  expect(b.doc.toJSON()).toEqual({ '': {} })

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
  })
})

it('delete typed link', () => {
  const a = new Node('a')
  const b = new Node('b')
  a.add(b, 'friend')
  b.delete()

  expect(b.doc.toJSON()).toEqual({ '': {} })

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
  })
})

describe('static aliases', () => {
  it('add child', () => {
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
