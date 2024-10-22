export interface LeaDto {
  id: any;
  name: string;
  object: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const tableHeader = [
  {
    id: 'checkbox',
    label: 'Checkbox',
  },
  {
    id: 'name',
    label: 'LEA Name',
  },
  {
    id: 'id',
    label: 'LEA ID',
  },
  {
    id: 'object',
    label: 'Object',
  },
  {
    id: 'isActive',
    label: 'Status',
  },
  {
    id: 'updatedAt',
    label: 'Updated At',
  },
  {
    id: 'createdAt',
    label: 'Created at',
  },
  {
    id: 'action',
    lable: 'Action',
  },
];

export const mockData: LeaDto[] = [
  {
    id: 'LEA 01',
    name: 'LEA 01',
    object: 3,
    updatedAt: '2024-03-27 16:54:50',
    createdAt: '2024-03-27 16:54:50',
    isActive: true,
  },
  {
    id: 'LEA 02',
    name: 'LEA 02',
    object: 3,
    updatedAt: '2024-03-27 16:54:50',
    createdAt: '2024-03-27 16:54:50',
    isActive: true,
  },
  {
    id: 'LEA 03',
    name: 'LEA 03',
    object: 3,
    updatedAt: '2024-03-27 16:54:50',
    createdAt: '2024-03-27 16:54:50',
    isActive: false,
  },
  {
    id: 'LEA 03',
    name: 'LEA 3',
    object: 0,
    updatedAt: '2024-03-27 16:54:50',
    createdAt: '2024-03-27 16:54:50',
    isActive: true
   },
   {
    id: 'LEA 04',
    name: 'LEA 04',
    object: 3,
    updatedAt: '',
    createdAt: '2024-03-27 16:54:50',
    isActive: true
   }
];
