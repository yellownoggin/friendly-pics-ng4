import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class UploaderService {
    __currentFile: any;
    __previewImageUrl: string;

    get previewImageUrl(): string {
        // console.log('preview image url works');
        // return 'hello from the preview image url get';
     console.log('truncated preview image in the getter', _.truncate(this.__previewImageUrl, {'length': 100}));
         return this.__previewImageUrl;
    }

    set previewImageUrl(newUrl: string) {

         this.__previewImageUrl = newUrl;
         console.log('truncated preview image', _.truncate(this.__previewImageUrl, {'length': 100}));
        //  console.log('this._previewImageUrl', this._previewImageUrl);
    }


    // TODO: <Object> did not work as a type moments 4 the file not sure how to do it
    get currentFile(): any {
        console.log('current file get works');
        return this.__currentFile;
    }

    set currentFile(newFile: any) {
         this.__currentFile = newFile;
        //  console.log('this._previewImageUrl', this._previewImageUrl);
    }

  constructor() { }

}
