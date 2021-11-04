const transactions = [];

const Modal = {
  open() {
    document.getElementById("modal").classList.add("active");
  },

  close() {
    document.getElementById("modal").classList.remove("active");
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finance:transactions")) || [];
  },
  set(transaction) {
    localStorage.setItem(
      "dev.finance:transactions",
      JSON.stringify(transaction)
    );
  },
};

const TransactionHandler = {
  all: Storage.get(),

  add(transaction) {
    TransactionHandler.all.push(transaction);
    App.reload();
  },

  remove(index) {
    TransactionHandler.all.splice(index, 1);
    App.reload();
  },

  expenses() {
    let expensesData = TransactionHandler.all
      .map((x) => x.amount)
      .filter((x) => x < 0);
    if (expensesData.length > 0) {
      return expensesData.reduce((sum, x) => sum + x);
    }
    return 0;
  },

  incomes() {
    let incomesData = TransactionHandler.all
      .map((x) => x.amount)
      .filter((x) => x > 0);
    if (incomesData.length > 0) {
      return incomesData.reduce((sum, x) => sum + x);
    }
    return 0;
  },

  total() {
    return this.incomes() + this.expenses();
  },
};

const DOM = {
  containerBody: document.getElementById("transactions-body"),

  addTransaction(transaction, index) {
    // Cria o elemento <tr>
    const tr = document.createElement("tr");
    tr.innerHTML = this.innerHTMLTransacation(transaction, index);

    this.containerBody.appendChild(tr);
  },

  innerHTMLTransacation(transaction, index) {
    const cssClass = transaction.amount > 0 ? "income" : "expense";

    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${cssClass}">${Utils.formatCurrency(transaction.amount)}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <a href="#"><img src="./assets/minus.svg" alt="Remover" onclick="TransactionHandler.remove(${index})" /></a>
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

  clearTransactions() {
    this.containerBody.innerHTML = "";
  },
};

const Utils = {
  formatDate(value) {
    const splittedDate = value.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatAmount(value) {
    value = Number(value.replace(/\,\./g, "")) * 100;
    return value;
  },

  formatCurrency(value) {
    let signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const Form = {
  description: document.getElementById("description"),
  amount: document.getElementById("amount"),
  date: document.getElementById("date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = this.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatData() {
    let { description, amount, date } = this.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  saveTransaction(transaction) {
    TransactionHandler.add(transaction);
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatData();
      Form.saveTransaction(transaction);
      Form.clearFields();
      Modal.close();
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    TransactionHandler.all.forEach((element, i) => {
      DOM.addTransaction(element, i);
    });

    Storage.set(TransactionHandler.all);

    DOM.updateBalance();
  },
  reload() {
    DOM.clearTransactions();
    this.init();
  },
};

App.init();
