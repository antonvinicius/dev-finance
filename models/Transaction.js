class Transaction {
  constructor(description, amount, date) {
    this.id = Math.random();
    this.description = description;
    this.amount = amount;
    this.date = date;
  }
}
