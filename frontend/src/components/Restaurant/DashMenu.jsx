import React, { useEffect, useState } from 'react'

const DashMenu = ({ email }) => {
    const [menuDetails, setMenuDetails] = useState([]);
    const [dishName, setDishName] = useState("");
    const [price, setPrice] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);


    useEffect(() => {
        fetchMenuDetails(email);
    }, [])

    const fetchMenuDetails = async (email) => {
        try {
            const response = await fetch(`http://localhost:5000/api/restaurants/getMenu?email=${email}`);
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Correctly parse the JSON response
            console.log('Response:', data); // Log the parsed JSON data

            setMenuDetails(data);
        } catch (error) {
            console.error('Error fetching menu details:', error);
        }
    };


    const addOrEditDish = async (e) => {
        e.preventDefault();

        try {
            const response = editMode
                ? await fetch('http://localhost:5000/api/restaurants/editMenu', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: editId, dishName, price }),
                })
                : await fetch('http://localhost:5000/api/restaurants/addMenu', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, dishName, price }),
                });

            const data = await response.json();
            if (response.ok) {
                alert(editMode ? 'Dish Updated Successfully!' : 'Dish Added Successfully!');
                fetchMenuDetails(email);
                setDishName("");
                setPrice("");
                setEditMode(false);
                setEditId(null);
            } else {
                alert('Error while saving dish!');
                console.error('Error saving dish:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteDish = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/restaurants/deleteMenu/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchMenuDetails(email);
            } else {
                const data = await response.json();
                alert('Error while deleting dish!');
                console.error('Error deleting dish:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = (item) => {
        setDishName(item.dishName);
        setPrice(item.price);
        setEditMode(true);
        setEditId(item._id); // Assuming `id` or `_id` is used as the identifier in your database
    };



    return (
        <section className="menu-section">
            <h3>Menu Details</h3>
            <form onSubmit={addOrEditDish}>
                <input
                    type="text"
                    placeholder="Dish Name"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <button type="submit">{editMode ? 'Update Dish' : 'Add Dish'}</button>
            </form>
            <div className="menu-list">
                {menuDetails.length > 0 ? (
                    menuDetails.map((item, index) => (
                        <div className="menu-item" key={index}>
                            <div className="menuDish">
                                <p className='dish_name'>{item.dishName}</p>
                                <p className='dish_price'>Rs.{item.price}</p>
                            </div>

                            <div className="menuBtn">
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => deleteDish(item._id)}>Delete</button>
                            </div>


                        </div>
                    ))
                ) : (
                    <p>No menu items available.</p>
                )}
            </div>
        </section>
    );
};

export default DashMenu;