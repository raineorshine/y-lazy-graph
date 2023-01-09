import { nanoid } from 'nanoid'

type Doc = any
type T = string
type YJS = any

const lazyGraph = ({ Y }: { Y: YJS }) => {
  class Node {
    doc: Doc

    constructor(data: T, { id }: { id?: string } = {}) {
      const doc = new Y.Doc()
      const thought = doc.getMap()
      const idNew = id || nanoid()
      thought.set('id', idNew)
      thought.set('data', data)
      thought.set('links', new Y.Map())
      this.doc = doc
    }

    /** Link two nodes together. Specify an optional type that can be used to filter links. */
    public add(node: Node, type?: string) {
      const id = node.doc.getMap().get('id')
      this.doc.getMap().get('links').set(id, node.doc)
    }

    /** Converts the Node to JSON. */
    public toJSON(doc?: Doc): any {
      doc = doc || this.doc
      const links = doc.getMap().get('links')
      if (!links) return '(buffered)'

      const entries = Array.from(links.entries()) as [string, Doc][]
      const linkJSON = entries.map(([id, childDoc]) => {
        const child = childDoc.getMap()
        return {
          id,
          data: child.get('data'),
          links: this.toJSON(childDoc),
        }
      })

      return {
        id: this.doc.getMap().get('id'),
        data: this.doc.getMap().get('data'),
        ...(linkJSON.length > 0 ? { links: linkJSON } : null),
      }
    }
  }

  return Node
}

export default lazyGraph
