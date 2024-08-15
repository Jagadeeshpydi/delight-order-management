function showFoodDetails() {
    console.log('showFoodDetails called');
    document.getElementById('orderfood').style.display = 'block';
}

let totalItems = 0;
let totalAmount = 0;
let orderedItems = {};
let firstName = {};

const itemPrices = {
    "display1": 350,  // Chicken Dum Biryani
    "display2": 1250, // Mutton Spl Biryani
    "display3": 150,  // Chicken Shawarma
    "display4": 250,  // Veg Biryani
};

const itemNames = {
    "display1": "Chicken Dum Biryani",
    "display2": "Mutton Spl Biryani",
    "display3": "Chicken Shawarma",
    "display4": "Veg Biryani"
};

function incrementItem(displayId) {
    console.log(`Incrementing item: ${displayId}`);
    const displayElement = document.getElementById(displayId);
    let count = parseInt(displayElement.innerText, 10) || 0;
    count++;
    totalItems++;
    totalAmount += itemPrices[displayId];
    orderedItems[displayId] = (orderedItems[displayId] || 0) + 1;
    displayElement.innerText = count;
    updateTotalAmountDisplay();
}

function decrementItem(displayId) {
    console.log(`Decrementing item: ${displayId}`);
    const displayElement = document.getElementById(displayId);
    let count = parseInt(displayElement.innerText, 10) || 0;
    if (count > 0) {
        count--;
        totalItems--;
        totalAmount -= itemPrices[displayId];
        orderedItems[displayId]--;
        if (orderedItems[displayId] === 0) {
            delete orderedItems[displayId];
        }
        displayElement.innerText = count;
        updateTotalAmountDisplay();
    }
}

function updateTotalAmountDisplay() {
    console.log(`Updating total amount display: ${totalAmount}`);
    const totalAmountDisplay = document.getElementById('totalAmountDisplay');
    if (!isNaN(totalAmount)) {
        totalAmountDisplay.innerText = `Total Amount: ${totalAmount} Rs`; // Use backticks for string interpolation
    } else {
        console.error('Total amount calculation error');
        totalAmountDisplay.innerText = 'Total Amount: Error';
    }
}

function confirmOrder() {
    if (totalItems > 0) {
        // Retrieve the first name from sessionStorage
        const firstName = sessionStorage.getItem('firstName') || "User";
        console.log('Confirm order first name:', firstName);  // Debugging: Verify retrieval
        
        // Generate the order summary
        let orderSummary = Object.keys(orderedItems)
            .map(displayId => {
                const itemName = itemNames[displayId];
                const itemCount = orderedItems[displayId];
                const itemPrice = itemPrices[displayId];
                return `${itemName}: ${itemCount} x ${itemPrice} Rs`; // Use backticks for string interpolation
            })
            .join('\n');
        
        // Display the confirmation message with the order summary and total amount
        const confirmationMessage = `Thank you, ${firstName}!\n\nYour order is confirmed!\n\nTotal No of Items Added: ${totalItems}\nTotal Amount to be Paid: ${totalAmount} Rs\n\nOrder Summary:\n${orderSummary}`; // Use backticks for string interpolation
        
        alert(confirmationMessage);
        
        // Clear the order and total display after confirmation
        totalItems = 0;
        totalAmount = 0;
        orderedItems = {};
        updateTotalAmountDisplay();
        resetItemDisplays();
    } else {
        alert("Please add items to your order.");
    }
}

function resetItemDisplays() {
    Object.keys(itemNames).forEach(displayId => {
        document.getElementById(displayId).innerText = '0';
    });
}

// Ensure DOMContentLoaded is fired and event listener is attached
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const orderFoodLink = document.querySelector('.nav-link[href="#orderfood"]');
    if (orderFoodLink) {
        orderFoodLink.addEventListener('click', showFoodDetails);
    } else {
        console.error('Order Food link not found');
    }
});
