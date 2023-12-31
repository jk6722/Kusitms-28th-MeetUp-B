import styled from 'styled-components';

import LikeIcon from '@/assets/icons/favorite_button2_icon.svg';
import UnLikeIcon from '@/assets/icons/unfavorite_button2_icon.svg';
import { useCallback } from 'react';
import { postLike } from '@/apis/like';
import { useRecoilValue } from 'recoil';
import { UserAtom } from '@/recoil/LoginAtom';

interface Props {
  id: number;
  isLike: boolean;
  setIsLike: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}

const LikeButton: React.FC<Props> = ({ id, isLike, setIsLike, type }) => {
  // Todo: 인자로 id 전달받아서 서버에 찜 목록에 등록하는 API 연결
  const userInfo = useRecoilValue(UserAtom);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (userInfo?.registNum) return;
      postLike(type, id, setIsLike);
    },
    [isLike, userInfo.registNum],
  );

  return (
    <Wrapper onClick={handleClick}>
      {isLike ? <img src={LikeIcon} /> : <img src={UnLikeIcon} />}
    </Wrapper>
  );
};

export default LikeButton;

const Wrapper = styled.div`
  z-index: 3;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
  }
`;
