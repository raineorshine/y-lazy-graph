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

    public get id() {
      return this.doc.getMap().get('id')
    }

    public get data() {
      return this.doc.getMap().get('data')
    }

    /** Link two nodes together. Specify an optional type that can be used to filter links. */
    public add(node: Node, type?: string) {
      const id = node.doc.getMap().get('id')
      this.doc.getMap().get('links').set(id, node.doc)
    }

    // static add(a: Node, b: Node, type?: string) {
    //   return a.add(b, type)
    // }

    /** Converts the Node to JSON. */
    public toJSON(doc?: Doc): any {
      doc = doc || this.doc
      const links = doc.getMap().get('links')
      const linkDocs = links.toJSON() as { [key: string]: Doc }
      const linkJSON = keyValueBy(linkDocs, (id, childDoc) => {
        const child = childDoc.getMap()
        return {
          [id]: this.toJSON(childDoc),
        }
      })

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
