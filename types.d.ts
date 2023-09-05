export type Constructor = new (...args: any[]) => {};
export type TypedConstructor<T = {}> = new (...args: any[]) => T;

export function toAnonymousClass<T extends Constructor> (superclass: T): T

export interface StaticBaseElement {
  new (...args: any[]): any
  baseName: string
}

export type LooseString<T extends string> = string & Omit<string, T> | T

// function toAnonymousClass<T extends Constructor> (superclass: T): T {
//   return class extends superclass {}
// }
