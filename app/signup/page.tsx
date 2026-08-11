import type { Metadata } from "next";
import { StudentAuthForm } from "@/components/auth/StudentAuthForm";

export const metadata: Metadata = { title: "회원가입", description: "이름, 휴대폰 번호, 숫자 4자리 PIN으로 학습 기록을 만듭니다." };

export default function SignupPage() {
  return <StudentAuthForm mode="signup" />;
}
