import { useCallback } from 'react';

import { B2Bold } from '@/style/fonts/StyledFonts';
import { PostingType } from '@/types';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Posting: React.FC<PostingType> = ({
  category,
  title,
  id,
  writer,
  createdDate,
  linkType,
}) => {
  const navigate = useNavigate();

  const handleClick = (): void => {
    const currentPath = window.location.pathname;
    const isUserPosting = currentPath.includes('user');
    if (isUserPosting) navigate(`/user/${linkType}/${id}`);
    else navigate(`${id}`);
  };

  const truncDate = useCallback(() => {
    const newDate = new Date(createdDate);
    return `${newDate.getFullYear()}-${
      newDate.getMonth() + 1
    }-${newDate.getDate()}`;
  }, [createdDate]);

  return (
    <Container>
      <B2Bold $fontColor="#53575C" className="board_name">
        {category}
      </B2Bold>
      <B2Bold $fontColor="#53575C" className="title" onClick={handleClick}>
        {title}
      </B2Bold>
      <B2Bold $fontColor="#53575C" className="writer">
        {writer}
      </B2Bold>
      <B2Bold $fontColor="#53575C" className="registerDate">
        {truncDate()}
      </B2Bold>
    </Container>
  );
};

export default Posting;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  width: 100%;
  padding: 32px 14px;
  border-bottom: 0.5px solid var(--grey-400, #e3e7ed);

  .board_name {
    width: 143px;
  }
  .title {
    width: 580px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; // 너비를 넘어가면 ...으로 표시되도록

    cursor: pointer;

    &:hover {
      color: #3ea2ff;
    }
  }
  .writer {
    width: 140px;
    text-align: center;
  }
  .registerDate {
    width: 100px;
  }
`;
