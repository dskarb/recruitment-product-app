// Components
export { ProductDialog } from "./components/dialog/product-dialog";
export { StepIndicator } from "./components/dialog/step-indicator";
export { Step1Basic } from "./components/dialog/step-1-basic";
export { Step2Price } from "./components/dialog/step-2-price";
export { Step3Stock } from "./components/dialog/step-3-stock";
export { WIZARD_STEPS, DEFAULT_FORM_DATA } from "./components/dialog/wizard-config";

export { ProductTable } from "./components/table/product-table";
export { ProductCards } from "./components/table/product-cards";
export { ProductPagination } from "./components/table/pagination";

// Hooks
export { useProducts, DEFAULT_PAGE_SIZE } from "./hooks/use-products";
export { useProductWizard } from "./hooks/use-product-wizard";

// Types
export * from "./types";

// Schemas
export * from "./schemas";

// Utils
export * from "./utils/pricing";
export * from "./utils/formatters";

// Mock Data
export { INITIAL_PRODUCTS } from "./data/mock-products";
