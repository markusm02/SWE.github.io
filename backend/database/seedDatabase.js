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

const testProduct3 = {
    "categoryID":2,
    "categoryName":"dress pants",
    "availableColors":["black","blue"],
    "availableSizes":["M","L","XL"],
    "categoryImageName":"category_image_2.jpg",
    "categoryImageURL":"https://example.com/category_image_2.jpg",
    "Products":[
        {
            "productID":3,
            "productName": "Dress Pants",
            "productDescription":"A classic dress pant.",
            "price":49.99,
            "color":"black",
            "availableStock":{
                "M":15,
                "L":10,
                "XL":5
            },
            "imageName":"image_3.jpg",
            "imageURL":"https://example.com/image_3.jpg"
        },
        {
            "productID":4,
            "productName": "Dress Pants",
            "productDescription":"A classic dress pant.",
            "price":49.99,
            "color":"blue",
            "availableStock":{
                "M":15,
                "L":10,
                "XL":5
            },
            "imageName":"image_4.jpg",
            "imageURL":"https://example.com/image_4.jpg"
        }

    ]
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
        await addProduct(testProduct3);
        console.log('Test data inserted successfully!');
    } catch (error) {
        console.error('Error inserting test data:', error);
    }
})();