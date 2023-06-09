import { PhoneFilled } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import dayjs from 'dayjs';
import { capitalize } from 'lodash-es';
import Image from 'next/image';

import {
  useCancelOrderByUser,
  useGetGarageByIdApi,
  useGetGaragesApi,
} from '@/api';
import { PinMapFilledIcon } from '@/icons';
import { twcx } from '@/utils';

type GarageOrderCardProps = {
  id: number;
  garageId: number;
  name: string;
  address: string;
  phone: string;
  carBrand: string;
  carType: string;
  carLicensePlates: string;
  category: string[];
  time: string;
  status: string;
  onMutated?: () => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'green';

    case 'open':
      return 'orange';

    case 'reject':
      return 'red';

    case 'cancelled':
      return 'gray';

    case 'done':
      return 'cyan';

    default:
      return;
  }
};

export default function GarageOrderCard({
  id,
  garageId,
  name,
  address,
  carBrand,
  carType,
  carLicensePlates,
  category,
  phone,
  time,
  status,
  onMutated,
}: GarageOrderCardProps) {
  const { mutateAsync: cancelOrder, isLoading } = useCancelOrderByUser({
    onSuccess: onMutated,
  });

  const { data: garageInfo } = useGetGarageByIdApi({}, { id: garageId });

  return (
    <div className="grid grid-cols-5 grid-rows-1 gap-4 mb-8">
      <div className="col-span-2 rounded-lg bg-gray-200 p-6 relative overflow-hidden">
        <Image
          src={garageInfo?.thumbnail || ''}
          alt={garageInfo?.garageName || ''}
          fill
        />
      </div>
      <div className="col-span-3 pb-4">
        <div className="flex gap-3">
          <h3 className="text-xl font-bold mb-2 mt-0 grow">
            {garageInfo?.garageName}
          </h3>
          <div>
            <Tag color={getStatusColor(status)} className="rounded-full">
              {capitalize(status)}
            </Tag>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <PinMapFilledIcon className="text-rose-600" />
          <span>{garageInfo?.addressDetail}</span>
        </div>

        <div className="flex gap-2 items-center">
          <PhoneFilled className="text-rose-600" />
          <span>{garageInfo?.phoneNumber}</span>
        </div>

        <div className="mt-6 flex gap-2">
          <div className="font-bold">Xe: </div>
          <div>
            {carBrand} - {carType} - {carLicensePlates}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <div className="font-bold">Loại dịch vụ: </div>
          <div>{category.join(', ')}</div>
        </div>

        <div className="flex gap-2 mt-2">
          <div className="font-bold">Thời gian: </div>
          <div>{dayjs(time).format('hh:mm A, DD-MM-YYYY')}</div>
        </div>

        <Button
          className={twcx('mt-10 bg-red-500 hover:bg-red-500/70', {
            invisible: status !== 'open',
          })}
          type="primary"
          disabled={isLoading}
          loading={isLoading}
          onClick={() => cancelOrder({ id })}
        >
          Hủy đặt
        </Button>
      </div>
    </div>
  );
}
