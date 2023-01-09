import { nanoid } from 'nanoid'

type T = string
type Doc = any

const lazyTree = ({ Y }: { Y: any }) => {
  const create = ({ doc, id, value }: { doc?: Doc; id?: string; value: T }) => {
    const thoughtDoc = new Y.Doc()
    const thought = thoughtDoc.getMap()
    const idNew = id || nanoid()
    thought.set('id', idNew)
    thought.set('value', value)
    thought.set('children', new Y.Map())
    return thoughtDoc
  }

  const add = (parentDoc: Doc, { value }: { value: string }) => {
    const thoughtDoc = create({ value })
    const id = thoughtDoc.getMap().get('id')
    parentDoc.getMap().get('children').set(id, thoughtDoc)
    return thoughtDoc
  }

  const render = (doc: Doc, { indent }: { indent?: number } = {}) => {
    let output = ''
    indent = indent || 0
    const children = doc.getMap().get('children')
    if (!children) return `${'  '.repeat(indent)}(pending)`

    children.forEach((childDoc: Doc) => {
      const child = childDoc.getMap()
      output += `${'  '.repeat(indent!)}- ${child.get('value')}\n`
      output += render(childDoc, { indent: indent! + 1 })
    })

    return output
  }

  return { create, add, render }
}

export default lazyTree
