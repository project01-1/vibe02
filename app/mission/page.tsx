import type { Metadata } from "next";
import { MissionLab } from "@/components/mission/MissionLab";

export const metadata: Metadata = {
  title: "무료 체험 미션",
  description: "반복문을 바꿔 로봇 루미를 에너지 셀까지 이동시키는 3분 Python 체험",
};

export default function MissionPage() {
  return <MissionLab />;
}
