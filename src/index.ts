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
    public add(node: Node, type?: string): void {
      type = type || ''
      const id = node.doc.getMap().get('id')
      const linksMapA = this.doc.getMap().get('links')
      const linksMapB = node.doc.getMap().get('links')
      if (!linksMapA.has(type)) {
        linksMapA.set(type, new Y.Map())
      }
      if (!linksMapB.has(type)) {
        linksMapB.set(type, new Y.Map())
      }

      linksMapA.get(type).set(id, node.doc)
      linksMapB.get(type).set(this.id, this.doc)
    }

    /** Deletes the node and all incoming links. */
    public delete(): void {
      // get all Docs that are linked from this node
      const linkedDocs = Array.from(this.doc.getMap().get('links').entries()).flatMap(([type, map]: any) =>
        Array.from(map.values()),
      )

      // delete this node from all Docs' links
      linkedDocs.forEach((doc: Doc) => {
        const reverseLinkTypeMap = doc.getMap().get('links')
        reverseLinkTypeMap.forEach((linksMap: any, type: string) => {
          linksMap.delete(this.id)
        })
      })

      this.doc.getMap().clear()
      this.doc.destroy()
    }

    /** Converts the Node to JSON. */
    public toJSON({
      doc,
      traversed,
    }: {
      // child doc used in recursive call
      doc?: Doc
      // a set of traversed nodes to avoid cycles
      traversed?: Set<string>
    } = {}): any {
      doc = doc || this.doc
      const id = doc.getMap().get('id')
      traversed = traversed || new Set()
      traversed.add(id)

      const linksMap = doc.getMap().get('links')
      const linkDocs = linksMap.toJSON() as { [key: string]: { [key: string]: Doc } }
      const linkJSON = keyValueBy(linkDocs, (type, linkTypeMap) => {
        const linkTypeMaps = keyValueBy(linkTypeMap, (childId, childDoc) => {
          const child = childDoc.getMap()
          // do not recur if node has already been traversed
          if (traversed?.has(childId)) return null

          return {
            [childId]: this.toJSON({ doc: childDoc, traversed }),
          }
        })
        return Object.keys(linkTypeMaps).length > 0
          ? {
              [type]: linkTypeMaps,
            }
          : null
      })

      return {
        id,
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
