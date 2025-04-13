import {Observable} from 'rxjs';
import {DocumentCollection} from './document-collection';
import {toPromise} from "../../helper/resolvable";

export interface Relationships {
  [key: string]: Observable<DocumentCollection<AbstractEntity> | AbstractEntity | null>;
}

interface DataObject {
  id: string | null;
  type: string;
  attributes: object;
  relationships: Relationships;
}

interface SerializedObject {
  data: DataObject;
}

export abstract class AbstractEntity {
  public id: string | null = null;
  public abstract type: string;

  public attributes: object = {};
  public relationships: Relationships = {};

  constructor(public initialized = true) {}

  public async serialize(wholeTree: boolean = true, primary: boolean = true): Promise<SerializedObject> {
    const object = {
      data: {
        id: this.id,
        type: this.type,
        attributes: {},
        relationships: {},
      },
    };

    if (!wholeTree && !primary && this.id) {
      return object;
    }

    for (const attributeName in this.attributes) {
      if (Object.prototype.hasOwnProperty.call(this.attributes, attributeName)) {
        (object.data.attributes as Record<string, unknown>)[attributeName] = (this.attributes as Record<string, unknown>)[attributeName];
      }
    }

    for (const relationshipName in this.relationships) {
      if (Object.prototype.hasOwnProperty.call(this.relationships, relationshipName)) {
        const relationshipValue = this.relationships[relationshipName];

        const resolved = await toPromise(relationshipValue);
        if (resolved !== null && !resolved.initialized) {
          continue;
        }
        let result: DataObject | DataObject[] | null;
        if (resolved instanceof DocumentCollection) {
          result = [];
          for (const item of resolved) {
            if (item !== null) {
              result.push((await item.serialize(wholeTree, false)).data);
            }
          }
        } else if (resolved === null) {
          result = null;
        } else {
          result = (await resolved.serialize(wholeTree, false)).data;
        }

        (object.data.relationships as Record<string, unknown>)[relationshipName] = {
          data: result,
        };
      }
    }

    return object;
  }
}
