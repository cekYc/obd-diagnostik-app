export interface Vehicle {
  brand: string;
  models: {
    name: string;
    years: string[];
    engines: string[];
  }[];
}

export const vehicleDatabase: Vehicle[] = [
  {
    brand: 'Volkswagen',
    models: [
      {
        name: 'Golf',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.0 TSI', '1.4 TSI', '1.5 TSI', '2.0 TDI', '2.0 TSI GTI'],
      },
      {
        name: 'Passat',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        engines: ['1.4 TSI', '1.6 TDI', '2.0 TDI', '2.0 TSI'],
      },
      {
        name: 'Polo',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.0 MPI', '1.0 TSI', '1.2 TSI', '1.4 TDI'],
      },
    ],
  },
  {
    brand: 'Audi',
    models: [
      {
        name: 'A3',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.0 TFSI', '1.4 TFSI', '2.0 TDI', '2.0 TFSI'],
      },
      {
        name: 'A4',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        engines: ['2.0 TDI', '2.0 TFSI', '3.0 TDI'],
      },
    ],
  },
  {
    brand: 'BMW',
    models: [
      {
        name: '3 Series',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['318i', '320i', '320d', '330i', 'M340i'],
      },
      {
        name: '5 Series',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        engines: ['520i', '520d', '530i', '540i'],
      },
    ],
  },
  {
    brand: 'Mercedes-Benz',
    models: [
      {
        name: 'C-Class',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['C180', 'C200', 'C220d', 'C300'],
      },
      {
        name: 'E-Class',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        engines: ['E200', 'E220d', 'E300', 'E400'],
      },
    ],
  },
  {
    brand: 'Toyota',
    models: [
      {
        name: 'Corolla',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.3 VVT-i', '1.6 VVT-i', '1.8 Hybrid'],
      },
      {
        name: 'RAV4',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['2.0 VVT-i', '2.5 Hybrid'],
      },
    ],
  },
  {
    brand: 'Renault',
    models: [
      {
        name: 'Clio',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['0.9 TCe', '1.0 TCe', '1.5 dCi'],
      },
      {
        name: 'Megane',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        engines: ['1.2 TCe', '1.5 dCi', '1.6 TCe'],
      },
    ],
  },
  {
    brand: 'Ford',
    models: [
      {
        name: 'Focus',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.0 EcoBoost', '1.5 EcoBoost', '2.0 TDCi'],
      },
      {
        name: 'Fiesta',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
        engines: ['1.0 EcoBoost', '1.5 TDCi'],
      },
    ],
  },
  {
    brand: 'Fiat',
    models: [
      {
        name: 'Egea',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.3 Multijet', '1.4 Fire', '1.6 Multijet'],
      },
      {
        name: '500',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        engines: ['0.9 TwinAir', '1.2', '1.4'],
      },
    ],
  },
  {
    brand: 'Hyundai',
    models: [
      {
        name: 'i20',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.0 T-GDI', '1.2 MPI', '1.4 CRDi'],
      },
      {
        name: 'Tucson',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.6 T-GDI', '2.0 CRDi', '2.0 MPI'],
      },
    ],
  },
  {
    brand: 'Peugeot',
    models: [
      {
        name: '208',
        years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.2 PureTech', '1.5 BlueHDi'],
      },
      {
        name: '3008',
        years: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        engines: ['1.2 PureTech', '1.5 BlueHDi', '1.6 PureTech'],
      },
    ],
  },
];

export const getBrands = (): string[] => {
  return vehicleDatabase.map(v => v.brand).sort();
};

export const getModels = (brand: string): string[] => {
  const vehicle = vehicleDatabase.find(v => v.brand === brand);
  return vehicle ? vehicle.models.map(m => m.name) : [];
};

export const getYears = (brand: string, model: string): string[] => {
  const vehicle = vehicleDatabase.find(v => v.brand === brand);
  const modelData = vehicle?.models.find(m => m.name === model);
  return modelData ? modelData.years : [];
};

export const getEngines = (brand: string, model: string): string[] => {
  const vehicle = vehicleDatabase.find(v => v.brand === brand);
  const modelData = vehicle?.models.find(m => m.name === model);
  return modelData ? modelData.engines : [];
};
