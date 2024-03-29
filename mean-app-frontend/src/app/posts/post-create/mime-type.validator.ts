import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType =
  (control:AbstractControl): Promise<{[key:string]:any}> | Observable<{[key:string]:any}> => {
    if (typeof(control.value) === 'string') {
      return of(null);
    }
    const file = control.value as File;
    const reader = new FileReader();

    const obs = Observable.create((observer:Observer<{[key:string]:any}>) => {
      reader.addEventListener('loadend', ()=>{
        let header:string = '';
        let isValid:boolean = false;

        const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0,4);
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }


        switch (header) {
          case '89504e47':
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
              break;
              default:
            isValid = false;
          break;
        }

        if(isValid===true){
          observer.next(null);
        }

        else if(isValid===false){
          observer.next({invalidMimeType:true});
        }

        observer.complete();
    });

    reader.readAsArrayBuffer(file);

  });
    return obs;


    
}
