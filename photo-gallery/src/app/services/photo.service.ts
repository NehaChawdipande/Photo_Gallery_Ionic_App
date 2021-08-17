import { Injectable } from '@angular/core';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }
  public photos: Photo[] = []; //array of photos
  
  
  public async addNewToGallery(){
    //take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source:CameraSource.Camera,
      quality:100
    });

    //add the newly captured photos to the photos array
    this.photos.unshift({
      filepath:"soon..",
      webviewPath:capturedPhoto.webPath
    });

  }
  
}

export interface Photo{
  filepath:string;
  webviewPath:string;
}
