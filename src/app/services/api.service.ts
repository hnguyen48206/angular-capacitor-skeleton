// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiservicesService {
  API_HOST = 'http://10.70.123.100:8086'
  OTP_LEN
  orgIds: any = [];
  currentUserData = null
  currentUserName = null
  isLogin = false;
  apiLists = {
    verifyotp: '/api/auth/verify-otp',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    //getOrganizationAll: '/api/organization/get-multiple',
    getOrgAll: '/api/auth/organizations',
    getOrgById: '/api/auth/organization/',
    createOrg: '/api/auth/organization',
    deleteOrg: '/api/auth/organization/',
    updateOrg: '/api/auth/organization/',
    getServices: '/api/auth/services',
    createService: '/api/auth/service',
    updateService: '/api/auth/service/',
    deleteService: '/api/auth/service/',
    getRoles: '/api/auth/roles',
    getRolePermission: '/api/auth/roles/permissions',
    createRoles: '/api/auth/role',
    updateRoles: '/api/auth/role/',
    deleteRoles: '/api/auth/role/',
    getPermissions: '/api/auth/permissions',
    createPermissions: '/api/auth/permission',
    updatePermissions: '/api/auth/permission/',
    deletePermissions: '/api/auth/permission/',
    getUsers: '/api/auth/users',
    getUserById: '/api/auth/user/',
    createUsers: '/api/auth/user',
    //getCamera: '/api/auth/cameras?orgId=',
    getCamera: '/api/cameras/all?orgId=',
    getCameraHasPermission: '/api/auth/cameras?has_permission=1',
    getRolePerTreegrid: '/api/role-permission/get-multiple-treegrid',
    getPhanquyenUserTree: '/api/auth/roles?tree=1',
    // updateMultiPerToRole: '/api/auth/role/{{roleId}}/permissions',
    updateMultiPerToRole: '/api/auth/role',
    //getCapquyenUser: '/api/user/get-multiple-treegrid',
    getCapquyenUserTreeAll: '/api/auth/users?tree=1',
    getCapquyenUserTree: '/api/auth/users?tree=1&filter=[{"filedName":"Status","operator":"=","value":"mở","linking":"and","type":"string"}]',
    //getPhanquyenCamera: '/api/role-per-cam-serv/get-multiple-treegrid',
    getPhanquyenCameraTree: '/api/auth/role-permission-camera-service?tree=1',
    //getCapquyenCamera: '/camera/get-multiple-by-orgid-treegrid',
    getCapquyenCameraTree: '/api/cameras?orgId=',
    //updateRolePermission: '/api/auth/role/{{roleId}}/permission/{{permissionId}}'
    updateRolePermission: '/api/auth/role/',
    //updateRoleUser: '/api/auth/user/{{username}}/roles'
    updateRoleUser: '/api/auth/user/',
    updateUsers: '/api/auth/user/',
    updateOrgByUser: '/api/auth/user/',
    deleteUser: '/api/auth/user/',
    //createCamera: '/api/auth/camera',
    createCamera: '/api/cameras',
    //updateCamera: '/api/auth/camera/',
    updateCamera: '/api/cameras/',
    deleteCamera: '/api/cameras/',
    createRolePerCamSer: '/api/auth/role-permission-camera-service',
    getServers: '/api/servers',
    getServersTree: '/api/servers?tree=1',
    createServer: '/api/server',
    updateServer: '/api/server/',
    deleteServer: '/api/server/',
    getRestreams: '/api/cameras/restreams',
    getCameraGroup: '/api/camera-groups',
    createCameraGroup: '/api/camera-group',
    updateCameraGroup: '/api/camera-group/',
    deleteCameraGroup: '/api/camera-group/',
    changePassword: '/api/auth/user/',
    resetPassword: '/api/auth/user/',
    getMeta: '/api/meta',
    forceResetPassword: '/api/auth/user/{1}/force-reset-password'


  }

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  checkIfAllControlsAreValid(form: FormGroup) {
    let check = true
    Object.keys(form.controls).forEach(key => {
      console.log(form.controls[key].invalid)
      if (form.controls[key].invalid)
        check = false
    });
    return check;
  }

  httpCall(url, header, body, method) {
    if (this.currentUserData != null) {
      header['Authorization'] = 'Bearer ' + this.currentUserData.token;
    }
    return new Promise((resolve, reject) => {
      if (method == 'get') {
        this.httpClient.get(url, { headers: header })
          .subscribe(res => {
            resolve(<any>res);
          }, (err) => {
            if (this.checkIfAuthenError(err)) {
              this.logout();
              reject(null);
            }
            else
              reject(err);
          });
      }
      else if (method == 'post') {
        this.httpClient.post(url, body, { headers: header })
          .subscribe(res => {
            resolve(<any>res);
          }, (err) => {
            if (this.checkIfAuthenError(err)) {
              this.logout();
              reject(null);
            }
            else
              reject(err);
          });
      }
      else if (method == 'patch') {
        this.httpClient.patch(url, body, { headers: header })
          .subscribe(res => {
            resolve(<any>res);
          }, (err) => {
            if (this.checkIfAuthenError(err)) {
              this.logout();
              reject(null);
            }
            else
              reject(err);
          });
      }
      else if (method == 'put') {
        this.httpClient.put(url, body, { headers: header })
          .subscribe(res => {
            resolve(<any>res);
          }, (err) => {
            if (this.checkIfAuthenError(err)) {
              this.logout();
              reject(null);
            }
            else
              reject(err);
          });
      }
      else if (method == 'delete') {
        this.httpClient.delete(url, { headers: header })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            if (this.checkIfAuthenError(err)) {
              this.logout();
              reject(null);
            }
            else
              reject(err);
          });
      }

    });
  }

  checkIfAuthenError(err) {
    console.log('Mã error:', err.status)
    if (err.status == 401 || err.status == 403)
      return true;
    else
      return false
  }

  logout() {
    this.isLogin = false;
    let body = {
      username: this.currentUserData.userInfo.userId
    }
    localStorage.removeItem('userData');
    this.router.navigate(['/home'], { queryParams: { clearHistory: true } });
    this.httpCall(this.API_HOST + this.apiLists.logout, {}, body, 'post');
  }

  checkIfHasRightToThisMenu(menuID) {
    let result = false;
    let rolePerList = this.currentUserData.rolePermission;
    for (let i = 0; i < rolePerList.length; ++i) {
      if (menuID == rolePerList[i].permissionId && rolePerList[i].assetType == 'menu') {
        result = true; break;
      }
    }
    return result;
  }

  checkIfUserHasRightToThisRoute(link) {
    let result = false;
    let rolePerList = this.currentUserData.rolePermission;
    for (let i = 0; i < rolePerList.length; ++i) {
      if (link == rolePerList[i].api && rolePerList[i].assetType == 'menu') {
        result = true; break;
      }
    }
    return result;
  }
}
