import { Injectable } from '@angular/core';

import { Camera, Photo, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  
  constructor() { }
  public photos: Photos[] = []; //array of photos

  //variable which will act as key for the store
  private PHOTO_STORAGE : string ="photos";
  
  public async addNewToGallery(){
    //take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source:CameraSource.Camera,
      quality:100
    });

    //add the newly captured photos to the photos array --for temporary storage 
    
    // this.photos.unshift({
    //   filepath:"soon..",
    //   webviewPath:capturedPhoto.webPath
    // });

    //for permanent storage of pictures
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    //call yo save the photos array
    Storage.set({
      key:this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
}


  //saving pictures on device permanently
  private async savePicture(cameraPhoto: Photo)
  {
    //convert photo to base64 foremat required by fileSytem api to save

    const base64Data = await this.readAsBase64(cameraPhoto);
    
    //write the file to the data directory
    const fileName = new Date().getTime()+'.jpeg';
    const savedFile = await Filesystem.writeFile({
      path :fileName,
      data: base64Data,
      directory:Directory.Data
    });

    //use webpath to display the new image instead of base64 since it is already loaded into memory
    return{
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };

  }


  private async readAsBase64(cameraPhoto: Photo){
    //fetch the photo, read as blob , then convert to base64 format
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob:Blob) => new Promise((resolve,reject)=>{
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload =() =>{
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);

  });


  //loading saved photos:
  public async loadSaved(){
    //retrieve cached photo array data
    const photoList = await Storage.get({
      key: this.PHOTO_STORAGE
    });
    this.photos = JSON.parse(photoList.value) || [];


    //display the photo by reading into the base64 format 
    for(let photo of this.photos)
    {
        //read each saved photo's data from Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });

        //web Platforms only: Load the photo as base64 data:

        photo.webviewPath =`data:image/jpeg;base64,${readFile.data}`;
    }
  }
}
export interface Photos{
  filepath:string;
  webviewPath:string;
}
