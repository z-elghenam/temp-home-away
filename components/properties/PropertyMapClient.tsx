'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/skeleton';

const PropertyMap = dynamic(
  () => import('@/components/properties/PropertyMap'),
  {
    ssr: false,
    loading: () => <Skeleton className='h-[400px] w-full' />
  }
);


export default function MapWrapper({ countryCode }: { countryCode: string }) {
  return (
      <PropertyMap countryCode={countryCode} />
  );
}