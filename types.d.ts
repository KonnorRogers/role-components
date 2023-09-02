export type Constructor = new (...args: any[]) => {};
export type TypedConstructor<T = {}> = new (...args: any[]) => T;

export function toAnonymousClass<T extends Constructor> (superclass: T): T

// function toAnonymousClass<T extends Constructor> (superclass: T): T {
//   return class extends superclass {}
// }
