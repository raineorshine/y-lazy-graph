import { nanoid } from 'nanoid'

const LazyTree = ({ Y } = {}) => {
  const create = ({ doc, id, value }) => {
    const thoughtDoc = new Y.Doc()
    const thought = thoughtDoc.getMap()
    const idNew = id || nanoid()
    thought.set('id', idNew)
    thought.set('value', value)
    thought.set('children', new Y.Map())
    return thoughtDoc
  }

  const add = (parentDoc, { value }) => {
    const thoughtDoc = create({ value })
    const id = thoughtDoc.getMap().get('id')
    parentDoc.getMap().get('children').set(id, thoughtDoc)
    return thoughtDoc
  }

  const render = (doc, { indent } = {}) => {
    let output = ''
    indent = indent || 0
    const children = doc.getMap().get('children')
    if (!children) return `${'  '.repeat(indent)}(pending)`

    children.forEach(childDoc => {
      const child = childDoc.getMap()
      output += `${'  '.repeat(indent)}- ${child.get('value')}\n`
      output += render(childDoc, { indent: indent + 1 })
    })

    return output
  }

  return { create, add, render }
}

export default LazyTree
