// Objetos testes
let t1 = new Transaction("Luz", -70050, new Date());
let t2 = new Transaction("Agua", -38755, new Date());
let t3 = new Transaction("Salario", 280000, new Date());

const transactions = [t1, t2, t3];

const Modal = {
  open() {
    document.getElementById("modal").classList.add("active");
  },

  close() {
    document.getElementById("modal").classList.remove("active");
  },
};

const TransactionHandler = {
  all: transactions,

  add(transaction) {
    TransactionHandler.all.push(transaction);
  },

  expenses() {
    return TransactionHandler.all
      .map((x) => x.amount)
      .filter((x) => x < 0)
      .reduce((sum, x) => sum + x);
  },

  incomes() {
    return TransactionHandler.all
      .map((x) => x.amount)
      .filter((x) => x > 0)
      .reduce((sum, x) => sum + x);
  },

  total() {
    return this.incomes() + this.expenses();
  },
};

const DOM = {
  addTransaction(transaction) {
    const tr = document.createElement("tr");
    tr.innerHTML = this.innerHTMLTransacation(transaction);
    const tbody = document.getElementById("transactions-body");
    tbody.appendChild(tr);
  },

  innerHTMLTransacation(transaction) {
    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${
      transaction.amount > 0 ? "income" : "expense"
    }">${Utils.formatCurrency(transaction.amount)}</td>
    <td class="date">${transaction.date.toLocaleDateString()}</td>
    <td>
      <a href="#"><img src="./assets/minus.svg" alt="Remover" /></a>
    </td>
    `;

    return html;
  },

  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      TransactionHandler.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      TransactionHandler.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      TransactionHandler.total()
    );
  },
};

const Utils = {
  formatCurrency(value) {
    let signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;
    console.log(value);
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

transactions.forEach((element) => {
  DOM.addTransaction(element);
});

DOM.updateBalance();
