// export default function useRestaurant(id) {
//   const { data, refetch, networkStatus, loading, error } = useQuery(
//     RESTAURANT,
//     { variables: { id }, fetchPolicy: 'network-only' }
//   )
//   return { data, refetch, networkStatus, loading, error }
// }

import { useState, useEffect } from 'react';
import { fetchRestaurantDetails } from '../../firebase/restaurants';


export default function useRestaurant(id) {
  // Dummy data to replace backend connections

  // const dummyRestaurantsData = [
  //   {
  //     restaurant: {
  //       id: '1',
  //       name: 'Gourmet Paradise',
  //       image: 'https://images.unsplash.com/photo-1555992336-03a23c0c51e0',
  //       categories: [
  //         {
  //           title: 'Appetizers',
  //           foods: [
  //             {
  //               id: '1',
  //               title: 'Spring Rolls',
  //               description: 'Crispy spring rolls stuffed with vegetables',
  //               variations: [{ id: '1', price: 5.99, discounted: 1.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1606312617930-802551a23083'
  //             },
  //             {
  //               id: '2',
  //               title: 'Garlic Bread',
  //               description: 'Toasted garlic bread with a side of marinara sauce',
  //               variations: [{ id: '2', price: 3.99, discounted: 0.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90'
  //             }
  //           ]
  //         },
  //         {
  //           title: 'Main Course',
  //           foods: [
  //             {
  //               id: '3',
  //               title: 'Grilled Salmon',
  //               description: 'Fresh salmon fillet grilled to perfection',
  //               variations: [{ id: '3', price: 15.99, discounted: 2.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1559847844-5315695d1a1a'
  //             },
  //             {
  //               id: '4',
  //               title: 'Steak Frites',
  //               description: 'Juicy steak served with crispy fries',
  //               variations: [{ id: '4', price: 19.99, discounted: 0.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1604147706284-27c2cd2b0466'
  //             }
  //           ]
  //         },
  //         {
  //           title: 'Desserts',
  //           foods: [
  //             {
  //               id: '5',
  //               title: 'Cheesecake',
  //               description: 'Creamy cheesecake with a graham cracker crust',
  //               variations: [{ id: '5', price: 6.99, discounted: 0.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
  //             },
  //             {
  //               id: '6',
  //               title: 'Chocolate Lava Cake',
  //               description: 'Warm chocolate cake with a gooey center',
  //               variations: [{ id: '6', price: 7.99, discounted: 1.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1599785209707-0c8bbeddcefb'
  //             }
  //           ]
  //         }
  //       ],
  //       addons: [
  //         { id: '1', title: 'Extra Cheese', price: 1.0 },
  //         { id: '2', title: 'Bacon', price: 2.0 }
  //       ],
  //       options: [
  //         { id: '1', title: 'Spicy', price: 0.5 },
  //         { id: '2', title: 'Gluten-Free', price: 1.0 }
  //       ],
  //       reviewData: {
  //         ratings: 4.7,
  //         reviews: [
  //           { id: 1, text: 'Amazing food and great service!', rating: 5 },
  //           { id: 2, text: 'Really enjoyed the steak.', rating: 4 }
  //         ],
  //         total: 234
  //       },
  //       deliveryTime: 20,
  //       minimumOrder: 15,
  //       isAvailable: true,
  //       openingTimes: [
  //         { day: 'SUN', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'MON', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'TUE', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'WED', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'THU', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'FRI', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'SAT', times: [{ startTime: [0, 0], endTime: [23, 59] }] }
  //       ],
  //       location: {
  //         coordinates: [-74.006, 40.7128]  // New York City coordinates
  //       },
  //       address: '123 Main St, New York, NY 10001, USA'
  //     }
  //   },
  //   {
  //     restaurant: {
  //       id: '2',
  //       name: 'Urban Eatery',
  //       image: 'https://images.unsplash.com/photo-1533777324565-a040eb52fac1',
  //       categories: [
  //         {
  //           title: 'Starters',
  //           foods: [
  //             {
  //               id: '7',
  //               title: 'Bruschetta',
  //               description: 'Grilled bread with tomato and basil',
  //               variations: [{ id: '7', price: 6.99, discounted: 0.5, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1578926285284-e26c9c1c6839'
  //             },
  //             {
  //               id: '8',
  //               title: 'Stuffed Mushrooms',
  //               description: 'Mushrooms stuffed with cheese and herbs',
  //               variations: [{ id: '8', price: 8.99, discounted: 1.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1543333164-0d6f0fc0b37c'
  //             }
  //           ]
  //         },
  //         {
  //           title: 'Entrees',
  //           foods: [
  //             {
  //               id: '9',
  //               title: 'Margherita Pizza',
  //               description: 'Classic pizza with tomato, mozzarella, and basil',
  //               variations: [{ id: '9', price: 12.99, discounted: 1.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1564936281719-97d3afc5aa80'
  //             },
  //             {
  //               id: '10',
  //               title: 'Pasta Carbonara',
  //               description: 'Pasta with creamy sauce, bacon, and parmesan',
  //               variations: [{ id: '10', price: 14.99, discounted: 0.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1583875762483-1b36e09a8c9b'
  //             }
  //           ]
  //         },
  //         {
  //           title: 'Desserts',
  //           foods: [
  //             {
  //               id: '11',
  //               title: 'Tiramisu',
  //               description: 'Classic Italian dessert with coffee and mascarpone',
  //               variations: [{ id: '11', price: 7.99, discounted: 0.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1572552639915-4358b4a0f9a1'
  //             },
  //             {
  //               id: '12',
  //               title: 'Gelato',
  //               description: 'Creamy Italian ice cream in various flavors',
  //               variations: [{ id: '12', price: 5.99, discounted: 0.5, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1570491651365-5990a7e8c26e'
  //             }
  //           ]
  //         }
  //       ],
  //       addons: [
  //         { id: '3', title: 'Extra Toppings', price: 1.5 },
  //         { id: '4', title: 'Sauce', price: 0.75 }
  //       ],
  //       options: [
  //         { id: '3', title: 'Vegetarian', price: 0.0 },
  //         { id: '4', title: 'Vegan', price: 0.0 }
  //       ],
  //       reviewData: {
  //         ratings: 4.6,
  //         reviews: [
  //           { id: 3, text: 'Best pizza in town!', rating: 5 },
  //           { id: 4, text: 'Loved the pasta.', rating: 4 }
  //         ],
  //         total: 189
  //       },
  //       deliveryTime: 25,
  //       minimumOrder: 20,
  //       isAvailable: true,
  //       openingTimes: [
  //         { day: 'SUN', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'MON', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'TUE', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'WED', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'THU', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'FRI', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'SAT', times: [{ startTime: [0, 0], endTime: [23, 59] }] }
  //       ],
  //       location: {
  //         coordinates: [-118.2437, 34.0522]  // Los Angeles coordinates
  //       },
  //       address: '456 Elm St, Los Angeles, CA 90001, USA'
  //     }
  //   },
  //   {
  //     restaurant: {
  //       id: '3',
  //       name: 'Seaside Diner',
  //       image: 'https://images.unsplash.com/photo-1533777324565-a040eb52fac1',
  //       categories: [
  //         {
  //           title: 'Breakfast',
  //           foods: [
  //             {
  //               id: '13',
  //               title: 'Pancakes',
  //               description: 'Fluffy pancakes with syrup and butter',
  //               variations: [{ id: '13', price: 8.99, discounted: 0.5, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1572441711130-5620b2b1aebf'
  //             },
  //             {
  //               id: '14',
  //               title: 'Omelette',
  //               description: 'Three-egg omelette with your choice of fillings',
  //               variations: [{ id: '14', price: 7.99, discounted: 1.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1510751007277-36932aac9ebd'
  //             }
  //           ]
  //         },
  //         {
  //           title: 'Lunch',
  //           foods: [
  //             {
  //               id: '15',
  //               title: 'BLT Sandwich',
  //               description: 'Bacon, lettuce, and tomato sandwich',
  //               variations: [{ id: '15', price: 9.99, discounted: 0.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1568051243853-e3b67b7f8fc1'
  //             },
  //             {
  //               id: '16',
  //               title: 'Caesar Salad',
  //               description: 'Crisp romaine lettuce with Caesar dressing',
  //               variations: [{ id: '16', price: 10.99, discounted: 1.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1566843976510-98670f03c9f1'
  //             }
  //           ]
  //         },
  //         {
  //           title: 'Dinner',
  //           foods: [
  //             {
  //               id: '17',
  //               title: 'Fish and Chips',
  //               description: 'Battered fish with crispy fries',
  //               variations: [{ id: '17', price: 14.99, discounted: 2.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1598133894008-46c6f8d2942b'
  //             },
  //             {
  //               id: '18',
  //               title: 'Chicken Alfredo',
  //               description: 'Pasta with creamy Alfredo sauce and chicken',
  //               variations: [{ id: '18', price: 13.99, discounted: 1.0, addons: [] }],
  //               image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445'
  //             }
  //           ]
  //         }
  //       ],
  //       addons: [
  //         { id: '5', title: 'Extra Sauce', price: 0.5 },
  //         { id: '6', title: 'Side Salad', price: 2.5 }
  //       ],
  //       options: [
  //         { id: '5', title: 'Low Carb', price: 1.0 },
  //         { id: '6', title: 'Gluten-Free', price: 1.5 }
  //       ],
  //       reviewData: {
  //         ratings: 4.8,
  //         reviews: [
  //           { id: 5, text: 'Great breakfast options!', rating: 5 },
  //           { id: 6, text: 'Loved the fish and chips.', rating: 4 }
  //         ],
  //         total: 321
  //       },
  //       deliveryTime: 30,
  //       minimumOrder: 10,
  //       isAvailable: true,
  //       openingTimes: [
  //         { day: 'SUN', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'MON', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'TUE', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'WED', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'THU', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'FRI', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //         { day: 'SAT', times: [{ startTime: [0, 0], endTime: [23, 59] }] }
  //       ],
  //       location: {
  //         coordinates: [-122.4194, 37.7749]  // San Francisco coordinates
  //       },
  //       address: '789 Ocean Ave, San Francisco, CA 94112, USA'
  //     }
  //   }
  // ];

  const [ restaurant, setRestaurant ] = useState(null);

  useEffect(() => {
    const getRestaurantDetails = async () => {
      try {
        const restaurantsList = await fetchRestaurantDetails(id);
        setRestaurant(restaurantsList);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    getRestaurantDetails();
  }, []);

  // const restaurant = dummyRestaurantsData.find(r => r.restaurant.id === id);
  const data = { 'restaurant': restaurant }
  // const data = restaurant || dummyRestaurantsData[0];
  const refetch = () => {};
  const networkStatus = 7;
  const loading = false;
  const error = null;

  return { data, refetch, networkStatus, loading, error };
}
