import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/Common/common.service';
import { HelperService } from '../../core/services/Helper/helper.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { MenuItem } from 'primeng/api';
declare var io: any;

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private helperService: HelperService
  ) {

  }
  ngOnInit(): void {
    this.items = [
      { label: 'User', icon: 'pi pi-user' }
    ]
  }

}





