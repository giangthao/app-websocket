import { Component } from '@angular/core';
import { tableHeader, mockData } from './list-lea.default';

@Component({
  selector: 'app-list-lea',
  templateUrl: './list-lea.component.html',
  styleUrls: ['./list-lea.component.scss'],
})
export class ListLeaComponent {
  listLea = mockData;
  TABLE_HEADER = tableHeader;
  items = [
    { name: 'Item 1', checked: false },
    { name: 'Item 2', checked: true },
    { name: 'Item 3', checked: false },
  ];
  isPopupOpen = false; // Trạng thái mở/đóng popup
  currentIndex: number | null = null; // Lưu index của checkbox hiện tại
  previousState: boolean = false; // Trạng thái trước khi thay đổi
  newState: boolean = false; // Trạng thái mới sau khi bấm vào checkbox

  onCheckboxChange(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;

    // Lưu trạng thái trước khi thay đổi
    this.previousState = this.items[index].checked;
    

    // Tạm thời cập nhật trạng thái để hiện thị trên UI
    this.items[index].checked = inputElement.checked;
    this.newState = inputElement.checked;

    // Lưu index hiện tại và mở popup xác nhận
    this.currentIndex = index;
    this.isPopupOpen = true;

  }

  confirmChange(): void {
    // Nếu người dùng đồng ý, cập nhật trạng thái checkbox
    if (this.currentIndex !== null) {
      this.items[this.currentIndex].checked = this.newState;
    }
    this.closePopup();
  }

  cancelChange(): void {
    console.log('cancel');
    console.log(this.previousState)
    // Khôi phục trạng thái trước đó nếu người dùng hủy
    if (this.currentIndex !== null) {
      this.items[this.currentIndex].checked = this.previousState;
    }
    this.closePopup();
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.currentIndex = null;
  }
}
