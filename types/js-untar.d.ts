declare module 'js-untar' {
    export interface TarFile {
        name: string;
        mode: string;
        blob: Blob;
        readAsString(): Promise<string>;
        readAsJSON(): Promise<any>;
    }

    export default function untar(arrayBuffer: ArrayBuffer): Promise<TarFile[]>;
}
