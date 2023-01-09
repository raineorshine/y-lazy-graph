import lazyGraph from '../index'
import * as Y from 'yjs'

it('constructor', () => {
  const Node = lazyGraph({ Y })
  const node = new Node('a')
})

it('toJSON', () => {
  const Node = lazyGraph({ Y })
  const node = new Node('a')
  expect(node.toJSON()).toMatchObject({
    data: 'a',
  })
})
