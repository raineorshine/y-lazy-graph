import { nanoid } from 'nanoid'
import keyValueBy from './lib/keyValueBy'

type Doc = any
type T = string
type YJS = any

const lazyGraph = ({ Y }: { Y: YJS }) => {
  class Node {
    doc: Doc
    static add: Doc

    constructor(data: T, { id }: { id?: string } = {}) {
      const doc = new Y.Doc()
      const thought = doc.getMap()
      const idNew = id || nanoid()
      thought.set('id', idNew)
      thought.set('data', data)
      thought.set('links', new Y.Map())
      this.doc = doc
    }

    /** Gets the id from the Node Doc. */
    public get id() {
      return this.doc.getMap().get('id')
    }

    /** Gets the data from the Node Doc. */
    public get data() {
      return this.doc.getMap().get('data')
    }

    /** Link two nodes together. Specify an optional type that can be used to filter links. */
    public add(node: Node, type?: string) {
      type = type || ''
      const id = node.doc.getMap().get('id')
      const linksMap = this.doc.getMap().get('links')
      if (!linksMap.has(type)) {
        linksMap.set(type, new Y.Map())
      }

      linksMap.get(type).set(id, node.doc)
    }

    /** Converts the Node to JSON. */
    public toJSON(doc?: Doc): any {
      doc = doc || this.doc
      const linksMap = doc.getMap().get('links')
      const linkDocs = linksMap.toJSON() as { [key: string]: { [key: string]: Doc } }
      const linkJSON = keyValueBy(linkDocs, (type, linkTypeMap) => ({
        [type]: keyValueBy(linkTypeMap, (id, childDoc) => {
          const child = childDoc.getMap()
          return {
            [id]: this.toJSON(childDoc),
          }
        }),
      }))

      return {
        id: doc.getMap().get('id'),
        data: doc.getMap().get('data'),
        ...(Object.keys(linkJSON).length > 0 ? { links: linkJSON } : null),
      }
    }
  }

  // add static methods
  Node.add = (a: Node, b: Node, type?: string) => a.add(b, type)

  return Node
}

export default lazyGraph
