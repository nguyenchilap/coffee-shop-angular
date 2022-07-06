import { Component, OnInit } from '@angular/core';
import { Voucher } from '../voucher.component';
import { VoucherService } from '../voucher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: ['./create-voucher.component.css']
})
export class CreateVoucherComponent implements OnInit {

  voucher: Voucher = new Voucher();

  constructor(private voucherService: VoucherService, private router: Router) { }

  ngOnInit(): void {
  }


  onSubmitCreateVoucher(event:any) {
    this.voucherService.createVoucher(this.voucher).subscribe(res => {
      alert("Create voucher successfully !!! Voucher ID: " + res.voucherId);
      this.router.navigate(['voucher']);
    }, error => {
      alert("Create voucher error !!! Error: " + error);
    })
  }

  allowFloat(event:any) {
    if (event.which != 46 && (event.which < 48 || event.which > 57)) {
      event.preventDefault();
      if (event.which != 46 && event.target.value.indexOf('.') != -1) {
        event.preventDefault();
      }
    }
  }
}
