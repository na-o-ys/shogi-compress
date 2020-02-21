declare type Version = "v1" | "v2";
export declare function encode(sfenPosition: string, version: Version): string;
export declare function decode(encoded: string): string;
export {};
