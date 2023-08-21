import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeaders = this.authService.getAuthHeaders();
    const headersObject: { [key: string]: string | string[] } = {};
    
    authHeaders.keys().forEach(key => {
      const value = authHeaders.get(key);
      if (value !== null) {
        headersObject[key] = value;
      }
    });
    
    const authRequest = request.clone({ setHeaders: headersObject });
    return next.handle(authRequest);
  }
}