import React, { useState } from 'react';
import { Product } from '../../types/warehouse';
import { Package, History, Plus, AlertTriangle, Trash2, Barcode, QrCode, Image } from 'lucide-react';
import { BarcodeModal } from './BarcodeModal';
import { BarcodeScanner } from './BarcodeScanner';
import { ContextMenu } from '../ContextMenu';
import { ImagePreview } from './ImagePreview';

interface ProductListProps {
  products: Product[];
  onAddBatch: (product: Product) => void;
  onViewHistory: (product: Product) => void;
  onWriteOff: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddBatch,
  onViewHistory,
  onWriteOff
}) => {
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    product: Product;
  } | null>(null);

  const formatMoney = (amount: number | undefined): string => {
    if (typeof amount !== 'number') return '0 ₸';
    return amount.toLocaleString('ru-RU') + ' ₸';
  };

  const handleShowBarcode = (product: Product) => {
    setSelectedProduct(product);
    setShowBarcodeModal(true);
  };

  const handleScanResult = (result: string) => {
    const product = products.find(p => p.id === result);
    if (product) {
      setSelectedProduct(product);
      setShowBarcodeModal(true);
    } else {
      alert('Товар не найден');
    }
  };

  const handleContextMenu = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      product
    });
  };

  const handleImageClick = (product: Product) => {
    if (product.image) {
      setSelectedProduct(product);
      setShowImagePreview(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-end p-4 border-b">
          <button
            onClick={() => setShowScanner(true)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
          >
            <QrCode className="w-5 h-5 mr-2 inline-block" />
            Сканировать код
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Товар
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Количество
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Средняя цена
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Общая стоимость
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50"
                  onContextMenu={(e) => handleContextMenu(e, product)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.quantity <= (product.minQuantity || 0) && (
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <div className="flex items-center">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover mr-3 cursor-pointer"
                            onClick={() => handleImageClick(product)}
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${
                      product.quantity <= (product.minQuantity || 0) ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {product.quantity} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{formatMoney(product.averagePurchasePrice)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{formatMoney(product.totalPurchasePrice)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleShowBarcode(product)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Штрих-код"
                      >
                        <Barcode className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onAddBatch(product)}
                        className="text-emerald-600 hover:text-emerald-900"
                        title="Добавить партию"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onWriteOff(product)}
                        className="text-red-600 hover:text-red-900"
                        title="Списать"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onViewHistory(product)}
                        className="text-blue-600 hover:text-blue-900"
                        title="История"
                      >
                        <History className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onEdit={() => {
            onAddBatch(contextMenu.product);
            setContextMenu(null);
          }}
          onDelete={() => {
            onWriteOff(contextMenu.product);
            setContextMenu(null);
          }}
          title={contextMenu.product.name}
          editLabel="Добавить партию"
        />
      )}

      {showBarcodeModal && selectedProduct && (
        <BarcodeModal
          isOpen={showBarcodeModal}
          onClose={() => {
            setShowBarcodeModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}

      {showScanner && (
        <BarcodeScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onScan={handleScanResult}
        />
      )}

      {showImagePreview && selectedProduct?.image && (
        <ImagePreview
          imageUrl={selectedProduct.image}
          onClose={() => {
            setShowImagePreview(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
};