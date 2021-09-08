import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Account } from '../models/account';
import { BankService } from '../services/bank.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  ELEMENT_DATA: Account[] = [];
  dataSource = new MatTableDataSource<Account>(this.ELEMENT_DATA);
  displayedColumns: string[] = [
    'account_number',
    'account_type',
    'balance',
    'isDisabled',
  ];
  displayedHeaders: string[] = [
    'Account Number',
    'Account Type',
    'Balance',
    '',
  ];
  totalAmount:number = 0;

  constructor(private bService: BankService) {}

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts() {
    try {
      this.bService.getAllAccounts().subscribe((data) => {
        let tempArray: any[] = [];
        tempArray = data;
        tempArray.forEach((item) => {

          // Count total amount
          this.totalAmount += Number(item['balance']);

          item['isDisabled'] = false;
          // Check if it's savings account
          if (item['account_type'] === 'savings' && item['balance'].includes('-')) {
            item['isDisabled'] = true;
          }

          // Check if it's Cheque and It has enough overdraft
          if (item['account_type'] === 'cheque' && item['balance'].includes('-') && item['balance'] > "-500") {
            item['isDisabled'] = true;
          }
        });
        this.dataSource.data = tempArray as Account[];
        console.warn(this.dataSource.data);
      });
    } catch (error) {
      console.log('Failed to fetch list', error);
    }
  }

  withDraw(element: any) {
    alert("Success");
  }
}
