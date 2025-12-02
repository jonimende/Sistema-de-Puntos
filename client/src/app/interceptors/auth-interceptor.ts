import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('token');

  let clonedReq = req;

  if (token) {
    // Si hay token, lo agregamos al header 'x-token' (como definimos en el back)
    clonedReq = req.clone({
      setHeaders: {
        'x-token': token
      }
    });
  }

  return next(clonedReq);
};