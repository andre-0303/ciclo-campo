declare module "idb" {
  export interface ObjectStoreNames {
    contains(name: string): boolean;
  }

  export interface ObjectStoreOptions {
    keyPath: string;
  }

  export interface DatabaseHandle<Value = unknown> {
    objectStoreNames: ObjectStoreNames;
    createObjectStore(name: string, options: ObjectStoreOptions): void;
    put(storeName: string, value: Value): Promise<void>;
    getAll(storeName: string): Promise<Value[]>;
    delete(storeName: string, key: string): Promise<void>;
  }

  export interface OpenDBOptions<Value = unknown> {
    upgrade(database: DatabaseHandle<Value>): void;
  }

  export function openDB<Value = unknown>(
    name: string,
    version: number,
    options: OpenDBOptions<Value>,
  ): Promise<DatabaseHandle<Value>>;
}

declare module "qrcode.react" {
  import type { FC } from "react";

  export interface QRCodeCanvasProps {
    value: string;
    size?: number;
    level?: "L" | "M" | "Q" | "H";
    bgColor?: string;
    fgColor?: string;
  }

  export const QRCodeCanvas: FC<QRCodeCanvasProps>;
}
