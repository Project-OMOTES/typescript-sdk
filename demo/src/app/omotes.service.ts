import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { JobTypeName } from '@omotes/sdk';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OmotesService {
  private readonly http = inject(HttpClient);
  private readonly parser = new DOMParser();

  public submit(esdl: string, jobType: JobTypeName) {
    return this.http.post<{ esdl: string }>('/api/omotes', { esdl, type: jobType }).pipe(
      map((response) => {
        return {
          asString: response.esdl,
          asDocument: this.parser.parseFromString(response.esdl, 'text/xml'),
        }
      })
    );
  }

  public loadDemoESDL() {
    return this.http.get('assets/demo_esdl.esdl', { responseType: 'text' });
  }
}