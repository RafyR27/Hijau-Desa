import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Img,
} from "react-email";

interface ResetPasswordEmailProps {
  userName: string;
  resetUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ResetPasswordEmail = ({
  userName,
  resetUrl,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />

    <Preview>Atur ulang kata sandi akun Hijau Desa kamu</Preview>

    <Tailwind>
      <Body className="bg-[#F5F9F5] font-sans">
        <Container className="mx-auto my-10 max-w-150 rounded-lg bg-white px-8 py-8">
          {/* Logo / Brand */}
          <Section className="text-center">
            <Img
              src={`${baseUrl}/logo-name-nobg.png`}
              width="170"
              height="50"
              alt="Hijau Desa"
              className="mx-auto"
            />
          </Section>

          {/* Greeting */}
          <Text className="mt-8 text-[16px] leading-6 text-[#333333]">
            Halo {userName},
          </Text>

          <Text className="text-[16px] leading-6 text-[#333333]">
            Kami menerima permintaan untuk mengatur ulang kata sandi akun Hijau
            Desa kamu.
          </Text>

          <Text className="text-[16px] leading-6 text-[#333333]">
            Klik tombol di bawah ini untuk membuat kata sandi baru.
          </Text>

          {/* Button */}
          <Section className="my-8 text-center">
            <Button
              href={resetUrl}
              className="rounded-md bg-[#2E7D32] px-6 py-3 text-[15px] font-semibold text-white no-underline"
            >
              Atur Ulang Kata Sandi
            </Button>
          </Section>

          {/* Expiration */}
          <Text className="text-[14px] leading-5 text-[#757575]">
            Tautan ini hanya dapat digunakan dalam waktu yang terbatas demi
            menjaga keamanan akun kamu.
          </Text>

          <Text className="text-[14px] leading-5 text-[#757575]">
            Jika kamu tidak merasa meminta pengaturan ulang kata sandi, abaikan
            email ini. Akun kamu tetap aman.
          </Text>

          <Hr className="my-8 border-[#E0E0E0]" />

          {/* Footer */}
          <Text className="m-0 text-center text-[13px] leading-5 text-[#9E9E9E]">
            Email ini dikirim secara otomatis oleh sistem Hijau Desa.
          </Text>

          <Text className="m-0 mt-2 text-center text-[13px] text-[#9E9E9E]">
            © Hijau Desa
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ResetPasswordEmail;
