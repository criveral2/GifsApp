import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey:string = 'HmEAojLyJLbzlSFTKb7DqeBeBsM32yyT';
  private servicioUrl:string = 'https://api.giphy.com/v1/gifs';

  private _historial:string[] = [];

  public resultados:Gif[] = [];

  get historia(){
    return [...this._historial];
  }

  constructor( private http:HttpClient){
    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];
    this.resultados = JSON.parse( localStorage.getItem('gifs')! ) || []
  }


 
  
  buscarGifs( query:string = ''){

    query = query.trim().toLocaleLowerCase();

    if(!this._historial.includes( query )){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));

    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params:params})
      .subscribe((resp:any) => {
        this.resultados = resp.data;
        localStorage.setItem('gifs',JSON.stringify(this.resultados));
      // console.log( resp.data );
    });

    // console.log(this._historial);
  }
}
