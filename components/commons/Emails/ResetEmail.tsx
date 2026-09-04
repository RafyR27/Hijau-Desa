import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Img,
} from "react-email";

interface ChangeEmailVerificationEmailProps {
  userName: string;
  newEmail: string;
  verificationUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ChangeEmailVerificationEmail = ({
  userName,
  newEmail,
  verificationUrl,
}: ChangeEmailVerificationEmailProps) => {
  return (
    <Html>
      <Head />

      <Preview>Konfirmasi perubahan email akun Hijau Desa</Preview>

      <Tailwind>
        <Body className="bg-[#F5F9F5] font-sans">
          <Container className="mx-auto my-10 max-w-150 rounded-2xl bg-white px-8 py-10">
            {/* Header */}
            <Section className="text-center">
              <Img
                src={`${baseUrl}/logo-name-nobg.png`}
                width="170"
                height="50"
                alt="Hijau Desa"
                className="mx-auto"
              />
            </Section>

            {/* Content */}
            <Section className="mt-10">
              <Heading className="m-0 text-[24px] font-bold text-[#222222]">
                Konfirmasi Email Baru
              </Heading>

              <Text className="mt-6 text-[16px] leading-6 text-[#333333]">
                Halo {userName},
              </Text>

              <Text className="text-[16px] leading-6 text-[#333333]">
                Kami menerima permintaan untuk mengubah alamat email akun Hijau
                Desa kamu menjadi:
              </Text>

              <Section className="my-6 rounded-xl bg-[#F1F8F1] px-5 py-4 text-center">
                <Text className="m-0 text-[16px] font-semibold text-[#2E7D32]">
                  {newEmail}
                </Text>
              </Section>

              <Text className="text-[16px] leading-6 text-[#333333]">
                Jika benar kamu yang melakukan perubahan ini, klik tombol di
                bawah untuk mengonfirmasi alamat email baru kamu.
              </Text>
            </Section>

            {/* Button */}
            <Section className="my-8 text-center">
              <Button
                href={verificationUrl}
                className="rounded-lg bg-[#2E7D32] px-7 py-3.5 text-[15px] font-semibold text-white no-underline"
              >
                Konfirmasi Email
              </Button>
            </Section>

            {/* Expiration */}
            <Text className="text-[14px] leading-5 text-[#757575]">
              Demi keamanan akun, tautan verifikasi ini hanya dapat digunakan
              dalam waktu yang terbatas.
            </Text>

            <Text className="text-[14px] leading-5 text-[#757575]">
              Jika kamu tidak meminta perubahan email ini, abaikan email ini.
              Email akun kamu tidak akan berubah tanpa verifikasi.
            </Text>

            <Hr className="my-8 border-[#E0E0E0]" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="m-0 text-[13px] leading-5 text-[#9E9E9E]">
                Email ini dikirim secara otomatis oleh sistem Hijau Desa.
              </Text>

              <Text className="m-0 mt-2 text-[13px] text-[#9E9E9E]">
                © Hijau Desa
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ChangeEmailVerificationEmail;
