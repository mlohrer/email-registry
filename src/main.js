import "./style.css";
import localforage from "localforage";

let addressList = [];
let filteredAddressList = [];
let filterList = [];

filterList.push(
  { key: 0, name: "filter-value-@", value: "@", includes: true },
  { key: 1, name: "filter-value-com", value: "com", includes: true },
  { key: 2, name: "filter-value-r", value: "禪", includes: false }
);

const getAddressListFromStorage = async () => {
  try {
    const storageItems = await localforage.getItem("addresses");
    storageItems !== null ? (addressList = storageItems) : "";
  } catch (err) {
    console.log(err);
  }
};

const writeAddressListToStorage = async () => {
  try {
    await localforage.setItem("addresses", addressList);
  } catch (err) {
    console.log(err);
  }
};

const filterAddressList = () => {
  filteredAddressList = addressList;
  filterList.forEach((item) => {
    filteredAddressList = filteredAddressList.filter((address) =>
      item.includes
        ? address.toLowerCase().includes(item.value.toLowerCase())
        : !address.toLowerCase().includes(item.value.toLowerCase())
    );
  });
};
// Test: assert addressList ['ab', 'bc', 'cd'] going through filterAddressList() with filterList [{value: 'c', includes: 'true'}] equals ['bc', 'cd']

const writeAddressListToDom = async () => {
  try {
    const tempDomFragment = new DocumentFragment();
    const addressListDomElement = document.getElementById("address-list");
    filterAddressList();
    filteredAddressList.forEach((address) => {
      const span = document.createElement("span");
      span.classList.add("email", "m-1");
      span.innerHTML = `${address} <button id="remove-button" class="focus:outline-none flex-initial w-2 h-2 m-2">
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,0 L 20,20 M 20,0 L 0,20" stroke="rgba(255, 2554, 2558)" stroke-width="4" />
            </svg>
          </button>`;
      // span.classList.add('')
      tempDomFragment.appendChild(span);
    });
    addressListDomElement.innerHTML = "";
    addressListDomElement.appendChild(tempDomFragment);
  } catch (err) {
    console.log(err);
  }
};
// Test: after executing writeAddressListToDom, document.getElementByID('address-list').children.forEach (item => assert addressList.indexOf(item.innerHTML) >= 0)

const writeFilterListToDom = async () => {
  try {
    const tempDomFragment = new DocumentFragment();
    const filterListDomElement = document.getElementById("filter-list");
    filterList.forEach((item) => {
      const includesBoolean = item.includes;
      const filterValue = item.value;
      const key = item.key;
      const form = document.createElement("form");
      form.classList.add(
        "filter-form",
        "flex",
        "flex-col",
        "sm:flex-row",
        "sm:space-x-6",
        "space-y-2",
        "sm:space-y-0",
        "w-full",
        "sm:w-2/3"
      );
      form.id = `filter-form-${filterValue}-${includesBoolean}`;
      form.innerHTML = `
                <div class="filter-form flex flex-row  sm:space-x-2 items-center border-2 rounded-md border-kortical flex-initial">
            <label for="filter-include" class="flex-initial p-2 bg-kortical text-white">Email</label>
            <select disabled name="includes" id="include-${key}" value="${includesBoolean}" class="filter-includes flex-1 border-0 text-kortical focus:ring-0">
              <option value="true">Contains: ${includesBoolean}</option>
              <option value="false">does not contain</option>
            </select>
          </div>
          <input type="text" id="filter-value-${filterValue}" class="filter-value flex-1 rounded-md border-2 border-kortical focus:border-kortical focus:outline-none" placeholder="Type something" value="${filterValue}" />
          <button class="h-6 w-6 self-end sm:self-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 self-end" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg></button>`;
      tempDomFragment.appendChild(form);
    });
    filterListDomElement.innerHTML = "";
    filterListDomElement.appendChild(tempDomFragment);

    const formElements = document.getElementsByClassName("filter-form");

    [].forEach.call(formElements, (element) => {
      element.addEventListener("submit", (element) => element.preventDefault());
    });

    const filterValueDomElement = document.getElementsByClassName(
      "filter-value"
    );

    [].forEach.call(filterValueDomElement, (element) => {
      element.addEventListener("input", updateFilterValue);
    });

    const filterIncludesDomElement = document.getElementsByClassName(
      "filter-includes"
    );

    [].forEach.call(filterIncludesDomElement, (element) => {
      element.addEventListener("change", updateFilterValue);
    });
  } catch (err) {
    console.log(err);
  }
};
// Test: after executing writeFilterListToDom with filterList [{value:'a', includes: true}, {value:'b', includes: false}], execute
// document.getElementByID('filter-list').children.forEach (item => assert filterList.indexOf(item.innerHTML) >= 0)

window.addEventListener("load", async () => {
  try {
    await getAddressListFromStorage();
    writeAddressListToDom();
    writeFilterListToDom();
  } catch (err) {
    console.log(err);
  }
});

const addEmailToDom = async () => {
  try {
    const emailInput = document.getElementById("email-input").value;
    addressList.push(emailInput);
    if (emailInput !== "") {
      await writeAddressListToDom();
      document.getElementById("email-input").innerHTML = "";
      writeAddressListToStorage();
      toggleModal();
    }
  } catch (err) {
    console.log(err);
  }
};
// Test: after executing addEmailToDom with test@test.com, assert document.getElementByID('filter-list').children[children.length - 1] equals filterList[filterList.length - 1]

const validateEmail = async (address) => {
  try {
    let response = await fetch(
      `https://api.trumail.io/v2/lookups/json?email=${address}`
    );
    let data = await response.json();
    let valid = await data.deliverable;
    if (!valid === true) {
      throw new Error(`Invalid eMail address, please try again.`);
    }
    return valid;
  } catch (err) {
    console.log(err);
  }
};
// Test: validateEmail('bubblywobbly').then(response => response.json()).then(data => assert (data.validFormat === true) && (data.deliverable === true))

const updateFilterValue = async () => {
  const filterValueDomElement = document.getElementsByClassName("filter-value");

  [].forEach.call(filterValueDomElement, (element) => {
    filterList.forEach((filterItem) => {
      if (filterItem["name"].includes(element.id)) {
        filterItem.value = element.value;
        filterItem.name = `filter-value-${element.value}`;
      }
    });
  });

  writeAddressListToDom();
};

document
  .getElementById("email-form")
  .addEventListener("submit", (event) => event.preventDefault());
document
  .getElementById("email-input")
  .addEventListener("keydown", (event) =>
    event.key === "Enter" ? event.preventDefault() : ""
  );

const toggleModal = () => {
  document.getElementById("modal-container").classList.toggle("hidden");
};
document.getElementById("add-user").addEventListener("click", toggleModal);
document.getElementById("modal-close").addEventListener("click", toggleModal);

const hideError = () => {
  document.getElementById("error-container").classList.add("hidden");
};
const showError = () => {
  document.getElementById("error-container").classList.remove("hidden");
};
document.getElementById("error-close").addEventListener("click", hideError);

const clickAddButton = async () => {
  const emailInput = document.getElementById("email-input").value;
  await validateEmail(emailInput).then((response) =>
    response === true ? addEmailToDom() : showError()
  );
};

document.getElementById("add-email").addEventListener("click", clickAddButton);
