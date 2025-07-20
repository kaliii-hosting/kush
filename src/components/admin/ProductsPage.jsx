import { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { Plus, Database, BarChart3, Package, Upload, FileSpreadsheet } from 'lucide-react';
import { seedFirebaseProducts } from '../../utils/seedFirebase';
import * as XLSX from 'xlsx';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('dropdown'); // 'dropdown' or 'modal'
  const [editingProduct, setEditingProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isUsingFirebase, setIsUsingFirebase] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('');
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from Firebase Realtime Database or localStorage
  const fetchProducts = () => {
    setLoading(true);
    try {
      const productsRef = ref(realtimeDb, 'products');
      
      // Set up real-time listener
      const unsubscribe = onValue(productsRef, 
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert object to array with IDs
            const productsArray = Object.entries(data).map(([id, product]) => ({
              id,
              ...product
            }));
            setProducts(productsArray);
            setIsUsingFirebase(true);
            // Store in localStorage as backup
            localStorage.setItem('localProducts', JSON.stringify(productsArray));
          } else {
            // No data in Firebase, use local storage
            loadLocalProducts();
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching products from Firebase:', error);
          loadLocalProducts();
          setLoading(false);
        }
      );

      // Cleanup function
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up Firebase listener:', error);
      loadLocalProducts();
      setLoading(false);
    }
  };

  // Load products from localStorage
  const loadLocalProducts = () => {
    const localProducts = localStorage.getItem('localProducts');
    if (localProducts) {
      setProducts(JSON.parse(localProducts));
    } else {
      // Use default products if no local data
      const defaultProducts = [
        {
          id: Date.now().toString(),
          name: "Sample Flower",
          type: "flower",
          price: 45,
          thc: "22%",
          description: "Sample product - Add your own products!",
          effects: ["Relaxed", "Happy"],
          imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f33f.svg",
          inStock: true
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('localProducts', JSON.stringify(defaultProducts));
    }
  };

  // Add new product
  const handleAddProduct = async (productData) => {
    const newProduct = {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      // Try to add to Firebase
      const productsRef = ref(realtimeDb, 'products');
      await push(productsRef, newProduct);
      setShowForm(false);
      setSuccessMessage('Product added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding product to Firebase:', error);
      
      // Fallback to localStorage
      const localProducts = localStorage.getItem('localProducts');
      const products = localProducts ? JSON.parse(localProducts) : [];
      const productWithId = { ...newProduct, id: Date.now().toString() };
      products.push(productWithId);
      localStorage.setItem('localProducts', JSON.stringify(products));
      setProducts(products);
      setShowForm(false);
      setSuccessMessage('Product added successfully (stored locally)!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Update product
  const handleUpdateProduct = async (productId, productData) => {
    const updatedData = {
      ...productData,
      updatedAt: new Date().toISOString()
    };

    try {
      // Try to update in Firebase
      const productRef = ref(realtimeDb, `products/${productId}`);
      await update(productRef, updatedData);
      setEditingProduct(null);
      setShowForm(false);
      setSuccessMessage('Product updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating product in Firebase:', error);
      
      // Fallback to localStorage
      const localProducts = localStorage.getItem('localProducts');
      const products = localProducts ? JSON.parse(localProducts) : [];
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, ...updatedData } : p
      );
      localStorage.setItem('localProducts', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      setEditingProduct(null);
      setShowForm(false);
      setSuccessMessage('Product updated successfully (stored locally)!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Try to delete from Firebase
        const productRef = ref(realtimeDb, `products/${productId}`);
        await remove(productRef);
        setSuccessMessage('Product deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting product from Firebase:', error);
        
        // Fallback to localStorage
        const localProducts = localStorage.getItem('localProducts');
        const products = localProducts ? JSON.parse(localProducts) : [];
        const filteredProducts = products.filter(p => p.id !== productId);
        localStorage.setItem('localProducts', JSON.stringify(filteredProducts));
        setProducts(filteredProducts);
        setSuccessMessage('Product deleted successfully (stored locally)!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  // Seed database with sample products
  const handleSeedDatabase = async () => {
    if (window.confirm('This will add sample products to Firebase. Continue?')) {
      const success = await seedFirebaseProducts();
      if (success) {
        setSuccessMessage('Database seeded with sample products!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to seed database. Check console for errors.');
      }
    }
  };

  // Process large Excel files in chunks
  const processLargeExcelFile = async (file) => {
    const CHUNK_SIZE = 100; // Smaller chunks for better performance
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB absolute max
    
    // Check absolute maximum file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum supported size is 10MB. Please split your file into smaller parts.`);
    }
    
    try {
      setImportStatus('Preparing to read large file...');
      setImportProgress(1);
      
      // Use slices for reading large files
      const SLICE_SIZE = 1024 * 1024; // 1MB slices
      const sliceCount = Math.ceil(file.size / SLICE_SIZE);
      const fileChunks = [];
      
      // Read file in slices to prevent memory issues
      for (let i = 0; i < sliceCount; i++) {
        setImportStatus(`Reading file... ${Math.round((i + 1) / sliceCount * 100)}%`);
        setImportProgress(Math.round((i + 1) / sliceCount * 5));
        
        const start = i * SLICE_SIZE;
        const end = Math.min(start + SLICE_SIZE, file.size);
        const slice = file.slice(start, end);
        const arrayBuffer = await slice.arrayBuffer();
        fileChunks.push(new Uint8Array(arrayBuffer));
        
        // Allow UI to update
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Combine file chunks
      setImportStatus('Combining file data...');
      const totalLength = fileChunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const fileData = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of fileChunks) {
        fileData.set(chunk, offset);
        offset += chunk.length;
      }
      
      setImportStatus('Parsing Excel data (this may take a moment)...');
      setImportProgress(7);
      
      // Allow UI to update before heavy parsing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Parse Excel with minimal options and streaming
      let workbook;
      try {
        workbook = XLSX.read(fileData, { 
          type: 'array',
          cellDates: false,
          cellNF: false,
          cellHTML: false,
          cellFormula: false,
          cellStyles: false,
          sheetStubs: false,
          bookVBA: false,
          password: undefined,
          WTF: false
        });
      } catch (parseError) {
        console.error('Excel parsing error:', parseError);
        throw new Error('Failed to parse Excel file. The file may be corrupted or in an unsupported format.');
      }
      
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error('No sheets found in Excel file');
      }
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: ''
      });
      
      if (jsonData.length === 0) {
        throw new Error('No data found in Excel file');
      }
      
      // Calculate chunks
      const totalRows = jsonData.length;
      const chunks = Math.ceil(totalRows / CHUNK_SIZE);
      setTotalChunks(chunks);
      
      setImportStatus(`Found ${totalRows} products. Will process in ${chunks} chunks...`);
      setImportProgress(10);
      
      // Process each chunk
      let totalImported = 0;
      let totalFailed = 0;
      const allFailedProducts = [];
      
      for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
        setCurrentChunk(chunkIndex + 1);
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, totalRows);
        const chunkData = jsonData.slice(start, end);
        
        setImportStatus(`Processing chunk ${chunkIndex + 1} of ${chunks} (rows ${start + 1}-${end})...`);
        
        // Process chunk
        const result = await processChunk(chunkData, start, chunkIndex, chunks);
        totalImported += result.imported;
        totalFailed += result.failed;
        allFailedProducts.push(...result.failedProducts);
        
        // Update overall progress
        const overallProgress = 10 + ((chunkIndex + 1) / chunks) * 85;
        setImportProgress(Math.round(overallProgress));
        
        // Small delay between chunks
        if (chunkIndex < chunks - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      // Final status
      setImportProgress(100);
      setCurrentChunk(0);
      setTotalChunks(0);
      
      if (totalFailed > 0) {
        const failedList = allFailedProducts.slice(0, 5).join(', ');
        const moreText = allFailedProducts.length > 5 ? ` and ${allFailedProducts.length - 5} more` : '';
        setSuccessMessage(`Imported ${totalImported} products. Failed to import ${totalFailed} products: ${failedList}${moreText}`);
      } else {
        setSuccessMessage(`Successfully imported all ${totalImported} products from ${chunks} chunks!`);
      }
      
      setImportStatus('Import completed!');
      
    } catch (error) {
      throw error;
    }
  };
  
  // Process a single chunk of data
  const processChunk = async (chunkData, startIndex, chunkIndex, totalChunks) => {
    const processedProducts = [];
    const validationErrors = [];
    
    // Validate chunk data
    chunkData.forEach((row, index) => {
      try {
        const product = {
          name: row['Product Name'] || '',
          description: row['Description'] || '',
          category: row['Category'] || 'flower',
          type: row['Category'] || 'flower',
          strain: row['Strain'] || '',
          strainInformation: row['Strain Information'] || '',
          flavor: row['Flavor'] || '',
          thc: row['THC Content'] || '',
          cbd: row['CBD Content'] || '',
          price: parseFloat(row['Price']) || 0,
          packageSize: row['Package Size'] || '',
          imageUrl: row['Image Link'] || '',
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (!product.name || product.name.trim() === '') {
          validationErrors.push(`Row ${startIndex + index + 2}: Product Name is required`);
          return;
        }
        if (!product.price || isNaN(product.price) || product.price <= 0) {
          validationErrors.push(`Row ${startIndex + index + 2}: Valid Price is required`);
          return;
        }

        processedProducts.push(product);
      } catch (error) {
        validationErrors.push(`Row ${startIndex + index + 2}: ${error.message}`);
      }
    });
    
    // Import valid products from this chunk
    let importedCount = 0;
    let failedCount = 0;
    const failedProducts = [];
    
    for (let i = 0; i < processedProducts.length; i++) {
      const product = processedProducts[i];
      const progressInChunk = (i + 1) / processedProducts.length;
      const chunkProgress = (chunkIndex + progressInChunk) / totalChunks;
      const overallProgress = 10 + (chunkProgress * 85);
      
      setImportProgress(Math.round(overallProgress));
      setImportStatus(`Chunk ${chunkIndex + 1}/${totalChunks}: Importing ${product.name}...`);
      
      try {
        const productsRef = ref(realtimeDb, 'products');
        await push(productsRef, product);
        importedCount++;
        
        // Small delay to prevent overwhelming Firebase
        await new Promise(resolve => setTimeout(resolve, 30));
      } catch (error) {
        console.error('Error importing product:', product.name, error);
        failedCount++;
        failedProducts.push(product.name);
      }
    }
    
    return {
      imported: importedCount,
      failed: failedCount + validationErrors.length,
      failedProducts: failedProducts
    };
  };

  // Handle Excel file import
  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // File size limits
    const maxDirectSize = 500 * 1024; // 500KB for direct processing
    const maxChunkSize = 2 * 1024 * 1024; // 2MB for chunked processing
    const fileSize = file.size;
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    
    // Check if file is too large even for chunking
    if (fileSize > maxChunkSize) {
      alert(`File size (${fileSizeMB}MB) is too large for browser-based import.\n\nRecommended solutions:\n\n1. Convert to CSV format (much smaller file size)\n2. Split your Excel file into multiple smaller files (max 2MB each)\n3. Remove unnecessary columns, formatting, or empty rows\n4. Use Excel's "Save As" > "CSV" option\n\nFor files over 2MB, we recommend using CSV format which is much more efficient.`);
      event.target.value = '';
      return;
    }
    
    const isLargeFile = fileSize > maxDirectSize;

    setImportLoading(true);
    setImportProgress(0);
    setImportStatus('Reading Excel file...');
    setSuccessMessage('');

    // For large files, use chunking process
    if (isLargeFile) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setImportStatus(`Processing large file (${sizeMB}MB) with automatic chunking...`);
      
      setTimeout(async () => {
        try {
          await processLargeExcelFile(file);
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Error processing large Excel file:', error);
          setImportStatus('Import failed!');
          
          let errorMessage = 'Error importing large file:\n';
          if (error.message.includes('No data found')) {
            errorMessage += 'The Excel file appears to be empty or has no valid data.';
          } else {
            errorMessage += error.message || 'An unexpected error occurred. Please check the file format and try again.';
          }
          
          alert(errorMessage);
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } finally {
          setImportLoading(false);
          setTimeout(() => {
            setImportProgress(0);
            setImportStatus('');
            setSuccessMessage('');
          }, 5000);
        }
      }, 100);
      
      return; // Exit early for large files
    }

    // For smaller files, use the original process
    setTimeout(async () => {
      try {
        let jsonData = [];
        
        // Check if CSV file
        if (file.name.toLowerCase().endsWith('.csv')) {
          setImportStatus('Processing CSV file...');
          setImportProgress(5);
          
          // Read CSV as text
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
          });
          
          setImportProgress(10);
          setImportStatus('Parsing CSV data...');
          
          // Parse CSV using XLSX
          const workbook = XLSX.read(text, { type: 'string' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            defval: ''
          });
          
        } else {
          // Excel file processing
          setImportStatus('Processing Excel file...');
          setImportProgress(5);
          
          // Force UI update
          await new Promise(resolve => requestAnimationFrame(resolve));
          
          const reader = new FileReader();
          
          const fileData = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
          });
          
          setImportProgress(10);
          setImportStatus('Parsing Excel data...');
          
          // Force another UI update before heavy parsing
          await new Promise(resolve => requestAnimationFrame(resolve));
          
          // Parse with options to reduce memory usage
          const workbook = XLSX.read(fileData, { 
            type: 'array',
            cellDates: false,
            cellNF: false,
            cellHTML: false,
            cellFormula: false,
            cellStyles: false,
            sheetStubs: false
          });
          
          const sheetName = workbook.SheetNames[0];
          if (!sheetName) {
            throw new Error('No sheets found in Excel file');
          }
          
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON with raw values only
          jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            defval: ''
          });
        }

      if (jsonData.length === 0) {
        throw new Error('No data found in Excel file');
      }

      setImportStatus(`Found ${jsonData.length} products to import...`);
      setImportProgress(10);

      // Validate and process the data
      const processedProducts = [];
      const validationErrors = [];

      jsonData.forEach((row, index) => {
        try {
          // Map Excel columns to product fields
          const product = {
            name: row['Product Name'] || '',
            description: row['Description'] || '',
            category: row['Category'] || 'flower',
            type: row['Category'] || 'flower', // Map category to type for compatibility
            strain: row['Strain'] || '',
            strainInformation: row['Strain Information'] || '',
            flavor: row['Flavor'] || '',
            thc: row['THC Content'] || '',
            cbd: row['CBD Content'] || '',
            price: parseFloat(row['Price']) || 0,
            packageSize: row['Package Size'] || '',
            imageUrl: row['Image Link'] || '',
            inStock: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Validate required fields
          if (!product.name || product.name.trim() === '') {
            validationErrors.push(`Row ${index + 2}: Product Name is required`);
            return;
          }
          if (!product.price || isNaN(product.price) || product.price <= 0) {
            validationErrors.push(`Row ${index + 2}: Valid Price is required (must be greater than 0)`);
            return;
          }

          processedProducts.push(product);
        } catch (error) {
          validationErrors.push(`Row ${index + 2}: ${error.message}`);
        }
      });

      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.slice(0, 5).join('\n');
        const moreErrors = validationErrors.length > 5 ? `\n...and ${validationErrors.length - 5} more errors` : '';
        throw new Error(`Validation errors:\n${errorMessage}${moreErrors}`);
      }

      setImportProgress(20);
      setImportStatus(`Validated ${processedProducts.length} products. Starting import...`);

      // Import products to Firebase with progress tracking
      let importedCount = 0;
      let failedCount = 0;
      const failedProducts = [];
      
      // Process in batches to avoid overwhelming the UI
      const batchSize = 5;
      
      for (let i = 0; i < processedProducts.length; i += batchSize) {
        const batch = processedProducts.slice(i, Math.min(i + batchSize, processedProducts.length));
        const batchPromises = [];
        
        for (const product of batch) {
          const productIndex = i + batch.indexOf(product);
          const progress = 20 + ((productIndex + 1) / processedProducts.length) * 70;
          setImportProgress(Math.round(progress));
          setImportStatus(`Importing product ${productIndex + 1} of ${processedProducts.length}: ${product.name}`);
          
          batchPromises.push(
            (async () => {
              try {
                const productsRef = ref(realtimeDb, 'products');
                await push(productsRef, product);
                return { success: true, product };
              } catch (error) {
                console.error('Error importing product:', product.name, error);
                return { success: false, product, error };
              }
            })()
          );
        }
        
        // Wait for batch to complete
        const results = await Promise.all(batchPromises);
        
        // Process results
        for (const result of results) {
          if (result.success) {
            importedCount++;
          } else {
            failedCount++;
            failedProducts.push(result.product.name);
          }
        }
        
        // Add small delay between batches to keep UI responsive
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setImportProgress(100);
      
      if (failedCount > 0) {
        const failedList = failedProducts.slice(0, 3).join(', ');
        const moreText = failedProducts.length > 3 ? ` and ${failedProducts.length - 3} more` : '';
        setSuccessMessage(`Imported ${importedCount} products. Failed to import ${failedCount} products: ${failedList}${moreText}`);
      } else {
        setSuccessMessage(`Successfully imported all ${importedCount} products!`);
      }
      
      setImportStatus('Import completed!');
      setTimeout(() => {
        setSuccessMessage('');
        setImportStatus('');
      }, 5000);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setImportStatus('Import failed!');
      
      // More user-friendly error messages
      let errorMessage = 'Error importing file:\n';
      if (error.message.includes('Validation errors')) {
        errorMessage += error.message;
      } else if (error.message.includes('No data found')) {
        errorMessage += 'The Excel file appears to be empty or has no valid data.';
      } else {
        errorMessage += error.message || 'An unexpected error occurred. Please check the file format and try again.';
      }
      
      alert(errorMessage);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      } finally {
        // Always clean up loading state
        setImportLoading(false);
        setTimeout(() => {
          setImportProgress(0);
          setImportStatus('');
        }, 3000);
      }
    }, 100); // End of setTimeout
  };

  // Trigger file input click
  const handleImportClick = () => {
    if (!importLoading) {
      fileInputRef.current?.click();
    }
  };

  // Download template Excel file
  const handleDownloadTemplate = () => {
    try {
      // Create template data
      const templateData = [{
        'Product Name': 'Example Product',
        'Description': 'Premium quality cannabis product',
        'Category': 'flower',
        'Strain': 'OG Kush',
        'Strain Information': 'Classic indica-dominant hybrid with earthy pine aroma',
        'Flavor': 'Pine, Earthy, Woody',
        'THC Content': '22%',
        'CBD Content': '0.5%',
        'Price': '45.00',
        'Package Size': '3.5g',
        'Image Link': 'https://example.com/image.png'
      }];

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Products');

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Product Name
        { wch: 40 }, // Description
        { wch: 15 }, // Category
        { wch: 15 }, // Strain
        { wch: 40 }, // Strain Information
        { wch: 20 }, // Flavor
        { wch: 12 }, // THC Content
        { wch: 12 }, // CBD Content
        { wch: 10 }, // Price
        { wch: 15 }, // Package Size
        { wch: 40 }  // Image Link
      ];
      ws['!cols'] = colWidths;

      // Download the file
      XLSX.writeFile(wb, 'Kushie_Products_Template.xlsx');
      
      setSuccessMessage('Template downloaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
    }
  };

  // Calculate stats for all categories
  const stats = {
    total: products.length,
    flower: products.filter(p => p.type === 'flower').length,
    edible: products.filter(p => p.type === 'edible').length,
    concentrate: products.filter(p => p.type === 'concentrate').length,
    cartridge: products.filter(p => p.type === 'cartridge').length,
    disposable: products.filter(p => p.type === 'disposable').length,
    preroll: products.filter(p => p.type === 'preroll' || p.type === 'hemp-preroll').length,
    infusedPreroll: products.filter(p => p.type === 'infused-preroll' || p.type === 'hash-infused-preroll' || p.type === 'infused-preroll-5pack').length,
    vaporizers: products.filter(p => p.type === 'cartridge' || p.type === 'disposable' || p.type === 'pod' || p.type === 'battery').length,
    other: products.filter(p => p.type === 'merch' || p.type === 'distillate' || p.type === 'liquid-diamonds' || p.type === 'live-resin-diamonds').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {/* Firebase Notice */}
      {!isUsingFirebase && (
        <div className="mb-4 bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-4 py-3 rounded-lg">
          <p className="font-semibold">Notice: Using Local Storage</p>
          <p className="text-sm mt-1">
            Firebase connection not established. Products are being stored locally in your browser. 
            Check your Firebase Realtime Database configuration.
          </p>
        </div>
      )}

      {/* Import Progress Overlay */}
      {importLoading && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-spotify-light-gray rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Importing Products</h3>
            
            {/* Chunk Info */}
            {totalChunks > 1 && (
              <div className="mb-4 text-center">
                <p className="text-spotify-green font-semibold">
                  Chunk {currentChunk} of {totalChunks}
                </p>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-spotify-green h-full transition-all duration-300 ease-out"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
              <p className="text-white text-center mt-2 font-semibold">{importProgress}%</p>
            </div>
            
            {/* Status Message */}
            <p className="text-gray-300 text-center text-sm mb-2">{importStatus}</p>
            
            {/* File Size Warning for Large Files */}
            {totalChunks > 1 && (
              <p className="text-yellow-400 text-xs text-center">
                Large file detected - processing in chunks for stability
              </p>
            )}
            
            {/* Cancel Button (disabled during import) */}
            <button
              className="mt-6 w-full bg-gray-600 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed opacity-50"
              disabled
            >
              Please wait...
            </button>
          </div>
        </div>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-spotify-light-gray rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Total</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <BarChart3 className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        <div className="bg-spotify-light-gray rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Flower</p>
              <p className="text-2xl font-bold text-green-400">{stats.flower}</p>
            </div>
            <Package className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="bg-spotify-light-gray rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Prerolls</p>
              <p className="text-2xl font-bold text-orange-400">{stats.preroll}</p>
            </div>
            <Package className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div className="bg-spotify-light-gray rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Infused</p>
              <p className="text-2xl font-bold text-purple-400">{stats.infusedPreroll}</p>
            </div>
            <Package className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="bg-spotify-light-gray rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Vaporizers</p>
              <p className="text-2xl font-bold text-blue-400">{stats.vaporizers}</p>
            </div>
            <Package className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-spotify-light-gray rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Other</p>
              <p className="text-2xl font-bold text-gray-400">{stats.other}</p>
            </div>
            <Package className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Products Inventory</h2>
          <p className="text-sm text-gray-400 mt-1">For large datasets (over 2MB), use CSV format for better performance</p>
        </div>
        <div className="flex gap-2">
          {products.length === 0 && (
            <button
              onClick={handleSeedDatabase}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Database size={20} />
              Seed Database
            </button>
          )}
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            title="Download Excel template"
          >
            <FileSpreadsheet size={20} />
            Template
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            disabled={importLoading}
            title="Import Excel or CSV file (max 2MB)"
          >
            <Upload size={20} className={importLoading ? 'animate-spin' : ''} />
            {importLoading ? 'Importing...' : 'Import File'}
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-spotify-green hover:bg-spotify-green-hover text-black px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} className={`transition-transform ${showForm ? 'rotate-45' : ''}`} />
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </div>

      {/* Hidden file input for Excel import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Product Form Dropdown for both Add and Edit */}
      {showForm && (
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct 
              ? (data) => handleUpdateProduct(editingProduct.id, data)
              : handleAddProduct
            }
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            isDropdown={true}
          />
        </div>
      )}

      {/* Products List */}
      <ProductList
        products={products}
        onEdit={(product) => {
          setEditingProduct(product);
          setShowForm(true);
        }}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductsPage;