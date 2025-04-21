import { PrismaClient } from '@prisma/client';
// import * as data from '../src/data/store_data.json';

//store_data.json에 있는 식당데이터를 prisma를 통해 데이터 베이스에 집어 넣는(seed) 스크립트
//JSON 파일에 있는 가게 데이터를 DB에 하나씩 저장하는 코드
const prisma = new PrismaClient();

//JSON에서 가게 정보를 꺼내 storeData라는 객체로 정리
// async function seedData() {
//   data?.['DATA']?.map(async store => {
//     const storeData = {
//       phone: store?.tel_no,
//       address: store?.rdn_code_nm,
//       lat: store?.y_dnts,
//       lng: store?.x_cnts,
//       name: store?.upso_nm,
//       category: store?.bizcnd_code_nm,
//       storeType: store?.cob_code_nm,
//       foodCertifyName: store?.crtfc_gbn_nm,
//     };

//     //prisma.store.create - DB저장
//     const res = await prisma.store.create({
//       data: storeData,
//     });
//     console.log(res);
//   });
// }

async function main() {
  // await seedData();
}

main()
  .catch(e => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
