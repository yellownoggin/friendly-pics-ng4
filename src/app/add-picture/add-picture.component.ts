import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { UploaderService } from '../shared/uploader.service';

@Component({
  selector: 'fp-add-picture',
  templateUrl: './add-picture.component.html',
  styleUrls: ['./add-picture.component.css']
})
export class AddPictureComponent implements OnInit, AfterViewInit {
    previewImage: string;
    // TODO: try object here
    currentFile: any;

  constructor(private upload: UploaderService) {
      this.previewImage = this.upload.previewImageUrl;
  }

  ngOnInit() {
        this.currentFile = this.upload.currentFile;
         console.log(' this.currentFile', this.currentFile);

  }

  ngAfterViewInit(): void {
    //   this.previewImage = this.upload.previewImageUrl;
    //   console.log(' this.previewImag i n after a minute',  this.previewImage);
  }

}
