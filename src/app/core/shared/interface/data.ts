export interface UserData {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface LocationData {
  displayAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface PackageData {
  isCustom: boolean;
  selectedPackage: {
    id: string;
    name: string;
    dimensions: string;
    maxWeight: string;
    volumeCm3: number;
  } | null;
  customDimensions?: {
    length: number;
    width: number;
    height: number;
  };
  calculatedValue: number;
}

export interface ShippingFormData {
  sender: UserData;
  recipient: UserData;
  origin: LocationData;
  destination: LocationData;
  package: PackageData;
  status: 'draft' | 'pending' | 'completed';
}
