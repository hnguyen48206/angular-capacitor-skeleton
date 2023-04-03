import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { ApiservicesService } from 'src/app/services/api.service';
declare var cordova:any;
declare var ffmpeg:any;

@Component({
  selector: 'ngx-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isOTPShow=false;
  username = '';
  password = ''
  inputValidatingMessage = {
    usernameError: false,
    passwordError: false
  }
  loading = false;
  otpInput=''

  constructor(private router: Router, private apiService: ApiservicesService) { }

  ngOnInit(): void {
    if (this.apiService.isLogin)
      this.router.navigate(['/home'])

    if (this.apiService.currentUserName != null)
      this.username = this.apiService.currentUserName;
  }
  login() {
    console.log(this.username, this.password)
    this.username = this.username.trim();
    this.password = this.password.trim();
    if (this.validateInput()) {
      console.log('valiadte ok, có thể login')
      //goi api login
      let body = {
        username: this.username,
        password: sha256(this.password)
      }
      let url = this.apiService.API_HOST + this.apiService.apiLists.login;
      console.log(url)
      this.apiService.httpCall(url, {}, body, 'post')
        .then(res => {
          let result = <any>res;
          debugger
          if (result.code != 1)
            {
              this.showToast('bottom-right', 'danger', 'Thông Báo', result.msg);
            }
          else {
            //login thành công
            this.showToast('bottom-right', 'info', 'Thông Báo', result.msg);
            this.isOTPShow=true
          }
          localStorage.setItem('userName', this.username);
          this.apiService.currentUserName=<any>this.username;
        })
        .catch(err => {
          console.log(err)
          this.showToast('bottom-right', 'danger', 'Thông Báo', 'Lỗi hệ thống, xin vui lòng kiểm tra thông tin và kết nối trước khi thử lại')
        })
    }
  }
  verifyOTP()
  {
    if(this.otpInput.length!=5)
    this.showToast('bottom-right', 'info', 'Thông Báo', 'Mã OTP có độ dài là 5 ký tự.')
    else
    {
      //goi api login
      let body = {
        username: this.username,
        otp: this.otpInput
      }
      let url = this.apiService.API_HOST + this.apiService.apiLists.verifyotp;
      console.log(url)
      this.apiService.httpCall(url, {}, body, 'post')
        .then(res => {
          let result = <any>res;
          if (result.code != 1)
            {
              this.showToast('bottom-right', 'danger', 'Thông Báo', result.msg);
            }
          else {
            //login thành công
            this.showToast('bottom-right', 'info', 'Thông Báo', result.msg);
            this.successfullyVerifyOTP(result);
            console.log('login user:::',this.apiService.currentUserData);
          }        
        })
        .catch(err => {
          console.log(err)
          this.showToast('bottom-right', 'danger', 'Thông Báo', 'Lỗi hệ thống, xin vui lòng kiểm tra thông tin và kết nối trước khi thử lại')
        })
    }
  }
  onOtpChange(e:any)
  {
    console.log(e)
    this.otpInput=e
  }
  otpCancel()
  {
    this.isOTPShow=false;
  }
  successfullyVerifyOTP(result:any)
  {
    localStorage.setItem('userName', this.username);
    this.apiService.currentUserName=<any>this.username;

    this.apiService.currentUserData = result.data;
    localStorage.setItem('userData', JSON.stringify(result.data));
    this.apiService.isLogin=true;
    this.showToast('bottom-right', 'info', 'Thông Báo', result.msg);
    this.router.navigate(['/home'])

  }
  forgetPassword() {
    this.router.navigate(['/reset'])
  }
  showToast(position:any, status:any, title:any, message:any) {
  }
  validateInput() {
    let check = true;

    if (this.username.length > 20 || this.username.length < 3) {
      this.inputValidatingMessage.usernameError = true;
      check = false;
    }
    else
      this.inputValidatingMessage.usernameError = false;

    if (this.password.length > 20 || this.password.length < 3) {
      this.inputValidatingMessage.passwordError = true;
      check = false;
    }

    else
      this.inputValidatingMessage.passwordError = false;

    return check;
  }
  ngAfterViewInit()
  {
    console.log(ffmpeg);
    let outputPath = `storage/emulated/0/ffmpegtest.jpg`
    let cmd = `-loglevel debug -i rtsp://yq1:abcd$1234@14.241.248.157:1554/unicast/c43/s0/live -r 24 -vf mpdecimate,setpts=N/FRAME_RATE/TB -vsync 0 -q:v 3 -f image2 -update 1 ${outputPath}`
    ffmpeg.exec(cmd, (success:any) => console.log(success), (failure:any) => console.log(failure));
  }
}
