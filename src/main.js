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
        if (!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`);
        }
        return response;
    } catch (err) {
        console.log(err);
    }
}

// validateEmail('promalo@gmail.com').then(data => console.log(data));

const addEmailToDom = async () => {
    try {
        const emailInput = document.getElementById('email-input').value;
        addressList.push(emailInput);
        if (emailInput !== '') {
            await writeAddressListToDom();
            document.getElementById('email-input').innerHTML = '';
            writeAddressListToStorage();
            toggleModal();
        }
    } catch (err) {
        console.log(err);
    }
}

document.getElementById('email-form').addEventListener('submit', function (event) {
    event.preventDefault();
})

const toggleModal = () => {
    document.getElementById('modal-container').classList.toggle('hidden');
}
document.getElementById('add-user').addEventListener('click', toggleModal);
document.getElementById('modal-close').addEventListener('click', toggleModal);

document.getElementById('add-email').addEventListener('click', addEmailToDom);