import type { Metadata } from "next";
import { StudentAuthForm } from "@/components/auth/StudentAuthForm";

export const metadata: Metadata = { title: "학생 로그인", description: "학생 이름과 숫자 4자리 PIN으로 학습 기록을 이어갑니다." };

export default function LoginPage() {
  return <StudentAuthForm mode="login" />;
}
