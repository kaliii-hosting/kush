import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import { FileText, Search, Calendar, User, Package, Eye, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

const WholesaleManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch wholesale invoices from Firebase
  useEffect(() => {
    const fetchInvoices = () => {
      try {
        const invoicesRef = ref(realtimeDb, 'wholesale_invoices');
        const unsubscribe = onValue(invoicesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const invoicesArray = Object.entries(data).map(([id, invoice]) => ({
              id,
              ...invoice
            }));
            // Sort by date, newest first
            invoicesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
            setInvoices(invoicesArray);
          } else {
            setInvoices([]);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching wholesale invoices:', error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate PDF for invoice preview/download - matching cart export design
  const generateInvoicePDF = async (invoice) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Add PNG logo
    try {
      const logoUrl = 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Kushie%20Invoice%20logo.png';
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve) => {
        logoImg.onload = () => {
          try {
            // Add logo image
            doc.addImage(logoImg, 'PNG', 20, 10, 60, 20);
          } catch (err) {
            console.error('Error adding logo to PDF:', err);
            // Fallback to text logo
            doc.setFontSize(28);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(203, 96, 21);
            doc.text('KUSHIE', 20, 20);
            doc.setTextColor(0, 0, 0);
          }
          resolve();
        };
        logoImg.onerror = () => {
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
    const invoiceDate = new Date(invoice.date);
    doc.text(`Date: ${invoiceDate.toLocaleDateString()}`, 20, 45);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 50);
    
    // Customer info
    doc.text('Bill To:', 20, 60);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.customer.name, 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customer.email, 20, 70);
    if (invoice.customer.phone) {
      doc.text(`Phone: ${invoice.customer.phone}`, 20, 75);
    }
    
    // Table with product images - prepare data first
    const tableColumns = ['', 'Product', 'Quantity', 'Unit Price', 'Total'];
    const tableRows = [];
    const productImages = [];
    
    // Process invoice items with images
    for (let i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      
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
        item.name,
        item.quantity.toString(),
        `$${item.unitPrice.toFixed(2)}`,
        `$${item.total.toFixed(2)}`
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
    doc.text(`$${invoice.subtotal.toFixed(2)}`, 170, finalY, { align: 'right' });
    
    doc.text('Tax:', 130, finalY + 7);
    doc.text(`$${invoice.tax.toFixed(2)}`, 170, finalY + 7, { align: 'right' });
    
    doc.setFontSize(12);
    doc.text('Total:', 130, finalY + 14);
    doc.text(`$${invoice.total.toFixed(2)}`, 170, finalY + 14, { align: 'right' });
    
    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save(`kushie-wholesale-invoice-${invoice.invoiceNumber}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-white">Wholesale Invoices</h2>
            <p className="text-gray-400">View and manage wholesale invoices</p>
          </div>
        </div>
        <div className="bg-card px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-400">Total Invoices</p>
          <p className="text-2xl font-bold text-white">{invoices.length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-card p-4 rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice number, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-dark border border-border rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-dark border border-border rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="generated">Generated</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-dark/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-white">
                      #{invoice.invoiceNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="h-4 w-4" />
                      {formatDate(invoice.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {invoice.customer.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {invoice.customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Package className="h-4 w-4" />
                      {invoice.items.length} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-primary">
                      ${invoice.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      invoice.status === 'paid' 
                        ? 'bg-green-500/20 text-green-400'
                        : invoice.status === 'sent'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowPreview(true);
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-dark rounded-lg transition-colors"
                        title="Preview Invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => generateInvoicePDF(invoice)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-dark rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No invoices found</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {showPreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Invoice Preview</h3>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setSelectedInvoice(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Invoice Header */}
              <div className="flex justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-primary">KUSHIE</h4>
                  <p className="text-sm text-gray-400">Cannabis Products</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Invoice Number</p>
                  <p className="text-lg font-mono text-white">#{selectedInvoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(selectedInvoice.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-dark p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-400 mb-2">Bill To:</h5>
                <p className="text-white font-medium">{selectedInvoice.customer.name}</p>
                <p className="text-sm text-gray-300">{selectedInvoice.customer.email}</p>
                {selectedInvoice.customer.phone && (
                  <p className="text-sm text-gray-300">{selectedInvoice.customer.phone}</p>
                )}
              </div>

              {/* Items Table with Images */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-sm text-gray-400">Image</th>
                      <th className="text-left py-2 text-sm text-gray-400">Product</th>
                      <th className="text-center py-2 text-sm text-gray-400">Qty</th>
                      <th className="text-right py-2 text-sm text-gray-400">Price</th>
                      <th className="text-right py-2 text-sm text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-dark rounded flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-white">{item.name}</td>
                        <td className="py-3 text-center text-white">{item.quantity}</td>
                        <td className="py-3 text-right text-white">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-3 text-right text-white">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="py-2 text-right text-gray-400">Subtotal:</td>
                      <td className="py-2 text-right text-white">${selectedInvoice.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="py-2 text-right text-gray-400">Tax:</td>
                      <td className="py-2 text-right text-white">${selectedInvoice.tax.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td colSpan="4" className="py-3 text-right font-bold text-white">Total:</td>
                      <td className="py-3 text-right font-bold text-primary text-lg">
                        ${selectedInvoice.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => generateInvoicePDF(selectedInvoice)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WholesaleManagement;