# Zomato Clone  

A Zomato clone web application developed using React.js, CSS, Node.js, Express.js, and MongoDB. This project includes separate functionalities for customers to browse restaurants and place orders, as well as for restaurant owners to manage their profiles and orders.  

---

## Features  

### **Customer Web App**  
1. **User Registration/Login**: Secure authentication for customers.  
2. **Browse Restaurants by Location**: Search and filter restaurants based on location.  
3. **Select Restaurant**: View restaurant details, including menus and reviews.  
4. **Select Menu Items**: Explore and choose dishes from restaurant menus.  
5. **Add Items to Cart**: Manage cart items with quantity adjustments.  
6. **Checkout Cart**: Complete orders and view summary details.  
7. **Order Tracking**: Track order status with simulated updates.  

### **Restaurant Management Web App**  
1. **Restaurant Registration/Login**: Secure authentication for restaurant owners.  
2. **Create Restaurant Profile**: Add restaurant details, including name, location, and description.  
3. **Manage Menus**: Create, update, and delete menu items with descriptions and prices.  
4. **Set Pricing**: Define and modify prices for menu items.  
5. **Order Management**: View incoming order details.  
6. **Order Status Updates**: Process and update the status of customer orders.  

---

## Tech Stack  

- **Frontend**: React.js, CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  

---

## Installation  

1. **Clone the repository**:  
   ```bash  
   git clone https://github.com/riyaraghuwanshi31/zomato_clone.git  
   cd zomato_clone  
   ```  

2. **Install dependencies**:  
   - For the backend:  
     ```bash  
     cd backend  
     npm install  
     ```  
   - For the frontend:  
     ```bash  
     cd ../frontend  
     npm install  
     ```  

3. **Setup Environment Variables**:  
   Create a `.env` file in the `backend` directory with the following keys:  
   ```  
   PORT=5000  
   MONGO_URI=<your-mongodb-connection-string>  
   JWT_SECRET=<your-jwt-secret>  
   ```  

4. **Run the application**:  
   - Backend:  
     ```bash  
     cd backend  
     node server.js  
     ```  
   - Frontend:  
     ```bash  
     cd ../frontend  
     npm run dev  
     ```  

---

## Screenshots  

Add screenshots of:  
- **Customer Web App**: Main page, menu selection, cart, and order tracking.  
- **Restaurant Management Web App**: Profile creation, DashBoard, and Menu handling.  

---  

![Main page](https://github.com/user-attachments/assets/97a9af4e-6f70-485e-b199-78247134fe3d)

![cust Main page](https://github.com/user-attachments/assets/fb5a8bae-5c97-473b-a867-90a70321d5d8)

![cust Main page 2](https://github.com/user-attachments/assets/66e3dc01-125e-4577-905e-5c4157c80274)

![Menu page](https://github.com/user-attachments/assets/23dfd327-b1b4-450a-9efb-e94bb4ba8522)

![Cart page](https://github.com/user-attachments/assets/c82f46d9-4694-4ebb-ba19-250a4b381153)

![order placing](https://github.com/user-attachments/assets/2ef9ea8b-ec81-455c-8f4c-5a4be2279e67)

![restroMain](https://github.com/user-attachments/assets/d0c23a8d-a602-4ebd-aa0c-0511177d8b32)

![restro registration](https://github.com/user-attachments/assets/e0a4b302-67e5-4f21-9057-efd5aee4c25c)

![restro Dashboard](https://github.com/user-attachments/assets/b0553420-8652-474b-8c82-559667dc4c45)










