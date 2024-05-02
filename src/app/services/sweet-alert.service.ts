import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  

  constructor() { }

  showErrorAlert(errorMessage: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    })
  }

  showSuccessToast(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'success',
      title: message,
    });
  }

  showErrorToast(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'error',
      title: message,
    });
  }

  showDeleteConfirmation(): Promise<SweetAlertResult> {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#607d8b',
      cancelButtonColor: '#ff5449',
      confirmButtonText: '¡Sí, bórralo!',
      cancelButtonText: 'Cancelar'
    });
  }

}
