import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { product } from 'src/app/core/models/models';
import { ManageProductService } from './manage-product.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
})
export class ManageProductComponent implements OnInit {
  products: product[] = [];
  filteredProducts: product[] = [];
  checked: boolean = false;
  indeterminate: boolean = false;
  isVisible: boolean = false;
  listOfCurrentPageData: readonly product[] = [];
  listOfData: readonly product[] = [];
  setOfCheckedId = new Set<number>();
  filterType = [
    { text: 'Food', value: 'Food' },
    { text: 'Car', value: 'Car' },
    { text: 'Clothing', value: 'Clothing' },
    { text: 'Technology', value: 'Technology' },
  ];
  filterBestSeller = [
    { text: 'สินค้าขายดี', value: true },
    { text: '-', value: false },
  ];

  filterTypeFn = (list: string[], listOfData: product) => {
    let a = list.some((type) => listOfData.type.indexOf(type) !== -1);
    return a;
  };
  filterBestSellerFn = (list: boolean[], listOfData: product) => {
    let a = list.map((val) => listOfData.isBestSeller === val);
    return a[0];
  };
  sortPriceFn = (a: product, b: product): number => a.price - b.price;

  constructor(
    private manageProductService: ManageProductService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.manageProductService.getProduct().subscribe({
      next: (res) => {
        this.products = res;
        this.listOfData = res;
        this.filteredProducts = res;
        console.log(this.products);
      },
      error: (error) => this.message.create('error', `${error.message}`),
    });
  }

  showModal() {
    this.isVisible = true;
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: `คุณต้องการลบรายการทั้งหมด ${this.setOfCheckedId.size} รายการใช่หรือไม่`,
      nzContent:
        '<b style="color: red;">หลังจากลบสินค้าจะไม่สามารถกู้คืนได้</b>',
      nzCentered: true,
      nzOkText: 'ยืนยันการลบ',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteProduct(this.setOfCheckedId),
      nzCancelText: 'ยกเลิก',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  onRefesh(status: boolean) {
    if (status) this.getProduct();
  }

  deleteProduct(id: Set<number>) {
    let value = [...id];

    value.map((id) => {
      this.manageProductService.deleteProduct(id).subscribe({
        next: (res) => {
          this.getProduct();
          this.message.create('success', `ลบรายการสินค้าเรียบร้อยแล้ว`);
          this.setOfCheckedId.delete(id)
        },
        error: (error) => this.message.create('error', `${error.message}`),
      });
    });
  }

  getKeyword(e: string) {
    this.filteredProducts = this.products.filter(
      (val) => val.name.toLocaleLowerCase().indexOf(e) !== -1
    );
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly product[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }
}
