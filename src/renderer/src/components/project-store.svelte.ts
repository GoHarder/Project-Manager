import { SvelteDate } from 'svelte/reactivity';

// MARK: Globals
// -----------------------------------------------------------------------------
class Store {
  _id = $state('');
  bookmarked = $state(false);
  completed = $state<string | null>(null);
  contractNo = $state('');
  created = $state('');
  currency = $state('');
  customerName = $state('');
  pinned = $state(false);
  poNo = $state('');
  price = $state(0);
  released = $state<string | null>(null);

  #dueDate = $state<SvelteDate>(new SvelteDate());
  #user = $state('');

  get dueDate() {
    return this.#dueDate.toISOString().slice(0, 10);
  }

  set dueDate(value: string) {
    this.#dueDate = new SvelteDate(value);
  }

  get user() {
    return this.#user;
  }

  set user(value: string) {
    this.#user = value.toLowerCase();
  }

  setData(data: App.ProjectDoc) {
    this._id = data._id;
    this.bookmarked = data.bookmarked;
    this.completed = data.completed;
    this.contractNo = data.contractNo;
    this.created = data.created;
    this.currency = data.currency;
    this.customerName = data.customerName;
    this.dueDate = data.dueDate;
    this.pinned = data.pinned;
    this.poNo = data.poNo;
    this.price = data.price;
    this.released = data.released;
    this.user = data.user;
  }

  getData() {
    return {
      _id: this._id,
      bookmarked: this.bookmarked,
      completed: this.completed,
      contractNo: this.contractNo,
      created: this.created,
      currency: this.currency,
      customerName: this.customerName,
      dueDate: this.dueDate,
      pinned: this.pinned,
      poNo: this.poNo,
      price: this.price,
      released: this.released,
      user: this.user,
    };
  }

  reset() {
    this._id = '';
    this.bookmarked = false;
    this.completed = null;
    this.contractNo = '';
    this.created = '';
    this.currency = '';
    this.customerName = '';
    this.dueDate = '';
    this.pinned = false;
    this.poNo = '';
    this.price = 0;
    this.released = null;
    this.user = '';
  }
}

// MARK: Library
// -----------------------------------------------------------------------------
export default new Store();
