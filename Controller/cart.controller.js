import cartModel from "../Model/cart.model";
import eventModel from "../Model/event.model";
import userModel from "../Model/user.model";

export const getCartItems = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const cartItems = await cartModel.find({ userId: userID });
    if (cartItems) {
      res.status(200).json({
        data: cartItems,
        message: "Success",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const addCartData = async (req, res) => {
//   try {
//     const { userID, eventId } = req.body;

    
//     const eventData = await eventModel.find({ _id: eventId });
//     console.log(eventData);

//     const cartData = new cartModel({
//       userId: userID,
//       eventId: eventId,
//       name: eventData.tittle,
//       price: eventData.price,
//       quantity: 1,
//     });

//     cartData.save();

//     res.status(200).json({
//       data: cartData,
//       message: "Successfully added to cart!",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


export const addToCart = async (req, res) => {
  try {
    const { userID, eventId } = req.body;

    const cartItem = await cartModel.findOne({
      userId: userID,
      eventId: eventId,
    });
    if (cartItem) {
      if (cartItem === 5) {
        return res.status(400).json({
          message: "Only 10 tickets will be allowed.",
        });
      }

      const updateEvent = await cartModel.updateOne(
        { _id: cartModel._id },
        {
          $set: {
            quantity: cartItem.quantity + 1,
          },
        }
      );
      if (updateEvent.acknowledged) {
        res.status(200).json({
          message: "updated Event",
        });
      }
    } else {
      const eventData = await eventModel.findOne({ _id: eventId });
      // console.log(eventData);
      const cartData = new cartModel({
        userId: userID,
        eventId: eventId,
        tittle: eventData.tittle,
        price: eventData.price,
        location : eventData.location,
        startDate : eventData.startDate,
        endDate : eventData.endDate,
        time : eventData.time,
        quantity: 1,
      });
      cartData.save();
      if (cartData) {
        res.status(201).json({
          data: cartData,
          message: "Successfully added to cart!",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// export const addToCart = async (req, res) => {
//   try {
//     const { userID, eventId } = req.body;

//     // Check if the user has already added this event to the cart
//     const cartItem = await cartModel.findOne({ userId: userID, eventId: eventId });

//     const eventData = await eventModel.findById(eventId);
//     if (eventData) {
//       const cartData = new cartModel({
//         userId: userID,
//         eventId: eventId,
//         name: eventData.name,
//         price: eventData.price,
//         quantity: 1,
//       });
//       const savedCartData = await cartData.save();
//       if (savedCartData) {
//         res.status(201).json({
//           data: savedCartData,
//           message: "Successfully added to the cart!",
//         });
//       } else {
//         res.status(500).json({
//           message: "Failed to add the item to the cart.",
//         });
//       }

//     // if (cartItem) {
//     //   if (cartItem.quantity >= 10) { // Check the quantity, not if cartItem === 5
//     //     return res.status(200).json({
//     //       message: "Only 10 tickets will be allowed.",
//     //     });
//     //   }

//     //   // If the cart item exists, update the quantity
//     //   const updatedCart = await cartModel.findByIdAndUpdate(cartItem._id, {
//     //     $inc: { quantity: 1 }, // Increment the quantity
//     //   });

//     //   if (updatedCart) {
//     //     res.status(200).json({
//     //       message: "Updated event quantity in the cart.",
//     //     });
//     //   } else {
//     //     res.status(500).json({
//     //       message: "Failed to update event quantity in the cart.",
//     //     });
//     //   }
//     // } else {
//     //   // If the cart item doesn't exist, add it to the cart
//     //   const eventData = await eventModel.findById(eventId);

//     //   if (eventData) {
//     //     const cartData = new cartModel({
//     //       userId: userID,
//     //       eventId: eventId,
//     //       name: eventData.name,
//     //       price: eventData.price,
//     //       quantity: 1,
//     //     });

//     //     const savedCartData = await cartData.save();

//     //     if (savedCartData) {
//     //       res.status(201).json({
//     //         data: savedCartData,
//     //         message: "Successfully added to the cart!",
//     //       });
//     //     } else {
//     //       res.status(500).json({
//     //         message: "Failed to add the item to the cart.",
//     //       });
//     //     }
//     //   } else {
//     //     res.status(404).json({
//     //       message: "Event not found.", // Handle the case where the event doesn't exist
//     //     });
//     //   }
//     // }
//   }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


export const updateQuantity = async (req, res) => {
  try {
    const cartID = req.params.cart_id;
    const { type } = req.query; //inc and desc
    const cartItem = await cartModel.findOne({ _id: cartID });

    if (cartItem.quantity >= 10 && type === "inc") {
      return res.status(400).json({
        message: "Only 10 tickets will be allowed.",
      });
    }
    if (cartItem.quantity <= 1 && type === "desc") {
      const deletedItem = await cartModel.deleteOne({ _id: cartID });
      if (deletedItem.acknowledged) {
        return res.status(200).json({
          message: "Deleted",
        });
      }
    }
    let quantity = cartItem.quantity;
    if (type === "inc") quantity += 1;
    if (type === "desc") quantity -= 1;

    const updatedItem = await cartModel.updateOne(
      { _id: cartID },
      {
        $set: {
          quantity: quantity,
        },
      }
    );

    if (updatedItem.acknowledged) {
      return res.status(200).json({
        message: "Quantity Updated.",
      });
    }

    return res.status(500).json({
      message: "Something went wrong.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const cartID = req.params.cart_id;
    const deletedItem = await cartModel.deleteOne({ _id: cartID });
    if (deletedItem.acknowledged) {
      return res.status(200).json({
        message: "Deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
