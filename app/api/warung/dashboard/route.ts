// if (role === "warga") {
// } else if (role === "warung") {
//   const poinWarung = await prisma.poinWarung.findUnique({
//     where: { userId: identifier },
//   });

//   const tukarList = await prisma.transaksiTukar.findMany({
//     where: { warungId: identifier },
//     include: {
//       product: { select: { namaProduct: true } },
//     },
//     orderBy: { createdAt: "desc" },
//     take: 5,
//   });

//   data = {
//     saldoPoinTukarWarung: poinWarung ? poinWarung.saldoPoinTukarWarung : 0,
//     saldoRupiah: poinWarung ? poinWarung.saldoRupiah : 0,
//     transaksi: tukarList.map((item) => ({
//       id: item.id,
//       tipe: "out" as const,
//       nama: item.product.namaProduct,
//       poin: item.poinKeluar,
//       createdAt: item.createdAt,
//     })),
//   };
// } else if (role === "petugas" || role === "admin") {
//   const setorList = await prisma.transaksiSetor.findMany({
//     where: role === "petugas" ? { petugasId: identifier } : {},
//     include: {
//       kategori: { select: { namaKategori: true } },
//     },
//     orderBy: { createdAt: "desc" },
//     take: 5,
//   });

//   const allSetor = await prisma.transaksiSetor.findMany({
//     where: role === "petugas" ? { petugasId: identifier } : {},
//   });

//   const totalSampah = allSetor.reduce((acc, curr) => acc + curr.beratKg, 0);

//   const totalSetor = allSetor.length;

//   data = {
//     totalSampah,
//     totalSetor,
//     transaksi: setorList.map((item) => ({
//       id: item.id,
//       tipe: "in" as const,
//       nama: item.kategori.namaKategori,
//       poin: item.poinMasuk,
//       createdAt: item.createdAt,
//     })),
//   };
// }
