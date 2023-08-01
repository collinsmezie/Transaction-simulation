import { forEach } from 'lodash';
import './style.css';

const btnDeposit = document.querySelector('#btnDeposit');
const accName = document.querySelector('#userDepositName');
const amountAdded = document.querySelector('#userDeposit');
const userWithdraw = document.querySelector('#userWithdraw');
const amountWithdrawed = document.querySelector('#amountWithdrawed');
const transferTo = document.querySelector('#transferTo');
const transferFrom = document.querySelector('#transferFrom');
const btnTransfer = document.querySelector('#btnTransfer');
const amountTransfer = document.querySelector('#amountTransfer');
const balanceDiv = document.querySelector('.balances');
const msgDeposit = document.querySelector('.msgDeposit');
const msgWithdraw = document.querySelector('.msgWithdraw');
const showAmountInWords = document.querySelector('.showAmountInWords');
const msgTransfer = document.querySelector('.msgTransfer');
class Account {
  constructor() {
    const accountUsers = [
      { name: 'Wanjiru', balance: 0 },
      { name: 'Juma', balance: 0 },
      { name: 'Linda', balance: 0 },
    ];
    if (localStorage.getItem('accountUsers') === null) {
      localStorage.setItem('accountUsers', JSON.stringify(accountUsers));
    }
  }
}
const accounts = new Account();
const deposit = () => {
  btnDeposit.addEventListener('click', () => {
    if (amountAdded.value === '') {
      msgDeposit.innerHTML = 'Enter Amount';
      msgDeposit.style.color = 'red';
      return;
    }

    const users = JSON.parse(localStorage.getItem('accountUsers'));
    users.map((user) => {
      if (user.name === accName.value) {
        user.balance += Number(amountAdded.value);
        msgDeposit.innerHTML = 'Deposit Successful!';
        msgDeposit.style.color = 'green';
      }
    });
    localStorage.setItem('accountUsers', JSON.stringify(users));
    displayBalance();
  });
};
deposit();

const withdraw = () => {
  btnWithdraw.addEventListener('click', () => {
    if (amountWithdrawed.value === '') {
      msgWithdraw.innerHTML = 'Enter Amount';
      msgWithdraw.style.color = 'red';
      return;
    }

    const users = JSON.parse(localStorage.getItem('accountUsers'));
    users.map((user) => {
      if (user.name === userWithdraw.value) {
        if (user.balance >= Number(amountWithdrawed.value)) {
          user.balance -= Number(amountWithdrawed.value);
          msgWithdraw.innerHTML = 'Withdrawal Successful!';
          msgWithdraw.style.color = 'green';
        } else {
          msgWithdraw.innerHTML = 'Insufficient funds';
          msgWithdraw.style.color = 'red';
        }
      }
    });
    localStorage.setItem('accountUsers', JSON.stringify(users));

    displayBalance();
  });
};
withdraw();

const transfer = (sender, receipient) => {
  let storeSender;
  let storeReceipient;
  btnTransfer.addEventListener('click', () => {
    const users = JSON.parse(localStorage.getItem('accountUsers'));
    users.map((user) => {
      if (sender.value === user.name) {
        storeSender = user;
      } else if (receipient.value === user.name) {
        storeReceipient = user;
        console.log(storeReceipient,storeSender)
      }
    });

    if (sender.value === receipient.value) {
      msgTransfer.innerHTML = 'Please Select another Recipient';
      msgTransfer.style.color = 'red';
    } else if (amountTransfer.value === '') {
      msgTransfer.innerHTML = 'Enter Amount';
      msgTransfer.style.color = 'red';
    } else if (storeSender.balance < Number(amountTransfer.value)) {
      msgTransfer.innerHTML = 'Insufficient funds';
      msgTransfer.style.color = 'red';
    } else {
      storeSender.balance -= Number(amountTransfer.value);
      storeReceipient.balance += Number(amountTransfer.value);
      msgTransfer.innerHTML = 'Transfer Successful!';
      msgTransfer.style.color = 'green';
      localStorage.setItem('accountUsers', JSON.stringify(users));
      displayBalance();
      const amountInWords = document.createElement('p');
      showAmountInWords.innerHTML = '';
      showAmountInWords.style.color = 'green';
      amountInWords.innerText = `${storeSender.name} just tranferred ${numberToWord(amountTransfer.value )} naira to ${storeReceipient.name} `
      showAmountInWords.appendChild(amountInWords);

    }
  });
};
transfer(transferFrom, transferTo);

const displayBalance = () => {
  const users = JSON.parse(localStorage.getItem('accountUsers'));
  const newDiv = document.createElement('ol');
  balanceDiv.innerHTML = '';
  users.forEach((user) => {
    newDiv.innerHTML += `<li>${user.name} Balance - ${user.balance}</li>`;
  });
  balanceDiv.appendChild(newDiv);
};
displayBalance();

function numberToWord(number) {
  const singleDigits = [
    "", "one", "two", "three", "four",
    "five", "six", "seven", "eight", "nine"
  ];

  const teenNumbers = [
    "eleven", "twelve", "thirteen", "fourteen", "fifteen",
    "sixteen", "seventeen", "eighteen", "nineteen"
  ];

  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty",
    "sixty", "seventy", "eighty", "ninety"
  ];

  const bigNumbers = [
    "", "thousand", "million", "billion"
  ];

  function convertLessThanThousand(num) {
    if (num === 0) {
      return "";
    } else if (num < 10) {
      return singleDigits[num];
    } else if (num < 20) {
      return teenNumbers[num - 11];
    } else if (num < 100) {
      const ten = tens[Math.floor(num / 10)];
      const unit = singleDigits[num % 10];
      return `${ten}${unit ? "-" + unit : ""}`;
    } else {
      const hundred = `${singleDigits[Math.floor(num / 100)]} hundred`;
      const remainder = convertLessThanThousand(num % 100);
      return `${hundred}${remainder ? " " + remainder : ""}`;
    }
  }

  if (number === 0) {
    return "zero";
  }

  if (number < 0 || number > 1000000000) {
    return "Number out of range";
  }

  let word = "";
  let currentNumber = number;
  for (let i = bigNumbers.length - 1; i >= 0; i--) {
    const divisor = Math.pow(1000, i);
    const quotient = Math.floor(currentNumber / divisor);
    currentNumber %= divisor;
    if (quotient > 0) {
      const remainder = convertLessThanThousand(quotient);
      word += `${remainder} ${bigNumbers[i]} `;
    }
  }

  return word.trim();
}