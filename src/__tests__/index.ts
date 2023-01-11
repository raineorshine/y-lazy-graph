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
          links: {
            '': {
              [a.id]: { cycle: 'a' },
            },
          },
        },
      },
    },
  })
})

it('add grandchild', () => {
  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')
  a.add(b)
  b.add(c)

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
    links: {
      '': {
        [b.id]: {
          id: b.id,
          data: 'b',
          links: {
            '': {
              [a.id]: { cycle: 'a' },
              [c.id]: {
                id: c.id,
                data: 'c',
                links: {
                  '': {
                    [b.id]: { cycle: 'b' },
                  },
                },
              },
            },
          },
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
          links: {
            '': {
              [a.id]: { cycle: 'a' },
            },
          },
        },
        [c.id]: {
          id: c.id,
          data: 'c',
          links: {
            '': {
              [a.id]: { cycle: 'a' },
            },
          },
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
          links: {
            friend: {
              [a.id]: { cycle: 'a' },
            },
          },
        },
      },
    },
  })
})

it('delete child', () => {
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

it('delete grandchild', () => {
  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')
  a.add(b)
  b.add(c)

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

it.skip('delete deep', () => {
  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')
  const d = new Node('d')
  a.add(b)
  b.add(c)
  c.add(d)

  b.delete()

  expect(b.doc.toJSON()).toEqual({ '': {} })
  expect(c.doc.toJSON()).toEqual({ '': {} })
  expect(d.doc.toJSON()).toEqual({ '': {} })

  expect(a.toJSON()).toEqual({
    id: a.id,
    data: 'a',
  })
})

it('get untyped links and ignore typed links', () => {
  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')
  a.add(b)
  a.add(c, 'red')

  const linkedNodes = a.get()

  expect(linkedNodes.map(node => node.toJSON())).toEqual([
    {
      id: b.id,
      data: 'b',
      links: {
        '': {
          [a.id]: {
            id: a.id,
            data: 'a',
            links: {
              '': {
                [b.id]: { cycle: 'b' },
              },
              red: {
                [c.id]: {
                  id: c.id,
                  data: 'c',
                  links: {
                    red: {
                      [a.id]: { cycle: 'a' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ])
})

it('get typed links and ignore other types', () => {
  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')
  a.add(b, 'red')
  a.add(c, 'green')

  const linkedNodes = a.get('red')

  expect(linkedNodes.map(node => node.toJSON())).toEqual([
    {
      id: b.id,
      data: 'b',
      links: {
        red: {
          [a.id]: {
            id: a.id,
            data: 'a',
            links: {
              red: {
                [b.id]: { cycle: 'b' },
              },
              green: {
                [c.id]: {
                  id: c.id,
                  data: 'c',
                  links: {
                    green: {
                      [a.id]: { cycle: 'a' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ])
})

it('get typed links and ignore untyped nodes', () => {
  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')
  a.add(b, 'red')
  a.add(c)

  const linkedNodes = a.get('red')

  expect(linkedNodes.map(node => node.toJSON())).toEqual([
    {
      id: b.id,
      data: 'b',
      links: {
        red: {
          [a.id]: {
            id: a.id,
            data: 'a',
            links: {
              '': {
                [c.id]: {
                  id: c.id,
                  data: 'c',
                  links: {
                    '': {
                      [a.id]: { cycle: 'a' },
                    },
                  },
                },
              },
              red: {
                [b.id]: { cycle: 'b' },
              },
            },
          },
        },
      },
    },
  ])
})

it('get all links', () => {
  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')
  a.add(b)
  a.add(c, 'red')

  const linkedNodes = a.get(null)

  expect(linkedNodes.map(node => node.toJSON())).toEqual([
    {
      id: b.id,
      data: 'b',
      links: {
        '': {
          [a.id]: {
            id: a.id,
            data: 'a',
            links: {
              '': {
                [b.id]: { cycle: 'b' },
              },
              red: {
                [c.id]: {
                  id: c.id,
                  data: 'c',
                  links: {
                    red: {
                      [a.id]: { cycle: 'a' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: c.id,
      data: 'c',
      links: {
        red: {
          [a.id]: {
            id: a.id,
            data: 'a',
            links: {
              '': {
                [b.id]: {
                  id: b.id,
                  data: 'b',
                  links: {
                    '': {
                      [a.id]: { cycle: 'a' },
                    },
                  },
                },
              },
              red: {
                [c.id]: { cycle: 'c' },
              },
            },
          },
        },
      },
    },
  ])
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
            links: {
              '': {
                [a.id]: { cycle: 'a' },
              },
            },
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
            links: {
              friend: {
                [a.id]: { cycle: 'a' },
              },
            },
          },
        },
      },
    })
  })
})
