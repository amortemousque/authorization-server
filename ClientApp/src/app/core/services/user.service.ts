import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';
import { SearchUserQuery } from '../../user/list/user-list.state';
import { AccessTokenHolder } from '../auth/access-token-holder';
import { changeTenant } from '../utils/global.utils';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userApiUrl: string;

  constructor(private http: HttpClient, public tokenHolder: AccessTokenHolder) {
    this.userApiUrl = environment.adminApiUrl;
  }

  private get _authHeader(): string {
    return `Bearer ${this.tokenHolder.getAccessToken()}`;
  }


  searchUsers(query: SearchUserQuery): Observable<User[]> {
    const params = {
      name: query.name,
      email: query.email
    }
    return this.http.get<User[]>(`${this.userApiUrl}/users`, {
      headers: new HttpHeaders().set('Authorization', this._authHeader),
      params: params
    })
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(`${this.userApiUrl}/users/${id}`, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
  }

  addUser(user: User) {
    return this.http.post<any>(`${this.userApiUrl}/users/`, user, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
  }

  updateUser(user: User) {
    return this.http.put<any>(`${this.userApiUrl}/users/${user.id}`, user, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
  }

  deleteUser(id) {
    return this.http.delete<any>(`${this.userApiUrl}/users/${id}`, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
  }

  updateUserPassword(id: string)  {
    return this.http.put<any>(`${this.userApiUrl}/users/${id}/password`, { id : id }, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
  }

}
