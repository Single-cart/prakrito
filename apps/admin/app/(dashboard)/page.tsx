import DalySalesChart from "@/components/DalySalesChart";
import NavHeader from "@/components/nav-header";
import OrderChart from "@/components/OrderChart";
import ProductStockChart from "@/components/ProductStockChart";
import SalesChart from "@/components/SalesChart";

const bread = [
  {
    href: "/",
    text: "Dashboard",
    last: true,
  },
];

export default function Page() {
  return (
    <div className="">
      <NavHeader bread={bread} />
      <div className="p-4">
        <div className="space-y-3 mb-5">
          <h1 className="font-semibold text-2xl">Daly Sales Report</h1>
          <DalySalesChart />
        </div>
        <div className="space-y-4">
          <h1 className="font-semibold text-2xl">Total Revenue</h1>
          <SalesChart />
        </div>
        <div className="lg:flex block items-center justify-between bg-gray-100 gap-4 text-center">
          <div className="space-y-4 mt-5 max-w-[450px] flex-1 w-full ">
            <h1 className="font-semibold text-2xl ">Order Summary</h1>
            <OrderChart />
          </div>
          <div className="space-y-4 mt-5 max-w-[450px] flex-1 w-full ">
            <h1 className="font-semibold text-2xl ">Product Stock</h1>
            <ProductStockChart />
          </div>
        </div>
      </div>
    </div>
  );
}
