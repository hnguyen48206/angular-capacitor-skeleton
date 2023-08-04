import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { ApiservicesService } from 'src/app/services/api.service';
declare var cordova:any;
declare var ffmpeg:any;
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { DomSanitizer } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'ngx-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logContent="";
  isFirstFrameRecieved = false;
  frameSrc=null;
  framePlaceholder="https://1.bp.blogspot.com/-PKKbVJnT3HM/YLO8Wl3N6sI/AAAAAAAAANE/jMkd7M72r10JGYDeBba5OjAxjcTx9TMFQCLcBGAsYHQ/s16000/career-in-technology-feature.png";
  isOTPShow=false;
  username = '';
  password = ''
  inputValidatingMessage = {
    usernameError: false,
    passwordError: false
  }
  loading = false;
  otpInput=''

  constructor(private zone: NgZone, public sanitizer: DomSanitizer, private router: Router, private apiService: ApiservicesService) { }
 
  getImagePlaceholder(source:any, type:any)
  {
    console.log('img error ----------------------------------------------')
    switch (type) {
      case 'url':
        this.frameSrc = <any>this.sanitizer.bypassSecurityTrustUrl(source); break;
      case 'resource':
        this.frameSrc = <any>this.sanitizer.bypassSecurityTrustResourceUrl(source);  break;  
      default:
        break;
    }
  }
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
    // console.log(ffmpeg);
   this.ffmpegTest();
  }

  async ffmpegTest()
  {
    let outputPath = 'storage/emulated/0/' + Directory.Documents + `/testffmpeg/ffmpegtest.jpg`
    // let outputPath = 'storage/emulated/0/' + Directory.Documents + `/testffmpeg/ffmpegtest.webp`
    console.log(outputPath)
    let inputStream = 'rtsp://1cua:1Cuatunghia@113.160.245.246:554/cam/realmonitor?channel=1&subtype=0'
    // let cmd = `-loglevel debug -i ${inputStream} -y -r 24 -vsync 0 -q:v 3 -f image2 -update 1 ${outputPath}`
    // let cmd = `-loglevel debug -i ${inputStream} -y -r 24 -vsync 0 -q:v 3 -f image2 -update 1 -`

    // Using webp for smaller file size anf also -q:v (range from 1 to 30) 15 to reduce quality to 50% + 720p resolution
    let cmd = `-loglevel debug -fflags nobuffer -flags low_delay -rtsp_transport tcp -i ${inputStream} -vframes 1 -update 1 -vsync 0 -q:v 15 -vf scale=-1:720 ${outputPath}`
    await Filesystem.requestPermissions();
    try {
      let res = await Filesystem.mkdir({
        path: 'testffmpeg',
        directory: Directory.Documents,
        recursive: false,
      });
      console.log("folder ", res);
    } catch (e) {
      console.error("Unable to make directory", e);
    }
  
    try {
      let self=this;
      ffmpeg.exec(cmd,
        (success:any) => {
          console.log(success);
          self.zone.run(() => {
            self.logContent = self.logContent + `\n` + success;
            if(success.startsWith('frame'))
            {
              if(!this.isFirstFrameRecieved)
              {
                this.isFirstFrameRecieved=true;
              }
              let fileSrc = Capacitor.convertFileSrc('file:///' + outputPath + "?t=" + new Date().getTime());
              console.log('File src' , fileSrc)
              self.frameSrc = <any>this.sanitizer.bypassSecurityTrustResourceUrl(fileSrc);
            }
          });

        }
        ,(failure:any) => console.log(failure));
    } catch (error) {
      console.log(error)
    }
  }
}
