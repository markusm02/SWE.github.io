const addCustomer = require('./customers/addCustomer.js');
const addProduct = require('./products/addProduct.js');

// Test data for a customer
const testCustomer = {
    customerId: '12345',
    username: 'testUser',
    passwordHash: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    address: '123 Street, City'
};

const testCustomer1 = {
    "customerID": "1",
    "username": "TestUser",
    "passwordHash": "hashpassword1",
    "firstName": "Test",
    "lastName": "Last",
    "currentCart": [{ 
            "productName": "Classic Pants", "productID": "3", "quantity": 2, "price": 19.99 
        },{
            "productName": "Classic T-Shirt", "productID": "1", "quantity": 1, "price": 10.00
        }], 
    "orderHistory": [{ 
        "orderId": "1", "orderDate": "2023-09-30", 
             "items": [{
                 "productID": "14", "quantity": 2, "price": 15.99
             }], 
        "totalAmount": 31.98, 
        "shippingAddress": { 
            "streetAddress": "123 Street Name", 
            "city": "Test City", 
            "state": "TX", 
            "zipCode": "12345" }, 
        "paymentMethod": "credit-card"
     },{
        "orderId": "2", "orderDate": "2023-10-15", 
             "items": [{
                 "productID": "8", "quantity": 1, "price": 19.99
             },{
                "productID": "4", "quantity": 2, "price": 6.99
             }], 
        "totalAmount": 33.97,
        "shippingAddress": { 
            "streetAddress": "123 Street Name", 
            "city": "Test City", 
            "state": "TX", 
            "zipCode": "12345" }, 
        "paymentMethod": "credit-card"
     }], 
    "addresses": [{ 
        "addressId": "Test Address AVE", 
        "streetAddress": "123 Street Name", 
        "city": "San Antonio", 
        "state": "TX", 
        "zipCode": "12345", 
        "country": "United States" 
    }], 
    "paymentMethods": [{ 
        "paymentMethodID": "payment-method-1",
        "cardHolderName": "First Last", 
        "cardType": "Visa", 
        "lastFourDigits": "1234", 
        "expDate": "12/2024", 
        "billingAddress": { 
            "streetAddress": "123 Street Name", 
            "city": "City Name", 
            "state": "State", 
            "zipCode": "12345" 
            }
        }], 
    "discounts": {
        "firstTimeDiscount": true,
        "firstTimeDiscountValue": "15%", 
        "otherDiscounts": [{ 
            "discountID": "discount-1", 
            "discountValue": "10%", 
            "applied": false 
        },{
            "discountID": "discount-2",
            "discountValue": "15%",
            "applied": false
        }] 
    } 
};

const testProduct1 = {
    "productID": "1", 
	"productName": "Classic T-Shirt",
	"productCategory": "shirts", 
	"availableSizes": ["S", "M", "L", "XL"], 
	"availableColors": ["white", "black", "blue"], 
	"price": 19.99, 
	"availableStock": { "S": 50, "M": 40, "L": 60, "XL": 30 },
	"productDescription": "A classic cotton t-shirt.", 
	"images": ["image1_url", "image2_url"]
};

const testProduct2 = {
    "productID": "3", 
	"productName": "Classic Pants",
	"productCategory": "pants", 
	"availableSizes": ["S", "M", "L", "XL"], 
	"availableColors": ["white", "black", "blue", "green"], 
	"price": 25.00, 
	"availableStock": { "S": 40, "M": 40, "L": 60, "XL": 20 },
	"productDescription": "Classic cotton pants.", 
	"images": ["image3_url", "image4_url"]
};

// Test data for a product
const testProduct = {
    productId: '1',
    name: 'Classic T-Shirt',
    category: 'shirts',
    size: ['S', 'M', 'L', 'XL'],
    color: ['white', 'black', 'blue'],
    price: 19.99,
    stock: { 'S': 50, 'M': 40, 'L': 30, 'XL': 20 },
    description: 'A classic cotton t-shirt.',
    images: ['image1_url', 'image2_url']
};



(async () => {
    try {
        await addCustomer(testCustomer1);
        await addProduct(testProduct2);
        console.log('Test data inserted successfully!');
    } catch (error) {
        console.error('Error inserting test data:', error);
    }
})();