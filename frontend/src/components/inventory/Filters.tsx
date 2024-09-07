import { useState, useEffect } from 'react';
import { WarehouseType } from '../../types/typesBackend';

const Filters = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [warehouses, setWarehouseList] = useState<WarehouseType[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/warehouses-list`);
      const data = await response.json();
      setWarehouseList(data);
    }
    fetchItems();
  }, []);

  const filters = [
    { name: "Warehouses", options: warehouses.map(i => i.name_warehouse) }
  ];

  const handleButtonClick = (filterName: string) => {
    setActiveFilter(prevFilter => prevFilter === filterName ? null : filterName); // Toggle content visibility
  };

  return (
    <section className=' px-[34px] mt-[27px] 930:mt-0 md:mx-auto max-w-[750px] md:px-0 930:pl-[34px] 930:mx-0 930:flex-1 930:max-w-[250px]'>
      <div className="bg-fifth-lightblue 930:rounded-[15px] px-[25px] py-4 md:px-[40px] md:py-8 930:max-w-[250px] 930:w-full 930:px-[9px] 930:py-4">
        <div className="bg-white px-4 py-[18px] 930:hidden">
          <div className="flex flex-col gap-[12px] rounded-[8px]">
            {filters.map((filter) => (
              <div key={filter.name} className=''>
                <button
                  onClick={() => handleButtonClick(filter.name)}
                  className={`py-2 w-full border text-left border-second-lightgray px-4 rounded-[8px] ${activeFilter === filter.name ? 'bg-active-lightblue' : ''}`}
                >
                  {filter.name}
                </button>
                <div className={`filter-content ${activeFilter === filter.name ? 'open' : ''}`}>
                  {Array.isArray(filter.options) && (
                    <div className='grid grid-cols-2 gap-x-[10px] gap-y-[12px] text-center'>
                      {filter.options.map((item, index) => (
                        <div key={index} className='border border-third-lightgray rounded-[8px] py-[2px]'>
                          <button>
                            {item}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop */}
        <section className='hidden 930:block'>
          <div className='flex flex-col-reverse gap-[13px]'>
            {filters.map((filter, idx) => (
              <div key={idx} className='bg-white w-full rounded-[8px] pt-[4px] px-[8px] pb-3'>
                <h2 className='font-medium'>
                  {filter.name}
                </h2>
                <div className="mt-2 py-2">
                  {Array.isArray(filter.options) && (
                    <div className='grid grid-cols-2 gap-x-[5px] gap-y-[12px]'>
                      {filter.options.map((item, index) => (
                        <div key={index} >
                          <button className='border px-2 border-third-lightgray rounded-[8px] w-full overflow-auto'>
                            {item}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Filters;
