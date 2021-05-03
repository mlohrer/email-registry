import './style.css';
import localforage from "localforage";

let addressList = [];
let filteredAddressList = [];
let filterList = [];

// filterList.push({ value: 't', includes: true }, { value: 'x', includes: false });
// addressList.push('test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', 'test1', 'test2', 'superlongstringchain', );

const getAddressListFromStorage = async () => {
    try {
        const storageItems = await localforage.getItem('addresses');
        storageItems !== null ? addressList = storageItems : '';
    } catch (err) {
        console.log(err);
    }
};

const writeAddressListToStorage = async () => {
    try {
        await localforage.setItem('addresses', addressList);
    } catch (err) {
        console.log(err);
    }
}

const filterAddressList = () => {
    filteredAddressList = addressList;
    filterList.forEach(item => {
        filteredAddressList = filteredAddressList.filter(address =>
            item.includes ?
                address.toLowerCase().includes(item.value.toLowerCase()) :
                !address.toLowerCase().includes(item.value.toLowerCase())
        );
    });
};
// Test: assert addressList ['ab', 'bc', 'cd'] going through filterAddressList() with filterList [{value: 'c', includes: 'true'}] equals ['bc', 'cd']

const writeAddressListToDom = async () => {
    try {
        const tempDomFragment = new DocumentFragment;
        const addressListDomElement = document.getElementById('address-list');
        filterAddressList();
        filteredAddressList
            .forEach(address => {
                const span = document.createElement('span');
                span.innerHTML = `${address}`;
                tempDomFragment.appendChild(span);
            });
        addressListDomElement.innerHTML = '';
        addressListDomElement.appendChild(tempDomFragment);
    } catch (err) {
        console.log(err);
    }
}
// Test: after executing writeAddressListToDom, document.getElementByID('address-list').children.forEach (item => assert addressList.indexOf(item.innerHTML) >= 0)

const writeFilterListToDom = async () => {
    try {
        const tempDomFragment = new DocumentFragment;
        const filterListDomElement = document.getElementById('filter-list');
        filterList
            .forEach(item => {
                const span = document.createElement('span');
                item.includes === true ?
                    span.innerHTML = item :
                    span.innerHTML = item;
                tempDomFragment.appendChild(span);
            });
        filterListDomElement.innerHTML = '';
        filterListDomElement.appendChild(tempDomFragment);
    } catch (err) {
        console.log(err);
    }
}
// Test: after executing writeFilterListToDom with filterList [{value:'a', includes: true}, {value:'b', includes: false}], execute
// document.getElementByID('filter-list').children.forEach (item => assert filterList.indexOf(item.innerHTML) >= 0)

window.addEventListener('load', async () => {
    try {
        await getAddressListFromStorage();
        writeAddressListToDom();
        writeFilterListToDom();
    } catch (err) {
        console.log(err);
    }
})


const validateEmail = async (address) => {
    try {
        let response = await fetch(`https://api.trumail.io/v2/lookups/json?email=${address}`);
        let data = response.json();
        if (!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`);
        };
        if ((!data.validFormat === true) || (!data.deliverable === true)) {
            throw new Error(`Invalid eMail address, please try again.`)
        };
        if (data['Message']) {
            throw new Error(`You've submitted too many eMail addresses. Please try again in five minutes.`);
        }
        return data;
    } catch (err) {
        console.log(err);
    }
}
// Test: validateEmail('bubblywobbly').then(response => response.json()).then(data => assert (data.validFormat === true) && (data.deliverable === true))

const addEmailToDom = async () => {
    try {
        const emailInput = document.getElementById('email-input').value;
        addressList.push(emailInput);
        if (emailInput !== '') {
            await writeAddressListToDom();
            document.getElementById('email-input').innerHTML = '';
            writeAddressListToStorage();
            toggleModal();
        };
    } catch (err) {
        console.log(err);
    }
}
// Test: after executing addEmailToDom with test@test.com, assert document.getElementByID('filter-list').children[children.length - 1] equals filterList[filterList.length - 1]

document.getElementById('email-form').addEventListener('submit', function (event) {
    event.preventDefault();
})

const toggleModal = () => {
    document.getElementById('modal-container').classList.toggle('hidden');
}
document.getElementById('add-user').addEventListener('click', toggleModal);
document.getElementById('modal-close').addEventListener('click', toggleModal);

document.getElementById('add-email').addEventListener('click', addEmailToDom);

// Solutions for filtering addressList with an ordered chain of expressions containing an arbitrary number of AND/OR string filters:
// 1. Rewrite filterAddressList() to use addressList.filter(expression1 && expression2 || expression 3 || expression4 && expression 5)
// 2. Run filterAddressList() for all &&-linked filter expressions (grouped up through a for-loop with groupCount++ for every new || expression), then concat() all resulting arrays

// The first solution might not actually be faster in all browsers, esp. those not running on V8, since it relies on a browser-specific implementation of the new JS spec feature filter()