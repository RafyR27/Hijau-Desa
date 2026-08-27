interface IRegister {
  name: string;
  email: string;
  password: string;
}

interface ILogin {
  email: string;
  password: string;
}

interface ICompleteProfile {
  noHP: string;
  noRumah: string;
}

interface IEditProfile {
  name: string;
  noHP: string;
  noRumah: string;
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;

  role: string;
  statusVerifikasi: boolean;
  newAccount: boolean;
  noHP: string;
  noRumah: string;
}

type ProfileData = {
  user: {
    name: string;
    email: string;
    noRumah: string | null;
    noHP: string | null;
    image: string | null;
    createdAt: Date;
  };
  poin?: {
    saldo: number;
  };
  poinWarung?: {
    saldoPoinTukarWarung: number;
    saldoRupiah: number;
  };
};

export type {
  IRegister,
  ILogin,
  ICompleteProfile,
  SessionUser,
  IEditProfile,
  ProfileData,
};
