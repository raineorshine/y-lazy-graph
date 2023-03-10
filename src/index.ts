import { nanoid } from 'nanoid'
import keyValueBy from './lib/keyValueBy'

type Doc = any
type T = string
type YJS = any

const lazyGraph = ({ Y }: { Y: YJS }) => {
  class Node {
    doc: Doc
    static add: Doc

    constructor(data: T | Doc, { id }: { id?: string } = {}) {
      const clone = data instanceof Y.Doc
      const doc = clone ? data : new Y.Doc()

      if (!clone) {
        const thought = doc.getMap()
        const idNew = id || nanoid()
        thought.set('id', idNew)
        thought.set('data', data)
        thought.set('links', new Y.Map())
      }

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
      const linksMapA = this.doc.getMap().get('links')
      const linksMapB = node.doc.getMap().get('links')
      if (!linksMapA.has(type)) {
        linksMapA.set(type, new Y.Map())
      }
      if (!linksMapB.has(type)) {
        linksMapB.set(type, new Y.Map())
      }

      linksMapA.get(type).set(node.id, node.doc)

      // The reverse link will produce an error when adding a sibling:
      // "This document was already integrated as a sub-document."
      // https://github.com/yjs/yjs/blob/9a7250f1927a42d430b3b275c62a1fdd8fabbc11/src/structs/ContentDoc.js#L23
      // It does not seem to affect functionality. Temporary fix in /patches.
      // See: https://github.com/yjs/yjs/issues/480
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
        reverseLinkTypeMap.forEach((reverseLinksMap: any, type: string) => {
          // Normally causes an infinite loop due to the invalid circular JSON structure of subdocument cycles.
          // Temporary fix in /patches.
          reverseLinksMap.delete(this.id)
        })
      })

      this.doc.getMap().clear()
      this.doc.destroy()
    }

    /** Gets all linked Nodes with the specified type. */
    public get(type?: string | null): Node[] {
      if (type === undefined) {
        type = ''
      }
      const linksTypeMap = this.doc.getMap().get('links') as { [key: string]: Doc }
      const docs =
        type === null
          ? Array.from(linksTypeMap.values()).flatMap((linksMap: any) => Array.from(linksMap.values()))
          : Array.from(linksTypeMap.get(type).values())
      return docs.map(doc => new Node(doc))
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
          if (traversed?.has(childId))
            return {
              [childId]: { cycle: child.get('data') },
            }

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
