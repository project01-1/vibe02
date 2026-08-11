export type MissionDefinition = {
  id: number;
  databaseId: string;
  title: string;
  shortTitle: string;
  headline: string;
  highlight: string;
  description: string;
  concept: string;
  conceptBody: string;
  blockPrimary: string;
  blockSecondary: string;
  starterCode: string;
  hint: string;
  coach: string;
  reward: number;
};

export const missions: MissionDefinition[] = [
  {
    id: 1,
    databaseId: "00000000-0000-4000-8000-000000001001",
    title: "에너지 셀을 회수하라",
    shortTitle: "반복 이동",
    headline: "루미를 앞으로",
    highlight: "3칸 이동시키세요.",
    description: "반복문은 같은 명령을 여러 번 실행해요. 블록 속 숫자와 Python 코드의 숫자를 비교해 보세요.",
    concept: "반복문",
    conceptBody: "같은 일을 다시 쓸 필요 없이 횟수만 정할 수 있어요.",
    blockPrimary: "↻ 3번 반복하기",
    blockSecondary: "➜ 앞으로 이동",
    starterCode: "for i in range(2):\n    move()",
    hint: "블록에는 3번이라고 쓰여 있어요. range(2)의 숫자를 바꿔 보세요.",
    coach: "전체를 새로 쓰지 않아도 돼. 숫자 하나만 바꿔 봐!",
    reward: 40,
  },
  {
    id: 2,
    databaseId: "00000000-0000-4000-8000-000000001002",
    title: "에너지 코어를 충전하라",
    shortTitle: "변수 충전",
    headline: "에너지 변수에",
    highlight: "5를 저장하세요.",
    description: "변수는 숫자나 글자를 기억하는 상자예요. energy 상자에 올바른 값을 넣어 충전해 보세요.",
    concept: "변수",
    conceptBody: "값에 이름을 붙이면 여러 곳에서 편리하게 다시 사용할 수 있어요.",
    blockPrimary: "energy 값을 5로 정하기",
    blockSecondary: "⚡ energy만큼 충전",
    starterCode: "energy = 3\ncharge(energy)",
    hint: "충전 목표는 5예요. energy 오른쪽의 숫자를 확인해 보세요.",
    coach: "energy라는 상자에 목표 숫자를 넣으면 충전 장치가 읽을 수 있어!",
    reward: 50,
  },
  {
    id: 3,
    databaseId: "00000000-0000-4000-8000-000000001003",
    title: "보안 문을 통과하라",
    shortTitle: "조건 판단",
    headline: "문이 열렸을 때만",
    highlight: "이동하세요.",
    description: "조건문은 상황이 맞을 때만 명령을 실행해요. 문 상태를 확인한 뒤 루미를 이동시키세요.",
    concept: "조건문",
    conceptBody: "if 뒤의 조건이 참일 때 들여쓰기된 명령이 실행돼요.",
    blockPrimary: "만약 door_open 이라면",
    blockSecondary: "➜ 앞으로 이동",
    starterCode: "door_open = True\nif door_open:\n    wait()",
    hint: "문은 이미 열려 있어요. if 안에서 wait() 대신 어떤 이동 명령이 필요할까요?",
    coach: "조건은 맞았어. 이제 기다리지 말고 앞으로 움직이는 명령을 골라 봐!",
    reward: 60,
  },
];

export function getMission(id: number) {
  return missions.find((mission) => mission.id === id) ?? missions[0];
}
