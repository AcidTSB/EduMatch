// Type definitions for missing modules

declare module 'doctrine' {
  export interface ParseResult {
    description?: string;
    tags?: any[];
  }
  
  export function parse(comment: string, options?: any): ParseResult;
}

declare module 'find-cache-dir' {
  export default function findCacheDir(options?: {
    name?: string;
    cwd?: string;
    create?: boolean;
  }): string | null;
}

declare module 'mdx' {
  export interface MDXProps {
    [key: string]: any;
  }
  
  export default function mdx(options?: any): any;
}

declare module 'pretty-hrtime' {
  export default function prettyHrtime(hrtime: [number, number], options?: {
    precise?: boolean;
    verbose?: boolean;
  }): string;
}

declare module 'resolve' {
  export interface ResolveOptions {
    basedir?: string;
    extensions?: string[];
    [key: string]: any;
  }
  
  export interface ResolveCallback {
    (error: Error | null, resolved?: string): void;
  }
  
  export function resolve(id: string, opts: ResolveOptions, callback: ResolveCallback): void;
  export function resolve(id: string, callback: ResolveCallback): void;
  export namespace resolve {
    function sync(id: string, opts?: ResolveOptions): string;
  }
}

// Global type extensions
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_BASE_URL?: string;
      NEXT_PUBLIC_MOCK_API?: string;
      NEXTAUTH_SECRET?: string;
      NEXTAUTH_URL?: string;
      DATABASE_URL?: string;
      EMAIL_SERVER?: string;
      EMAIL_FROM?: string;
    }
  }
}

export {};