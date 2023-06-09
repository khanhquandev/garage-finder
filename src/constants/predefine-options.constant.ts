import {
  AudiIcon,
  AviaIcon,
  BentleyIcon,
  BugatiIcon,
  BuickIcon,
  BWMIcon,
  CadillacIcon,
  ChevroletIcon,
} from '@/icons';

import { VIETNAM_PROVINCES } from './vietnam-provine.constant';

export const GARAGE_SERVICES = [
  { value: 1, label: 'Sửa chữa' },
  { value: 2, label: 'Bảo dưỡng' },
  { value: 3, label: 'Tân trang' },
  { value: 4, label: 'Cứu hộ' },
];

export const CAR_COMPANIES = [
  { label: 'Audi', icon: AudiIcon, value: 1 },
  { label: 'BMW', icon: BWMIcon, value: 2 },
  { label: 'Avia', icon: AviaIcon, value: 3 },
  { label: 'Bently', icon: BentleyIcon, value: 4 },
  { label: 'Bugati', icon: BugatiIcon, value: 5 },
  { label: 'Buick', icon: BuickIcon, value: 6 },
  { label: 'Cadillac', icon: CadillacIcon, value: 7 },
  { label: 'Chevron', icon: ChevroletIcon, value: 8 },
];

export const LOCATION_CASCADER_OPTIONS = VIETNAM_PROVINCES.map((province) => ({
  label: province.name,
  value: province.code,
  children: province.districts.map((district) => ({
    label: district.name,
    value: district.code,
  })),
}));
