import { PrismaClient } from '@prisma/client';

//Next.js의 개발 모드에서는 코드가 여러 번 재실행되기 때문에
//new PrismaClient()를 직접 쓰면 DB 연결이 계속 중복 생성됨 → 커넥션 풀 초과 → 오류 발생
//이걸 방지하기 위해 globalThis에 한 번만 저장해서 재사용하는 방식입니다.

// 프리즈마 인스턴스 생성
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// 타입 인스턴스 생성 - 많이 헷갈렸는데 저기서 나오는 결과물은 결국 new PrismaClient(); 객체타입이다. 그래서 아래에 프리즈마 타입에 들어가기 위해 적어놓은것
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// 전역객체 타입 선언 - globalThis이거는 전역으로 쓸수있는거고 거기에 prisma 속성을 넣은거다 처음에 타입을 안전성을 끊고 (as unknown) < 이렇게
// 그다음에 위에 우리가 작성해놓은 타입을 넣어준다 > PrismaClientSingleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// 다음 프리즈마가 전역에 존재한다면 그 프리즈마를 쓰는거고 아니라면 여기서 새롭게 만드는거다
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

// 이거는 개발일때만 쓰는거여서 개발일때를 구별하는것
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
