// src/lib/monsters.ts

export const MONSTER_DATA = {
  '종이': { bin_color: '파란색', message: '종이는 파란색 통에 쏙!', tips: ['물에 젖지 않게, 테이프는 떼고 버려요.'], monster_color: '#4A90D9' },
  '유리': { bin_color: '초록색', message: '유리병은 초록색 통에 쏙!', tips: ['뚜껑을 떼고, 안을 한번 헹궈서 버려요.'], monster_color: '#7CB342' },
  '플라스틱': { bin_color: '노란색', message: '플라스틱은 노란색 통에 쏙!', tips: ['라벨을 떼고, 깨끗이 씻어서 버려요.'], monster_color: '#FFD54F' },
  '캔': { bin_color: '빨간색', message: '캔은 빨간색 통에 쏙!', tips: ['납작하게 밟아서, 조심해서 버려요.'], monster_color: '#EF5350' },
  '일반쓰레기': { bin_color: '검은색', message: '일반쓰레기는 아무 통에나!', tips: ['재활용이 어려운 친구들이에요.'], monster_color: '#78909C' }
};

export const ALL_MONSTERS = Object.keys(MONSTER_DATA);
