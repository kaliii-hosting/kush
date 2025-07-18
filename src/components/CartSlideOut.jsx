import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, FileText, Download } from 'lucide-react';
import { useCart } from '../context/ShopifyCartContext';
import { useWholesaleCart } from '../context/WholesaleCartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import ShopifyCheckoutButton from './ShopifyCheckoutButton';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { ref, push, serverTimestamp } from 'firebase/database';
import { realtimeDb } from '../config/firebase';

const CartSlideOut = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const { user, userData } = useAuth();
  
  // Determine which cart to use based on current page
  const isWholesalePage = location.pathname.includes('/wholesale');
  
  // Get cart context based on page
  const shopifyCart = useCart();
  const wholesaleCart = useWholesaleCart();
  
  // Use appropriate cart
  const currentCart = isWholesalePage ? wholesaleCart : shopifyCart;
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = currentCart;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Generate PDF invoice for wholesale checkout
  const generatePDFInvoice = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Add PNG logo
    try {
      const logoUrl = 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Kushie%20Invoice%20logo.png';
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        logoImg.onload = () => {
          try {
            // Add logo image - adjust size and position as needed
            doc.addImage(logoImg, 'PNG', 20, 10, 60, 20);
            resolve();
          } catch (err) {
            console.error('Error adding logo to PDF:', err);
            // Fallback to text logo
            doc.setFontSize(28);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(203, 96, 21);
            doc.text('KUSHIE', 20, 20);
            doc.setTextColor(0, 0, 0);
            resolve();
          }
        };
        logoImg.onerror = () => {
          console.error('Error loading logo image');
          // Fallback to text logo
          doc.setFontSize(28);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(203, 96, 21);
          doc.text('KUSHIE', 20, 20);
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text('Premium Cannabis Products', 20, 26);
          resolve();
        };
        logoImg.src = logoUrl;
      });
    } catch (error) {
      console.error('Error in logo setup:', error);
      // Fallback to text logo
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(203, 96, 21);
      doc.text('KUSHIE', 20, 20);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Premium Cannabis Products', 20, 26);
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Wholesale Invoice', 20, 35);
    
    // Invoice details
    doc.setFontSize(10);
    const today = new Date();
    doc.text(`Date: ${today.toLocaleDateString()}`, 20, 45);
    doc.text(`Invoice #: ${today.getTime()}`, 20, 50);
    
    // Customer info - use signed in user data
    doc.text('Bill To:', 20, 60);
    if (user && userData) {
      doc.setFont('helvetica', 'bold');
      doc.text(userData.displayName || userData.email || 'Customer', 20, 65);
      doc.setFont('helvetica', 'normal');
      doc.text(userData.email || '', 20, 70);
      if (userData.phone) {
        doc.text(`Phone: ${userData.phone}`, 20, 75);
      }
    } else {
      doc.text('Guest Customer', 20, 65);
    }
    
    // Table with product images - prepare data first
    const tableColumns = ['', 'Product', 'Quantity', 'Unit Price', 'Total'];
    const tableRows = [];
    const productImages = [];
    
    // Process cart items
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const unitPrice = parseFloat(item.price);
      const total = unitPrice * item.quantity;
      
      // Store image data separately to avoid duplication
      let imageData = null;
      if (item.imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve) => {
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = 60;
              canvas.height = 60;
              ctx.drawImage(img, 0, 0, 60, 60);
              imageData = canvas.toDataURL('image/jpeg', 0.7);
              resolve();
            };
            img.onerror = resolve;
            img.src = item.imageUrl;
          });
        } catch (error) {
          console.error('Error loading product image:', error);
        }
      }
      
      // Store image data by row index
      if (imageData) {
        productImages[i] = imageData;
      }
      
      // Add row without image data in the cell
      tableRows.push([
        '', // Empty string for image column
        item.title || item.name,
        item.quantity.toString(),
        `$${unitPrice.toFixed(2)}`,
        `$${total.toFixed(2)}`
      ]);
    }
    
    // Generate table
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 85,
      theme: 'grid',
      headStyles: { 
        fillColor: [203, 96, 21],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Image column
        1: { cellWidth: 80 }, // Product name
        2: { cellWidth: 25, halign: 'center' }, // Quantity
        3: { cellWidth: 30, halign: 'right' }, // Unit price
        4: { cellWidth: 30, halign: 'right' } // Total
      },
      bodyStyles: {
        minCellHeight: 20
      },
      didDrawCell: function(data) {
        // Only draw images once per row in the image column
        if (data.column.index === 0 && data.cell.section === 'body' && data.row.index >= 0) {
          const rowIndex = data.row.index;
          const imageData = productImages[rowIndex];
          
          if (imageData) {
            const dim = 15;
            const x = data.cell.x + 2.5;
            const y = data.cell.y + 2.5;
            
            try {
              doc.addImage(imageData, 'JPEG', x, y, dim, dim);
            } catch (err) {
              console.error('Error adding image to PDF:', err);
            }
          }
        }
      }
    });
    
    // Total section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 130, finalY);
    doc.text(`$${cartTotal}`, 170, finalY, { align: 'right' });
    
    doc.text('Tax:', 130, finalY + 7);
    doc.text('$0.00', 170, finalY + 7, { align: 'right' });
    
    doc.setFontSize(12);
    doc.text('Total:', 130, finalY + 14);
    doc.text(`$${cartTotal}`, 170, finalY + 14, { align: 'right' });
    
    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    
    // Save invoice data to Firebase
    const invoiceNumber = today.getTime();
    const invoiceData = {
      invoiceNumber: invoiceNumber.toString(),
      date: today.toISOString(),
      customer: {
        name: userData?.displayName || userData?.email || 'Guest Customer',
        email: userData?.email || '',
        phone: userData?.phone || '',
        userId: user?.uid || null
      },
      items: cart.map(item => ({
        id: item.id,
        name: item.title || item.name,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price),
        total: parseFloat(item.price) * item.quantity,
        imageUrl: item.imageUrl || ''
      })),
      subtotal: parseFloat(cartTotal),
      tax: 0,
      total: parseFloat(cartTotal),
      status: 'generated',
      createdAt: serverTimestamp()
    };

    // Save to Firebase
    try {
      const invoicesRef = ref(realtimeDb, 'wholesale_invoices');
      await push(invoicesRef, invoiceData);
      console.log('Invoice saved to Firebase');
    } catch (error) {
      console.error('Error saving invoice to Firebase:', error);
    }

    // Save the PDF
    doc.save(`kushie-wholesale-invoice-${invoiceNumber}.pdf`);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Cart Slide-out */}
      <div 
        className={`fixed right-0 top-0 h-[calc(100vh-3rem)] sm:h-[calc(100vh-5rem)] w-full sm:w-96 bg-black border-l border-border z-[60] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">
                {isWholesalePage ? 'Wholesale Cart' : 'Your Cart'}
              </h2>
              {cartCount > 0 && (
                <span className="bg-primary text-white text-sm font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-dark rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6">
                <ShoppingCart className="h-16 w-16 text-gray mb-4" />
                <p className="text-white text-lg font-bold mb-2">Your cart is empty</p>
                <p className="text-text-secondary text-sm text-center mb-6">
                  Add some products to get started
                </p>
                <Link
                  to={isWholesalePage ? "/wholesale" : "/shop"}
                  onClick={onClose}
                  className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-hover transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.lineItemId || item.id} className="bg-card rounded-lg p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-dark rounded-md overflow-hidden flex-shrink-0">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title || item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">
                          {item.title || item.name}
                        </h3>
                        {item.variantTitle && item.variantTitle !== 'Default Title' && (
                          <p className="text-text-secondary text-xs mb-1">{item.variantTitle}</p>
                        )}
                        <p className="text-primary font-bold mb-2">${item.price}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (isWholesalePage) {
                                updateQuantity(item.id, item.quantity - 1);
                              } else {
                                // For shop page (Shopify products), use the id as lineItemId
                                updateQuantity(
                                  item.productId || item.id, 
                                  item.quantity - 1, 
                                  true, // isShopifyProduct
                                  item.id // lineItemId
                                );
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-gray-dark hover:bg-gray flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-4 w-4 text-white" />
                          </button>
                          <span className="text-white font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (isWholesalePage) {
                                updateQuantity(item.id, item.quantity + 1);
                              } else {
                                // For shop page (Shopify products), use the id as lineItemId
                                updateQuantity(
                                  item.productId || item.id, 
                                  item.quantity + 1, 
                                  true, // isShopifyProduct
                                  item.id // lineItemId
                                );
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-gray-dark hover:bg-gray flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-4 w-4 text-white" />
                          </button>
                          <button
                            onClick={() => {
                              if (isWholesalePage) {
                                removeFromCart(item.id);
                              } else {
                                // For shop page (Shopify products), use the id as lineItemId
                                removeFromCart(
                                  item.productId || item.id, 
                                  true, // isShopifyProduct
                                  item.id // lineItemId
                                );
                              }
                            }}
                            className="ml-auto text-text-secondary hover:text-white text-sm transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Total and Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white text-lg font-bold">Total</span>
                <span className="text-primary text-2xl font-black">${cartTotal}</span>
              </div>
              
              <div className="space-y-3">
                {isWholesalePage ? (
                  <>
                    <button
                      onClick={generatePDFInvoice}
                      className="w-full bg-primary text-white font-bold py-4 rounded-full hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="h-5 w-5" />
                      Export Invoice (PDF)
                    </button>
                    <Link
                      to="/wholesale"
                      onClick={onClose}
                      className="block w-full text-center text-white font-bold py-4 rounded-full border-2 border-white hover:bg-white/10 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </>
                ) : (
                  <>
                    <ShopifyCheckoutButton 
                      fullWidth
                      text="Proceed to Checkout"
                      className="text-lg"
                    />
                    <Link
                      to="/shop"
                      onClick={onClose}
                      className="block w-full text-center text-white font-bold py-4 rounded-full border-2 border-white hover:bg-white/10 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSlideOut;