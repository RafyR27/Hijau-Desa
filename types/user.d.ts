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

interface IEditEmail {
  newEmail: string;
}

interface ISetPassword {
  password: string;
  confirmPassword: string;
}

interface UserSecurityInfo {
  loginMethods: ("credential" | "google" | string)[];
  hasPassword: boolean;
  passwordUpdatedAt: string | null;
  email: string;
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
    id?: string;
    name: string;
    email: string;
    role: string;
    noRumah: string | null;
    noHP: string | null;
    image: string | null;
    status?: string | null;
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

interface VerifWarga {
  id: string;
  name: string;
  email: string;
  noHP: string;
  noRumah: string;
  createdAt: Date;
  statusVerifikasi: boolean;
  rejectionReason: string;
}

export type {
  IRegister,
  ILogin,
  ICompleteProfile,
  SessionUser,
  IEditProfile,
  IEditEmail,
  ISetPassword,
  UserSecurityInfo,
  ProfileData,
  VerifWarga,
};
