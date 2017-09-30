// https://stackoverflow.com/questions/35789498/new-typescript-1-8-4-build-error-build-property-result-does-not-exist-on-t
export interface FileReaderEventTarget extends EventTarget {
    result: string;
}

export interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getmessage(): string;
}
// TODO: this is not right probably well definitely with any
// below did not work so trundling it for now

// export interface FileReader {
//     readAsDataUrl(file: any): string;
// }
