import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private router: Router
  ) { }

  createToast(type: any, icon: any, text: any, color: any){
    let notifications = document.querySelector('.cust_toaster') as HTMLElement;
    let newToast = document.createElement('div');
    newToast.innerHTML = `
        <div class="custtoast ${type}" id="toast-element">
          <i class="${icon}" style="color: ${color};"></i>
          <div class="content">
              <span>${text}</span>
          </div>
      </div>`;
    notifications.appendChild(newToast);
    setTimeout(
        ()=>newToast.remove(), 4500
    )
}

  /**
   * Shows success
   * @param msg
   */
  showSuccess(msg:any) {
    // this.toasterService.success(msg, '', {
    //   timeOut: 4500,
    //   positionClass: 'toast-top-center'
    // });
    this.createToast('success', 'fa-solid fa-circle-check', msg, '#6d9c6d');

  }
/**
   * Shows error
   * @param msg
   */
  showError(msg:any) {
    if(!msg){
      // this.toasterService.error('Slow internet speed please try again', '', {
      //   timeOut: 4500,
      //   positionClass: 'toast-top-center'
      // });
      this.createToast('error', 'fa-solid fa-circle-exclamation', 'Slow internet speed please try again', '#cd1818');
    }else{
      console.log('msg',msg);
      // this.toasterService.error(msg, '', {
      //   timeOut: 4500,
      //   positionClass: 'toast-top-center'
      // });
      this.createToast('error', 'fa-solid fa-circle-exclamation', msg, '#cd1818');
    }
  }

  /**
   * Handles error
   * @template T
   * @param [operation]
   * @param [result]
   * @returns
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(
          `Api status code: ${error.status}`,
          `Api status message : ${error.message}`
        );

        // if(error.status == 401 && error.message == 'Authentication failed' ){
        //   this.router.navigate(['/login']);
        // }
        
        if(error.status == 401) {
          //localStorage.clear();
            if(this.router.url !='/login'){
              console.log('this.router.url',this.router.url)
              console.log('Your session has expired. please login again');
              this.showError('Your session has expired. please login again');
              localStorage.clear();
              this.router.navigate(['/login']);
              //this.helperService.showError(result.msg);
              //this.router.navigate(['/login']);
            }
            return throwError(error.message);
          
        }
        else{
          let errorMessage = '';
          //  || (error.error && error.error.errors)
          if(error.status == 422){
            for (var key in error.error.errors) {
              if (error.error.errors.hasOwnProperty(key)) {
                  for (var j = 0; j < error.error.errors[key].length; j++) {
                    errorMessage += error.error.errors[key][j];
                  }
              }
            }
          }
          else{
            errorMessage = 'Server Error';
          }
          error.message = errorMessage;
          return throwError(error);
        }

        return of(result as T);
    };
  }
}
