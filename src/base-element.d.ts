export type Constructor = new (...args: any[]) => {};
export type TypedConstructor<T> = new (...args: any[]) => T;

export function toAnonymousClass<T extends Constructor> (klass: T): T;
