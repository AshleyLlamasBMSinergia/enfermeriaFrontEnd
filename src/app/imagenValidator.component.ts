import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function imagenValidator(maxSize: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
  
    console.log(file);
    if (file && file.type.startsWith('image/')) {
      console.log(file);
      const fileSize = file.size / (1024 * 1024); // Convertimos el tamaño a MB

      if (fileSize > maxSize) {
        console.log(`El archivo excede el tamaño máximo de ${maxSize}MB.`);
        return { tamañoExcedido: true, mensaje: `El archivo excede el tamaño máximo de ${maxSize}MB.` };
      }
    } else if (file) {
      console.log('El archivo no es una imagen.')
      return { imagenInvalida: true, mensaje: 'El archivo no es una imagen.' };
    }

    return null;
  };
}
