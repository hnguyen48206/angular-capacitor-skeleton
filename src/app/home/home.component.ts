import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public toastController: ToastController, private menu: MenuController) { }

  ngOnInit(): void {
  }

  openTestToast() {
    console.log('Click')
    this.menu.open('first');
    this.presentToast()
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

}
