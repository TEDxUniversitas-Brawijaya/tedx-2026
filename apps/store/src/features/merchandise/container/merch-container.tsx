import CategorySection from "../components/category-section";
import Hero from "../components/hero";
import ProductListSection from "../components/product-list-section";
import { merchsData } from "../data/merch";

const MerchContainer = () => {
  return (
    <main className="">
      <Hero />
      <CategorySection />
      <ProductListSection filter="tshirt" merchs={merchsData.tshirt} />
      {/* Temporary spacer to allow scroll testing */}
    </main>
  );
};

export default MerchContainer;
