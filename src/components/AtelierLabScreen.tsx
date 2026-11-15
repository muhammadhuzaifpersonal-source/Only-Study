import React, { useMemo, useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, X, Check } from 'lucide-react';
import { AtelierProduct, CartItem, ProductCategory } from '../types';
import { ResilientImage } from './ResilientImage';

interface AtelierLabScreenProps {
  products: AtelierProduct[];
  cart: CartItem[];
  onAddToCart: (product: AtelierProduct, variant: string) => void;
  onUpdateQuantity: (productId: string, variant: string, delta: number) => void;
  onRemoveItem: (productId: string, variant: string) => void;
  onClearCart: () => void;
}

const CATEGORIES: ProductCategory[] = ['All', 'Matchwear', 'Willow & Gear', 'Alpine Outerwear'];

export const AtelierLabScreen: React.FC<AtelierLabScreenProps> = ({
  products,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [activeProduct, setActiveProduct] = useState<AtelierProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [bagOpen, setBagOpen] = useState(false);

  // Checkout state inside Bag Drawer
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'patron'>('cod');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    total: number;
    city: string;
    method: string;
  } | null>(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const subtotalInr = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.priceInr * item.quantity, 0),
    [cart]
  );

  const freeCourierThreshold = 20000;
  const shippingFee = subtotalInr >= freeCourierThreshold || subtotalInr === 0 ? 0 : 650;
  const orderTotal = subtotalInr + shippingFee;

  const openProductDetail = (product: AtelierProduct) => {
    setActiveProduct(product);
    setSelectedVariant(product.variants[0]);
  };

  const handleQuickAdd = (product: AtelierProduct) => {
    onAddToCart(product, product.variants[0]);
    setConfirmedOrder(null);
    setBagOpen(true);
  };

  const handleModalAddToBag = () => {
    if (!activeProduct) return;
    onAddToCart(activeProduct, selectedVariant || activeProduct.variants[0]);
    setActiveProduct(null);
    setConfirmedOrder(null);
    setBagOpen(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!customerName.trim() || !customerCity.trim() || !customerAddress.trim()) {
      setCheckoutError('Please complete your full name, city, and delivery address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      setCheckoutError('Please enter a valid email address for dispatch updates.');
      return;
    }

    const orderNum = `ZBX-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrder({
      orderId: orderNum,
      total: orderTotal,
      city: customerCity.trim(),
      method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Patron Card Authorization',
    });
    onClearCart();
  };

  return (
    <div className="space-y-10">
      {/* Header + Category Segmented Filter + Bag Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#00E676]">
            Atelier Lab · Seasonal Drop 2026
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC] text-balance">
            Technical Matchwear & Kashmir Willow
          </h1>
          <p className="text-sm text-[#859585]">
            Small-batch match apparel, alpine storm outerwear, and hand-pressed Anantnag willow shipped across India and worldwide.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Filter Atelier products by category"
            className="flex items-center gap-1 p-1 rounded-xl bg-[#0E1317] border border-white/[0.08] overflow-x-auto"
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#00E676] text-[#0A0D0F] font-bold'
                      : 'text-[#859585] hover:text-[#F8FAFC]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setBagOpen(true)}
            className="cta-prestige-gold px-4 py-2.5 text-xs inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="tabular-nums">Bag ({totalItems})</span>
          </button>
        </div>
      </div>

      {/* 3-Column Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="obsidian-card-interactive overflow-hidden flex flex-col"
          >
            {/* 4:3 Uniform Imagery taking ~68% visual prominence */}
            <div
              onClick={() => openProductDetail(product)}
              className="aspect-[4/3] relative bg-[#171C20] overflow-hidden cursor-pointer"
            >
              <ResilientImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                fallbackTitle={product.name}
              />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                  {product.category} · {product.editionLabel}
                </p>
                <h2
                  onClick={() => openProductDetail(product)}
                  className="font-display text-lg font-bold text-[#F8FAFC] hover:text-[#00E676] transition-colors cursor-pointer"
                >
                  {product.name}
                </h2>
                <p className="text-sm text-[#bacbb9] line-clamp-2 leading-relaxed">
                  {product.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-4">
                <span className="font-display text-lg font-extrabold text-[#F8FAFC] tabular-nums">
                  ₹{product.priceInr.toLocaleString('en-IN')}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openProductDetail(product)}
                    className="px-3.5 py-2 rounded-xl border border-white/15 text-xs font-medium text-[#dfe3e9] hover:border-white/35 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className="cta-stadium-green px-4 py-2 text-xs whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Product Detail & Variant Modal */}
      {activeProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdp-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-3xl rounded-[28px] bg-[#0E1317] border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 230, 118, 0.08)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-6 bg-[#171C20] min-h-[260px]">
                <ResilientImage
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                  fallbackTitle={activeProduct.name}
                />
              </div>

              <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#75FF9E]">
                        {activeProduct.category} · {activeProduct.editionLabel}
                      </p>
                      <h2 id="pdp-title" className="font-display text-2xl font-bold text-[#F8FAFC] mt-1">
                        {activeProduct.name}
                      </h2>
                    </div>

                    <button
                      type="button"
                      aria-label="Close product specification"
                      onClick={() => setActiveProduct(null)}
                      className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-[#bacbb9] hover:text-[#F8FAFC] cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-display text-2xl font-extrabold text-[#FFB95F] tabular-nums">
                    ₹{activeProduct.priceInr.toLocaleString('en-IN')}
                  </p>

                  <p className="text-sm text-[#bacbb9] leading-relaxed">
                    {activeProduct.shortDesc}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-white/[0.07] text-xs text-[#dfe3e9]">
                    {activeProduct.specs.map((spec) => (
                      <li key={spec} className="flex items-start gap-2">
                        <span className="text-[#00E676] font-bold">—</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Variant Selector */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                      Select Specification
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeProduct.variants.map((variant) => {
                        const isPicked = selectedVariant === variant;
                        return (
                          <button
                            key={variant}
                            type="button"
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                              isPicked
                                ? 'bg-[#00E676] text-[#0A0D0F] border-[#00E676] font-bold'
                                : 'bg-[#171C20] text-[#dfe3e9] border-white/10 hover:border-white/30'
                            }`}
                          >
                            {variant}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleModalAddToBag}
                  className="cta-stadium-green w-full py-3.5 text-sm cursor-pointer"
                >
                  Add to Bag · ₹{activeProduct.priceInr.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Shopping Bag & Checkout Drawer */}
      {bagOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Patron Shopping Bag"
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
        >
          <div className="w-full max-w-md bg-[#0E1317] border-l border-white/10 h-full flex flex-col justify-between overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#00E676]">
                    Atelier Dispatch
                  </p>
                  <h2 className="font-display text-xl font-bold text-[#F8FAFC]">
                    Patron Bag ({totalItems})
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close bag drawer"
                  onClick={() => setBagOpen(false)}
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-[#bacbb9] hover:text-[#F8FAFC] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Order Confirmation Receipt */}
              {confirmedOrder ? (
                <div className="p-6 rounded-2xl bg-[#171C20] border border-[#00E676]/40 space-y-4">
                  <div className="inline-flex items-center gap-2 text-[#00E676] text-xs font-bold uppercase tracking-wider">
                    <Check className="w-4 h-4" />
                    <span>Order {confirmedOrder.orderId} Confirmed</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
                    Preparing Alpine Dispatch
                  </h3>
                  <p className="text-sm text-[#bacbb9] leading-relaxed">
                    Your Atelier package is queued for Srinagar Valley courier dispatch to{' '}
                    <span className="text-[#F8FAFC] font-medium">{confirmedOrder.city}</span> via{' '}
                    {confirmedOrder.method}.
                  </p>
                  <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between text-sm">
                    <span className="text-[#859585]">Total Authorized</span>
                    <span className="font-display font-bold text-[#FFB95F] tabular-nums">
                      ₹{confirmedOrder.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedOrder(null);
                      setBagOpen(false);
                    }}
                    className="cta-stadium-green w-full py-3 text-xs cursor-pointer"
                  >
                    Return to Atelier Lab
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="font-display text-lg font-bold text-[#F8FAFC]">
                    Your bag is empty
                  </p>
                  <p className="text-sm text-[#859585]">
                    Select matchwear or seasoned Kashmir willow pieces from the Atelier grid.
                  </p>
                </div>
              ) : (
                <>
                  {/* Free Shipping Progress */}
                  <div className="p-3.5 rounded-xl bg-[#171C20] border border-white/[0.06] text-xs text-[#bacbb9]">
                    {subtotalInr >= freeCourierThreshold ? (
                      <span className="text-[#75FF9E] font-medium">
                        Complimentary insured air courier unlocked.
                      </span>
                    ) : (
                      <span>
                        Add{' '}
                        <strong className="text-[#F8FAFC] tabular-nums">
                          ₹{(freeCourierThreshold - subtotalInr).toLocaleString('en-IN')}
                        </strong>{' '}
                        more for complimentary insured alpine courier.
                      </span>
                    )}
                  </div>

                  {/* Itemized Bag List */}
                  <div className="divide-y divide-white/[0.07]">
                    {cart.map((item) => (
                      <div
                        key={`${item.product.id}-${item.variant}`}
                        className="py-4 flex items-start gap-4"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#171C20] shrink-0">
                          <ResilientImage
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="text-sm font-semibold text-[#F8FAFC] truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-[#859585]">
                            Spec: {item.variant}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <div className="inline-flex items-center gap-2 border border-white/10 rounded-lg px-2 py-1 bg-[#0A0D0F]">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  onUpdateQuantity(item.product.id, item.variant, -1)
                                }
                                className="text-[#bacbb9] hover:text-[#F8FAFC] cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold text-[#F8FAFC] tabular-nums w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  onUpdateQuantity(item.product.id, item.variant, 1)
                                }
                                className="text-[#bacbb9] hover:text-[#F8FAFC] cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-display text-sm font-bold text-[#F8FAFC] tabular-nums">
                                ₹{(item.product.priceInr * item.quantity).toLocaleString('en-IN')}
                              </span>
                              <button
                                type="button"
                                aria-label="Remove item"
                                onClick={() => onRemoveItem(item.product.id, item.variant)}
                                className="text-[#64748B] hover:text-[#ffb4ab] cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Payment Form */}
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-4 border-t border-white/[0.08]">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                      Dispatch & Payment Verification
                    </p>

                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name"
                      aria-label="Full Name"
                      className="obsidian-input w-full px-3.5 py-2.5 rounded-xl text-sm"
                    />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email Address"
                      aria-label="Email Address"
                      className="obsidian-input w-full px-3.5 py-2.5 rounded-xl text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        placeholder="City"
                        aria-label="City"
                        className="obsidian-input w-full px-3.5 py-2.5 rounded-xl text-sm"
                      />
                      <input
                        type="text"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Street / Pin Code"
                        aria-label="Street and Pin Code"
                        className="obsidian-input w-full px-3.5 py-2.5 rounded-xl text-sm"
                      />
                    </div>

                    {/* Payment Radio Selection */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-colors cursor-pointer ${
                          paymentMethod === 'cod'
                            ? 'border-[#00E676] bg-[#00E676]/10 text-[#F8FAFC]'
                            : 'border-white/10 bg-[#0A0D0F] text-[#859585]'
                        }`}
                      >
                        Cash on Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('patron')}
                        className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-colors cursor-pointer ${
                          paymentMethod === 'patron'
                            ? 'border-[#00E676] bg-[#00E676]/10 text-[#F8FAFC]'
                            : 'border-white/10 bg-[#0A0D0F] text-[#859585]'
                        }`}
                      >
                        Patron Card / UPI
                      </button>
                    </div>

                    {checkoutError && (
                      <p className="text-xs text-[#ffb4ab]">{checkoutError}</p>
                    )}

                    <div className="pt-3 border-t border-white/[0.08] space-y-2 text-sm">
                      <div className="flex justify-between text-[#859585]">
                        <span>Subtotal</span>
                        <span className="tabular-nums">₹{subtotalInr.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[#859585]">
                        <span>Insured Courier</span>
                        <span className="tabular-nums">
                          {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-display text-base font-bold text-[#F8FAFC] pt-1">
                        <span>Total</span>
                        <span className="tabular-nums text-[#75FF9E]">
                          ₹{orderTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="cta-stadium-green w-full py-3.5 text-sm cursor-pointer"
                    >
                      Confirm Atelier Order
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
