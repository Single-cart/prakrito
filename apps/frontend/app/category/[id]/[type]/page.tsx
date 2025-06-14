import { styles } from "@/app/styles";
import Cart from "@/components/Cart";
import CategoryFilters from "@/components/CategoryFilters";
import ClearFilter from "@/components/ClearFilter";
import ComponentLoader from "@/components/ComponentLoader";
import MobileFilter from "@/components/MobileFilter";
import PriceFilters from "@/components/PriceFilters";
import ProductCard from "@/components/ProductCard";
import RatingsFilters from "@/components/RatingsFilters";
import BannerSlider from "@/components/bannerSlider";
import Paginations from "@/components/pagination";
import { getBanners } from "@/lib/fetch/banner.data";
import { getAllProducts } from "@/lib/fetch/getProduct";
import { product } from "@workspace/shared/index";
import { cn } from "@workspace/ui/lib/utils";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string; type: string }>;
};

const CategoryProducts = async ({ params }: Props) => {
  const AllParams = await params;
  const id = AllParams.id;
  const type = AllParams.type;

  const data = await getAllProducts({ [type]: id });
  const products = data?.data?.products as product.IProductRes[];
  const banners = await getBanners("categoryBanner", id);

  return (
    <div className={cn(styles.paddingX)}>
      <div className="fixed top-[90%] z-40 right-5 lg:hidden">
        <Cart />
      </div>

      <Suspense fallback={<div>Loading banner...</div>}>
        <BannerSlider banner={banners?.data} />
      </Suspense>

      <div className={cn("lg:flex block")}>
        <div
          className={cn(
            styles.paddingY,
            "basis-[22%] md:px-4 px-0 shadow-lg bg-secondary hidden lg:block"
          )}
        >
          <h1 className="font-semibold uppercase text-xl mb-4 text-primary">
            Filters
          </h1>
          <div className="space-y-4">
            <Suspense
              fallback={
                <div className="p-4 bg-white rounded-lg animate-pulse h-40"></div>
              }
            >
              <CategoryFilters categories={data?.data?.allCategories} />
              <PriceFilters />
              <RatingsFilters key={`ratings-${id}`} />
              <ClearFilter />
            </Suspense>
          </div>
        </div>

        <div className={cn(styles.paddingY, "md:px-4 px-0")}>
          <div className="flex justify-between items-center">
            <h1 className={cn(styles.headingText)}>All Products</h1>
            <div className="lg:hidden block">
              <MobileFilter categories={data?.data?.allCategories} />
            </div>
          </div>

          {products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-center items-center justify-center place-content-center flex-wrap mt-5 gap-3 md:gap-4">
              {products?.map((item) => (
                <Suspense key={item._id} fallback={<ComponentLoader />}>
                  <ProductCard product={item} />
                </Suspense>
              ))}
            </div>
          ) : (
            <div className="text-center mt-10 text-2xl text-red-500">
              <h1 className="text-center font-semibold">product not found</h1>
            </div>
          )}
        </div>
      </div>

      {data?.pagination?.numberOfProducts > 10 && (
        <Suspense fallback={<ComponentLoader />}>
          <Paginations
            type="user"
            pagination={data?.data?.pagination}
            category={id}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CategoryProducts;
