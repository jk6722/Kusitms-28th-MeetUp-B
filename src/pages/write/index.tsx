import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import styled from 'styled-components';
import ImageResize from 'quill-image-resize-module-react';

import '@/style/quill.snow.css';
import DropDown from '@/components/DropDown/DropDown';
import InputTags from './components/InputTags';
import RoundedButton from '@/components/Button/RoundedButton';
import { B3 } from '@/style/fonts/StyledFonts';
import { isOkToPost } from './functions';
import { DropDownData } from '@/constants/write';
import InputFile from './components/InputFile';
import { postBoardData, setEditData } from '@/apis/write';
import { useRecoilValue } from 'recoil';
import { UserAtom } from '@/recoil/LoginAtom';

Quill.register('modules/imageResize', ImageResize); // 이미지 사이즈 변경 모듈 등록

const Write = () => {
  const [selected, setSelected] = useState<string>(''); // 선택된 드롭다운
  const [title, setTitle] = useState<string>(''); // 제목
  const [content, setContent] = useState<string>(''); // 내용 <HTML>
  const [inputTag, setInputTag] = useState<string>(''); //입력중인 태그
  const [tags, setTags] = useState<string[]>(); // 현재까지 입력된 태그 리스트
  const [inputFile, setInputFile] = useState<File | undefined>();
  const userInfo = useRecoilValue(UserAtom);

  const currentPath = window.location.pathname;
  const writeType = currentPath.includes('review') ? 'reviews' : 'archives';
  const isEdit = currentPath.includes('edit');

  useEffect(() => {
    if (isEdit) {
      // 수정 페이지라면
      const splitPath = currentPath.split('/');
      const id = splitPath[splitPath.length - 1];
      // 데이터 미리 불러와서 세팅하기
      setEditData(
        writeType,
        id,
        setInputFile,
        setSelected,
        setContent,
        setTags,
        setTitle,
      );
    }
  }, []);

  const navigate = useNavigate();

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isOkToPost(selected, title, content, tags)) {
      window.alert('입력되지 않은 내용이 있습니다.');
      return;
    }
    const splitPath = currentPath.split('/');
    const id = isEdit ? splitPath[splitPath.length - 1] : null;
    postBoardData(
      id,
      isEdit,
      writeType,
      selected,
      title,
      content,
      tags,
      inputFile,
      userInfo?.nickName,
    );
  }, [selected, title, content, tags, inputFile]);

  const modules = useMemo(() => {
    // Quill 에디터 모듈
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ indent: '-1' }, { indent: '+1' }],
          // ['image'],
          ['clean'],
        ],
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    };
  }, []);

  return (
    <Container>
      <Title>글쓰기</Title>
      <MainContainer>
        <DropDown
          {...DropDownData[`${writeType === 'reviews' ? 0 : 1}`]}
          selected={selected}
          setSelected={setSelected}
          position="relative"
          size="lg"
        />
        <StyledInput
          value={title}
          onChange={handleInput}
          placeholder={'제목을 입력해주세요.'}
        />
        <FlexBox>
          <ReactQuill
            style={{ width: '100%', height: '620px' }}
            value={content}
            onChange={setContent}
            theme="snow"
            modules={modules}
            placeholder="내용을 입력해주세요."
          />
          <InputTagsWrapper>
            <InputTags
              tags={tags}
              setTags={setTags}
              inputTag={inputTag}
              setInputTag={setInputTag}
            />
          </InputTagsWrapper>
        </FlexBox>

        <InputFile
          title="첨부파일"
          placeholder="파일을 첨부해주세요."
          inputFile={inputFile}
          setInputFile={setInputFile}
        />

        <ButtonContainer>
          <RoundedButton
            $buttonColor={'var(--grey-200, #E3E7ED)'}
            $buttonWidth="140px"
            $buttonHeight="46px"
            onClick={handleCancel}
            children={<B3 $fontColor="#53575C">취소</B3>}
          />
          <RoundedButton
            $buttonColor={'var(--Sub-3, #FF7D2C)'}
            $buttonWidth="140px"
            $buttonHeight="46px"
            onClick={handleSubmit}
            children={
              <B3 $fontColor="#fff">{`${isEdit ? '수정' : '등록'}`}</B3>
            }
          />
        </ButtonContainer>
      </MainContainer>
    </Container>
  );
};

export default Write;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 1440px;
  margin: auto;

  body:not(&) {
    background-color: white;
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  margin-top: 80px;
  gap: 24px;
  margin-bottom: 583px;
`;

const Title = styled.pre`
  color: var(--gray-900, #15191d);
  font-family: Recipekorea;
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 54px */

  margin-top: 229px;
`;

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 64px;
  flex-shrink: 0;

  text-indent: 40.13px;
  color: #15191d;
  /* Body 01 */
  font-family: SUIT;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 30px */

  border-radius: 20px;
  border: 1px solid var(--grey-200, #e3e7ed);

  &::placeholder {
    color: var(--grey-400, #aeb3b8);
  }
`;

const InputTagsWrapper = styled.div`
  width: 100%;
  border-radius: 0px 0px 20px 20px;
  border: 1px solid var(--grey-200, #e3e7ed);
  background: var(--main_1, #fff);
  padding: 0 20px 0 40.25px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;

  margin-top: 16px;
  gap: 24px;
`;
