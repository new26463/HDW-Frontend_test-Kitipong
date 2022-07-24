export const product_input_form = [
  {
    id: 'name',
    name: 'ชื่อสินค้า',
    type: 'text',
    require: true,
  },
  {
    id: 'type',
    name: 'ประเภทสินค้า',
    type: 'select',
    select: ['Car', 'Food', 'Technology', 'Clothing'],
    require: true,
  },
  {
    id: 'description',
    name: 'รายละเอียดสินค้า',
    type: 'textarea',
    require: true,
  },
  {
    id: 'image',
    name: 'รูปภาพ',
    type: 'upload',
    require: true,
  },
  {
    id: 'price',
    name: 'ราคา',
    type: 'number',
    require: true,
  },
  {
    id: 'isBestSeller',
    name: 'สินค้าขายดี',
    type: 'select',
    select: [true, false],
    require: true,
  },
];
