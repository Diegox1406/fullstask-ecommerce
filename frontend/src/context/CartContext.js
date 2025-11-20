import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const getInitialCart = () => {
    try {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Error al cargar el carrito de localStorage:", error);
        return [];
    }
};

const saveCartToLocalStorage = (items) => {
    const cleanedItems = items.filter(item => (item.quantity || 0) > 0);
    localStorage.setItem('cart', JSON.stringify(cleanedItems));
    return cleanedItems;
};

// Hook personalizado para usar el contexto
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Inicializa el estado del carrito leyendo desde localStorage
    const [cartItems, setCartItems] = useState(getInitialCart);

    // 🛑 Sincronización: Este useEffect guarda el estado en localStorage CADA VEZ que el estado de React cambia
    useEffect(() => {
        saveCartToLocalStorage(cartItems);
    }, [cartItems]);

    const addItem = (itemToAdd) => {
        setCartItems(prevItems => {
            const existingIndex = prevItems.findIndex(
                // Identificamos por _id y si es promoción o producto
                item => item._id === itemToAdd._id && !!item.isPromotion === !!itemToAdd.isPromotion
            );

            let newItems;
            if (existingIndex > -1) {
                // Si existe, incrementa la cantidad
                newItems = [...prevItems];
                newItems[existingIndex].quantity = (newItems[existingIndex].quantity || 1) + 1;
            } else {
                // Si no existe, lo agrega (asegurando quantity = 1)
                newItems = [...prevItems, { ...itemToAdd, quantity: 1 }];
            }
            return newItems;
        });
    };

    const updateQuantity = (_id, change, isPromotion) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item._id === _id && !!item.isPromotion === !!isPromotion) {
                    const newQty = Math.max(1, (item.quantity || 1) + change);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
            return updatedItems;
        });
    };
    
    const removeItem = (_id, isPromotion) => {
        setCartItems(prevItems => {
            // Filtra y elimina el ítem que coincide con el ID y el tipo
            const updatedItems = prevItems.filter(item => !(item._id === _id && !!item.isPromotion === !!isPromotion));
            return updatedItems;
        });
    };
    
    // 🛑 FUNCIÓN DE LIMPIEZA
    const clearCart = () => {
        setCartItems([]); // Establece el estado de React a un array vacío
        // localStorage se actualizará automáticamente gracias al useEffect
    };

    const value = {
        cartItems,
        addItem,
        updateQuantity,
        removeItem,
        clearCart, // 🛑 CORREGIDO: clearCart ahora está disponible
        cartCount: cartItems.length,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};