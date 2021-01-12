import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { stringify } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { throwError } from "rxjs/internal/observable/throwError";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        let token = localStorage.getItem('token');

        const headers = new HttpHeaders({
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        });

        const cloneReq = request.clone({headers});

        return next.handle(cloneReq).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
            
                let errorObj = error;
                if (errorObj.error) {
                    errorObj = errorObj.error;
                }
                
                return throwError(error);
            }));
    }
}