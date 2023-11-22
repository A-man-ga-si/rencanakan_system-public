export default [
  {
    name: '__sequence',
    title: '#',
  },
  {
    name: 'name',
    title: 'Nama',
    sortField: 'name',
  },
  {
    name: 'created_at_formatted',
    title: 'Tanggal dibuat',
    sortField: 'created_at',
  },
  {
    name: 'subscription.name',
    title: 'Paket',
    sortField: 'subscription_id',
  },
  {
    name: 'expired_at_formatted',
    title: 'Tanggal Kadaluwarsa',
    sortable: false,
  },
  {
    name: 'last_opened_at_formatted',
    title: 'Terakhir dibuka',
    sortField: 'last_opened_at',
  },
  {
    name: '__slot:actions',
    title: 'Aksi',
  },
];
