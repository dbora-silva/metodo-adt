import { faker } from '@faker-js/faker';

export interface Mission {
  id: string;
  rocket: string;
  lunarBase: string;
  departureDate: string;
  returnDate: string;
  price: string;
}

const DEFAULT_MISSION: Omit<Mission, 'id'> = {
  rocket: 'Starship',
  lunarBase: 'aurora',
  departureDate: '2028-01-20',
  returnDate: '27 de jan. de 2028',
  price: '1000',
};

export function createMission(overrides: Partial<Mission> = {}): Mission {
  return {
    id: 'LP-' + faker.string.alphanumeric({ length: 5, casing: 'upper' }),
    ...DEFAULT_MISSION,
    ...overrides,
  };
}
