import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ManageProductService } from 'src/app/components/manage-product/manage-product.service';
import { product_input_form } from 'src/app/core/constants/constant';
import { product } from 'src/app/core/models/models';

@Component({
  selector: 'button-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() modalType: string = '';
  @Input() btnType: string = '';
  @Input() iconName: string = '';
  @Input() btnFooter: string = '';
  @Input() btnName: string = '';
  @Input() productId: number;
  @Output() onClose = new EventEmitter();
  @Output() onClick = new EventEmitter();

  isVisible: boolean = false;
  isOkLoading: boolean = false;
  modalTitle: string;

  // for create and edit
  formInput: any;
  fileList: NzUploadFile[];
  productForm: FormGroup;

  // for get detail
  product: product;

  constructor(
    private manageProductService: ManageProductService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      price: ['', Validators.required],
      isBestSeller: ['', Validators.required],
    });
  }

  showModal(): void {
    this.productForm.reset();
    switch (this.modalType) {
      case 'addProduct': {
        this.modalTitle = 'เพิ่มสินค้า';
        this.formInput = product_input_form;
        break;
      }

      case 'viewProduct': {
        this.modalTitle = 'รายการสินค้า';
        this.getDetail();
        break;
      }

      case 'editProduct': {
        this.modalTitle = 'แก้ไขรายละเอียด';
        this.formInput = product_input_form;
        this.getDetail();
        setTimeout(() => {
          this.productForm.patchValue({
            name: this.product.name,
            type: this.product.type,
            description: this.product.description,
            image: this.product.image,
            price: this.product.price,
            isBestSeller: this.product.isBestSeller,
          });
        }, 100);
        break;
      }
    }
    this.isVisible = true;
  }

  handleOk(): void {
    const { name } = this.productForm.value;

    switch (this.modalType) {
      case 'addProduct': {
        console.log(this.productForm);
        this.modal.confirm({
          nzTitle: `คุณต้องการสร้างรายการ ${name} ใช่หรือไม่`,
          nzContent:
            '<b style="color: red;">กรุณาตรวจสอบความถูกต้องของข้อมูล</b>',
          nzCentered: true,
          nzOkText: 'ยืนยัน',
          nzOkType: 'primary',
          nzOkDanger: false,
          nzOnOk: () => this.createProduct(this.productForm.value),
          nzCancelText: 'ยกเลิก',
          nzOnCancel: () => console.log('Cancel'),
        });
        break;
      }

      case 'editProduct': {
        this.modal.confirm({
          nzTitle: `คุณต้องการแก้ไขรายการ ${name} ใช่หรือไม่`,
          nzContent:
            '<b style="color: red;">กรุณาตรวจสอบความถูกต้องของข้อมูล</b>',
          nzCentered: true,
          nzOkText: 'ยืนยัน',
          nzOkType: 'primary',
          nzOkDanger: false,
          nzOnOk: () => this.editProduct(this.productForm.value),
          nzCancelText: 'ยกเลิก',
          nzOnCancel: () => console.log('Cancel'),
        });
        break;
      }
    }
  }

  createProduct(product: product) {
    this.manageProductService.createProduct(product).subscribe({
      next: (res) => {
        console.log(res);
        this.handleCancel(true);
      },
      error: (error) => this.message.create('error', `${error.message}`),
    });
  }

  editProduct(product: product) {
    this.manageProductService.editProduct(product, this.productId).subscribe({
      next: (res) => {
        console.log(res);
        this.handleCancel(true);
      },
      error: (error) => this.message.create('error', `${error.message}`),
    });
  }

  getDetail() {
    this.manageProductService.getProductById(this.productId).subscribe({
      next: (res) => {
        this.product = res;
        console.log(this.product);
      },
      error: (error) => this.message.create('error', `${error.message}`),
    });
  }

  // onRefresh for refreshing after add product
  handleCancel(onRefresh?: boolean): void {
    if (onRefresh) this.onClose.emit(onRefresh);
    this.isVisible = false;
  }

  get productControl(): any {
    return this.productForm['controls'];
  }
}
