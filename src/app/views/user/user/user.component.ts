import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../core/services/Common/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [
    `:host ::ng-deep .p-dialog {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
  ],
  providers: [MessageService, ConfirmationService],
})
export class UserComponent {
  submitted: boolean = false;
  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  users: any = [];
  user: any;
  userDialog: boolean = false;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit() {
    this.fetchAdminPostList();
  }

  openNew() {
    this.submitted = false;
    this.userDialog = true;
    this.user = {};
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  fetchAdminPostList() {
    let requestConfig = {}
    this.isLoading = true;
    this.subscriptions.push(
      this.commonService.getAPICall({
        url: 'users',
        data: requestConfig
      }).subscribe((result) => {
        this.spinner.hide();
        this.isLoading = false;
        this.users = result;
      }, (err) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
      })
    )
  }

  editUserOpen(user: any) {
    this.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      street: user.address.street,
      city: user.address.city,
      zipcode: user.address.zipcode
    };
    this.userDialog = true;
  }

  confirmSave() {
    if (this.user.id)
      this.editUser();
    else
      this.createUser();
  }

  createUser() {
    this.submitted = true;
    let requestConfig = {
      id: Number(this.users[this.users.length - 1].id) + 1,
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      address: {
        street: this.user.street,
        city: this.user.city,
        zipcode: this.user.zipcode
      }
    };

    this.isLoading = true;
    this.spinner.show();
    this.subscriptions.push(
      this.commonService.postAPICall({
        url: 'users',
        data: requestConfig
      }).subscribe((result) => {
        this.spinner.hide();
        this.isLoading = false;
        this.users = [result, ...this.users];
        this.user = {};
        this.userDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
      }, (err) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
      })
    )
  }

  editUser() {
    this.submitted = true;
    let requestConfig = {
      id: this.user.id,
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      address: {
        street: this.user.street,
        city: this.user.city,
        zipcode: this.user.zipcode
      }
    };

    let url = (this.user.id > 10) ? `users/1` : `users/${this.user.id}`;

    this.isLoading = true;
    this.spinner.show();
    this.subscriptions.push(
      this.commonService.putAPICall({
        url: url,
        data: requestConfig
      }).subscribe((result) => {
        this.spinner.hide();
        this.isLoading = false;
        console.log(result);
        this.users = this.users.map((m: any) => {
          if (m.id != this.user.id)
            return m;
          else
            return { ...result, id: this.user.id };
        });
        this.user = {};
        this.userDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
      }, (err) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
      })
    )
  }

  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;
        this.spinner.show();
        this.subscriptions.push(
          this.commonService.deleteAPICall({
            url: `users/${user.id}`,
          }).subscribe((result) => {
            this.spinner.hide();
            this.isLoading = false;
            this.users = this.users.filter((f: any) => f.id != user.id);
            this.user = {};
            this.userDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
          }, (err) => {
            this.spinner.hide();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
          })
        )
      }
    });
  }

  nameValidation(event: any) {
    let reg = /[^a-zA-Z ]/g;
    let value = event.target.value;

    if (reg.test(value)) {
      event.target.value = value.replace(reg, '');
      this.user.name = value.replace(reg, '');
    }
  }
  
  emailValidation(event: any) {
    let reg = /[^a-zA-Z0-9@.' ]/g;
    let value = event.target.value;

    if (reg.test(value)) {
      event.target.value = value.replace(reg, '');
      this.user.email = value.replace(reg, '');
    }
  }

  phoneValidation(event: any) {
    let reg = /[^0-9]/g;
    let value = event.target.value;

    if (reg.test(value)) {
      event.target.value = value.replace(reg, '');
      this.user.phone = value.replace(reg, '');
    }
  }

  streetValidation(event: any) {
    let reg = /[^a-zA-Z0-9.,:/| ]/g;
    let value = event.target.value;

    if (reg.test(value)) {
      event.target.value = value.replace(reg, '');
      this.user.street = value.replace(reg, '');
    }
  }

  cityValidation(event: any) {
    let reg = /[^a-zA-Z0-9.,:\-/| ]/g;
    let value = event.target.value;

    if (reg.test(value)) {
      event.target.value = value.replace(reg, '');
      this.user.city = value.replace(reg, '');
    }
  }

  zipcodeValidation(event: any) {
    let reg = /[^a-zA-Z0-9\- ]/g;
    let value = event.target.value;

    if (reg.test(value)) {
      event.target.value = value.replace(reg, '');
      this.user.zipcode = value.replace(reg, '');
    }
  }
}
