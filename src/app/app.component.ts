// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiservicesService } from './services/api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor( private router: Router, private apiService: ApiservicesService) {
  }

  ngOnInit(): void {
    this.fetchConfigToAPIServices();
    this.getSavedUserInfo();
  }

  fetchConfigToAPIServices() {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/config.json`);

    req.onload = () => {
      let res = JSON.parse(req.response);
      console.log(res)
      this.apiService.API_HOST = res.API_HOST;
      this.apiService.OTP_LEN = res.OTP_LEN;
    };
    req.send();
  }

  async getSavedUserInfo() {
    let userData = await localStorage.getItem('userData');
    let userName = await localStorage.getItem('userName');
    this.apiService.currentUserName = userName
    try {
      if (JSON.parse(userData).token) {
        console.log('Thông tin user lưu trong local', userData);
        this.apiService.currentUserData = JSON.parse(userData);
        this.apiService.isLogin = true;
      }
    } catch (error) {
      console.log('Ko có thông tin local của user')
    }
    finally {
      this.router.initialNavigation();
    }
  }
}
