// https://stackoverflow.com/questions/35789498/new-typescript-1-8-4-build-error-build-property-result-does-not-exist-on-t
export interface FileReaderEventTarget extends EventTarget {
    result: string;
}

export interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getmessage(): string;
}

export interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}
// TODO: this is not right probably well definitely with any
// below did not work so trundling it for now

// export interface FileReader {
//     readAsDataUrl(file: any): string;
// }

export interface PromiseWithDeferred extends PromiseConstructor {
    deferred: object;
}


export class PromiseD<T> extends Promise<T>  {
    constructor(f: any) {
        super(f);
        Object.setPrototypeOf(this, PromiseD.prototype);

    }

    public deferred() {
        const result: any = {};
        result.promise = new Promise(function (resolve, reject) {
            result.resolve = resolve;
            result.reject = reject;
        });
        return result;
    }
}
