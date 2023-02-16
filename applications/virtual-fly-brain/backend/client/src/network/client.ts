import axios, { AxiosRequestConfig } from 'axios'

const backendUrl = 'http://127.0.0.1:8080/'; 

export interface IHttpClientRequestParameters<T> {
  endPoint: string
  headers?: any
  method:string
  payload?: T
}

export interface IHttpClient {
  get<T>(parameters: IHttpClientRequestParameters<T>): Promise<T>
  post<T>(parameters: IHttpClientRequestParameters<T>): Promise<T>
}

export class HttpClient implements IHttpClient {
  public _url : string ;
  constructor(url:string){
    this._url = url ;
  }

  public encodeGetParams  = p => Object.entries(p).map(kv => kv.map( v => encodeURIComponent(v as string) ).join('=')).join('&');

  public get<T>(parameters: IHttpClientRequestParameters<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // extract the individual parameters
      const { method, payload, headers } = parameters;

      // axios request options like headers etc
      const options: AxiosRequestConfig = {
        headers: headers || {}
      }

      const url = buildUrl(this._url, method) + '?' + this.encodeGetParams(payload);

      // finally execute the GET request with axios:
      axios
        .get( url, options)
        .then((response: any) => {
          resolve(response.data as T)
        })
        .catch((response: any) => {
          reject(response)
        })

    })
  }

  public post<T>(parameters: IHttpClientRequestParameters<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { method, payload, headers } = parameters;

      // axios request options like headers etc
      const options: AxiosRequestConfig = {
        headers: headers || {}
      }

      const url = buildUrl(this._url, method);

      // finally execute the POST request with axios:
      axios
        .post(url, payload, options)
        .then((response: any) => {
          resolve(response.data as T)
        })
        .catch((response: any) => {
          reject(response)
        })
    })
  }
}

function buildUrl (base: string, method: string): string {
  const url = [ base ];

  url.push(method);

  return url.join('/');
}

export const backendClient = new HttpClient(backendUrl);
