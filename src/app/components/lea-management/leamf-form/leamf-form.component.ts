import { Component, Input, OnInit } from '@angular/core';
import {
  TypeLeamfForm,
  type,
  hi2ProtocolValues,
  hi3ProtocolValue,
  HI2,
  HI3,
  ROSE,
  FTP,
  allowedKeys,
  fakeLeaList,
} from './leamf-form.default';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LeamfManagementService } from 'src/app/services/leamf-management.service';

@Component({
  selector: 'app-leamf-form',
  templateUrl: './leamf-form.component.html',
  styleUrls: ['./leamf-form.component.scss'],
})
export class LeamfFormComponent implements OnInit {
  @Input() type?: TypeLeamfForm;

  ADD = TypeLeamfForm.add;
  EDIT = TypeLeamfForm.edit;
  PROTOCOL_TYPE = type;
  protocolValue: { label: string; value: string }[] = [];

  formLeamf: FormGroup;
  isExistedLeamfId = false;
  isFetchingApi = false;
  listLea: any[] = fakeLeaList;
  isFtpOrRoseProtocol = true;

  availableLeaItems: any[] = [...this.listLea];

  constructor(private readonly leamfManagementService: LeamfManagementService) {
    this.formLeamf = new FormGroup({
      leaId: new FormControl(null, {
        validators: Validators.compose([Validators.required]),
      }),
      leamfId: new FormControl(null, {
        validators: Validators.compose([
          Validators.required,
          this.leamfManagementService.textValidator(),
        ]),
      }),
      protocolType: new FormControl(null, {
        validators: Validators.compose([Validators.required]),
      }),
      protocolValue: new FormControl(null, {
        validators: Validators.compose([Validators.required]),
      }),
      ipAddress: new FormGroup({
        octet1: new FormControl(null, {
          validators: Validators.compose([
            Validators.required,
            this.leamfManagementService.octerValidator(),
          ]),
        }),
        octet2: new FormControl(null, {
          validators: Validators.compose([
            Validators.required,
            this.leamfManagementService.octerValidator(),
          ]),
        }),
        octet3: new FormControl(null, {
          validators: Validators.compose([
            Validators.required,
            this.leamfManagementService.octerValidator(),
          ]),
        }),
        octet4: new FormControl(null, {
          validators: Validators.compose([
            Validators.required,
            this.leamfManagementService.octerValidator(),
          ]),
        }),
      }),
      port: new FormControl(null, {
        validators: Validators.compose([
          Validators.required,
          this.leamfManagementService.portValidator(),
        ]),
      }),
      destinationPath: new FormControl(null, {
        validators: Validators.compose([
          Validators.required,
          this.leamfManagementService.textValidator(),
        ]),
      }),
      username: new FormControl(null),
      password: new FormControl(null),
    });
  }

  ngOnInit(): void {
    if (!this.type) {
      this.type = this.ADD;
    }

    this.formLeamf.valueChanges.subscribe((value) => {
      console.log(value);
    });

    this.formLeamf.get('leaId')?.valueChanges.subscribe((value) => {
      console.log('lea select change', value);
      // Cập nhật danh sách các mục có thể chọn
      this.availableLeaItems = this.listLea.filter(
        (item) => !value.some((selected: any) => selected === item.value)
      );
      console.log(this.availableLeaItems)
    });

    this.formLeamf.get('protocolValue')?.valueChanges.subscribe((value) => {
      if (value && (value === ROSE || value === FTP)) {
        this.isFtpOrRoseProtocol = true;
      } else {
        this.isFtpOrRoseProtocol = false;
      }
    });

    this.formLeamf.get('protocolType')?.valueChanges.subscribe((value) => {
      switch (value) {
        case HI2: {
          this.protocolValue = hi2ProtocolValues;
          this.formLeamf.patchValue({
            protocolValue: this.protocolValue[0].value,
          });
          break;
        }
        case HI3: {
          this.protocolValue = hi3ProtocolValue;
          this.formLeamf.patchValue({
            protocolValue: this.protocolValue[0].value,
          });
          break;
        }
        default: {
          this.protocolValue = [];
          this.formLeamf.patchValue({
            protocolValue: null,
          });
          break;
        }
      }
    });

    this.formLeamf.patchValue({
      protocolType: HI2,
    });
  }

  onOctetChange(event: Event, nextId: string) {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement) {
      const width =
        inputElement.value.length > 0
          ? 8 * inputElement.value.length + 8
          : 24 + 8;
      inputElement.style.width = `${width}px`;

      if (inputElement.value.length === 3) {
        const nextInput = document.getElementById(nextId) as HTMLInputElement;
        setTimeout(() => {
          nextInput.focus();
          nextInput.setSelectionRange(0, 0);
        }, 0);
      }
    }
  }

  handleOctetClick(event: any): void {
    if (
      !this.ipAddressFormGroup.get('octet1')?.value &&
      !this.ipAddressFormGroup.get('octet2')?.value &&
      !this.ipAddressFormGroup.get('octet3')?.value &&
      !this.ipAddressFormGroup.get('octet4')?.value
    ) {
      const firstOctet = document.getElementById('octet1') as HTMLInputElement;
      firstOctet.focus();
      return;
    }

    if (!event.target.value) {
      for (let i = 1; i < 5; i++) {
        const tmpId = 'octet' + String(i);
        const octetElement = document.getElementById(tmpId) as HTMLInputElement;
        if (!octetElement?.value) {
          octetElement.focus();
          return;
        }
      }
    }
  }

  handleOctetKeydownEvent(event: KeyboardEvent, currentId: string) {
    const currentInput = document.getElementById(currentId) as HTMLInputElement;
    const caretPosition = currentInput.selectionStart;

    if (
      event.key === 'ArrowRight' &&
      caretPosition === currentInput.value.length
    ) {
      if (currentInput.value.trim().length < 1) {
        return;
      }
      const nextInputId = this.getNextInputId(currentId);
      const nextInput = document.getElementById(
        nextInputId
      ) as HTMLInputElement;

      setTimeout(() => {
        nextInput.focus();
        nextInput.setSelectionRange(0, 0);
      }, 0);
      return;
    }

    if (event.key === 'ArrowLeft' && caretPosition === 0) {
      const preInputId = this.getPreviousInputId(currentId);
      const preInput = document.getElementById(preInputId) as HTMLInputElement;

      setTimeout(() => {
        preInput.focus();
        const length = preInput.value.length;
        preInput.setSelectionRange(length, length); // Đặt caret ở cuối
      }, 0);
      return;
    }

    if (event.key === 'Backspace') {
      if (currentInput.value.length === 0 && currentId !== 'octet1') {
        const previousInputId = this.getPreviousInputId(currentId);
        const previousInput = document.getElementById(
          previousInputId
        ) as HTMLInputElement;

        setTimeout(() => {
          previousInput.focus();
          const length = previousInput.value.length;
          previousInput.setSelectionRange(length, length); // Đặt caret ở cuối
        }, 0);
      }
      return;
    }

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  get ipAddressFormGroup(): FormGroup {
    return this.formLeamf.get('ipAddress') as FormGroup;
  }

  private getPreviousInputId(currentId: string): string {
    switch (currentId) {
      case 'octet2':
        return 'octet1';
      case 'octet3':
        return 'octet2';
      case 'octet4':
        return 'octet3';
      default:
        return 'octet1';
    }
  }

  private getNextInputId(currentId: string): string {
    switch (currentId) {
      case 'octet1':
        return 'octet2';
      case 'octet2':
        return 'octet3';
      case 'octet3':
        return 'octet4';
      case 'octet4':
        return 'octet4';
      default:
        return 'octet1';
    }
  }
}
