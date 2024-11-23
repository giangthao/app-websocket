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
  Octet,
} from './leamf-form.default';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
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
  Octet = Octet;
  protocolValue: { label: string; value: string }[] = [];

  formLeamf: FormGroup;
  isExistedLeamfId = false;
  isFetchingApi = false;
  listLea: any[] = fakeLeaList;
  isFtpOrRoseProtocol = true;

  availableLeaItems: any[] = [...this.listLea];

  // handle required ip address
  ipAddressTouchedAndEmpty = false;
  octetFocusStatus: Record<Octet, boolean> = {
    [Octet.Octet1]: false,
    [Octet.Octet2]: false,
    [Octet.Octet3]: false,
    [Octet.Octet4]: false,
  };
  octetIds = Object.values(Octet);
  // end handle required ip address

  constructor(
    private readonly leamfManagementService: LeamfManagementService,
    private readonly fb: FormBuilder
  ) {
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
      ipAddress: this.fb.group(
        this.octetIds.reduce(
          (acc, octet) => ({
            ...acc,
            [octet]: [
              null,
              {
                validators: Validators.compose([
                  Validators.required,
                  this.leamfManagementService.octerValidator(),
                ]),
              },
            ],
          }),
          {}
        )
      ),
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
      console.log(this.availableLeaItems);
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

  // HANDLE REQUIRED IP ADDRESS
  handleFocus(octet: Octet) {
    this.octetFocusStatus[octet] = true;
    this.checkIpAddressValidity();
  }

  handleBlur(octet: Octet) {
    this.octetFocusStatus[octet] = false;
    this.checkIpAddressValidity();
  }

  isAnyOctetFocused(): boolean {
    return Object.values(this.octetFocusStatus).some((status) => status);
  }

  areAllOctetsEmpty(): boolean {
    const ipAddressGroup = this.formLeamf.get('ipAddress')!;
    return Object.values(ipAddressGroup.value).every((val) => !val);
  }

  checkIpAddressValidity(): void {
    const ipAddressGroup = this.formLeamf.get('ipAddress')!;
    const allValues = Object.values(ipAddressGroup.value);
    this.ipAddressTouchedAndEmpty =
      allValues.every((val) => !val) && !this.isAnyOctetFocused();
  }

  handleOctetClick(event: any): void {
    this.formLeamf.get('ipAddress')?.markAsTouched();

    // Tìm octet trống đầu tiên
    const firstEmptyOctet = this.octetIds.find((octet) => {
      return !this.formLeamf.get(['ipAddress', octet])?.value;
    });

    // Nếu tìm thấy, focus vào ô đó
    if (firstEmptyOctet) {
      this.setFocusTo(firstEmptyOctet);
    }
  }

  setFocusTo(octet: Octet): void {
    const octetElement = document.getElementById(octet) as HTMLInputElement;
    octetElement?.focus();
    this.handleFocus(octet);
  }

  getPreviousInputId(currentId: string): string {
    const index = this.octetIds.indexOf(currentId as Octet);
    return index > 0 ? this.octetIds[index - 1] : this.octetIds[0];
  }

  getNextInputId(currentId: string): string {
    const index = this.octetIds.indexOf(currentId as Octet);
    return index >= 0 && index < this.octetIds.length - 1
      ? this.octetIds[index + 1]
      : this.octetIds[this.octetIds.length - 1];
  }
  // END HANDLE REQUIRED IP ADDRESS

  onOctetChange(event: Event, nextId: any) {
    const inputElement = event.target;
    if (inputElement instanceof HTMLInputElement) {
      const width =
        inputElement.value.length > 0
          ? 8 * inputElement.value.length + 8
          : 24 + 8;
      inputElement.style.width = `${width}px`;

      if (inputElement.value.length === 3 && nextId) {
        const nextInput = document.getElementById(nextId) as HTMLInputElement;
        setTimeout(() => {
          nextInput.focus();
          nextInput.setSelectionRange(0, 0);
        }, 0);
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
}
