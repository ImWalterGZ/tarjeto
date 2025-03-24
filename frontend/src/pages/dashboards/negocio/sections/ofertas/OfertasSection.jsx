import React, { useState, useCallback } from "react";
import PromoDrawer from "../../../../../components/promociones/PromoDrawer";
import PromoCreator from "../../../../../components/promociones/PromoCreator";
import PromoList from "../../../../../components/promociones/PromoList";

export default function OfertasSection({ negocio }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of the promotion list
  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Function to handle when a promotion is successfully created
  const handlePromoCreated = useCallback(
    (newPromotion) => {
      handleRefresh();
    },
    [handleRefresh]
  );

  // Function to handle when a promotion is selected for editing
  const handleEditPromo = useCallback((promo) => {
    setSelectedPromo(promo);
    setIsDrawerOpen(true);
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Ofertas y Promociones
        </h2>
      </div>

      {/* Main content with side-by-side layout */}
      <div className="flex flex-row gap-4 h-full overflow-hidden">
        {/* Left Side: Promo Creator (4/6 width) */}
        <div className="w-4/6 h-full overflow-auto">
          <PromoCreator negocio={negocio} onSuccess={handlePromoCreated} />
        </div>

        {/* Right Side: Promo List (2/6 width) */}
        <div className="w-2/6 h-full overflow-auto">
          <PromoList
            negocio={negocio}
            onEdit={handleEditPromo}
            onRefresh={handleRefresh}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>

      {/* Drawer for editing promotions */}
      <PromoDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedPromo(null);
        }}
        promotion={selectedPromo}
        onSave={handleRefresh}
      />
    </div>
  );
}
