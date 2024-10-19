import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  languages = [
    {
      code: 'en',
      label: 'English',
    },
    {
      code: 'vi',
      label: 'Tiếng Việt',
    },
    
  ];

  username = 'username';
  currentLang = 'en';
  isShowLanguageMenu = false;
  isShowUserMenu = false;

  setCurrentLang(lang: string) {
    this.currentLang = lang
  }

  toggleLanguageMenu()  {
     this.isShowLanguageMenu = !this.isShowLanguageMenu;
  }

  onLanguageMenuClickOutside() {
    this.isShowLanguageMenu = false;
  }

  toggleUserMenu()  {
    this.isShowUserMenu = !this.isShowUserMenu;
 }

 onUserClickOutside() {
   this.isShowUserMenu = false;
 }
}
