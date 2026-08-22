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

export type { IRegister, ILogin, ICompleteProfile, SessionUser, IEditProfile };
