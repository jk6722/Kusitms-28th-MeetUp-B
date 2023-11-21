import { CommonInner } from '@/style/common';
import styled from 'styled-components';
import { USER_INFO_TAG } from '@/constants/User/profile';
import { B1, B1Bold, B3Bold } from '@/style/fonts/StyledFonts';
import MainButton from '@/components/Button/MainButton';
import UserTitle from '@/components/Title/UserTitle';
import AuthBadge from './AuthBadge';
import { useRecoilValue } from 'recoil';
import { UserAtom } from '@/recoil/LoginAtom';

const Profile = () => {
  const userInfo = useRecoilValue(UserAtom);

  return (
    <CommonInner>
      <Container>
        <UserTitle>회원정보</UserTitle>
        <div className="information-container">
          <MainButton
            $buttonColor="var(--color_sub3)"
            $buttonWidth="108px"
            $buttonHeight="38px"
          >
            <B3Bold $fontColor="white">수정</B3Bold>
          </MainButton>
          <InfoContainer>
            {Object.keys(USER_INFO_TAG).map(key => (
              <Information key={key}>
                <B1Bold $fontColor="var(--color_gray900)" className="title">
                  {USER_INFO_TAG[key]}
                </B1Bold>
                <div className="content">
                  <B1 $fontColor="var(--color_gray900)">{userInfo[key]}</B1>
                  {key === 'email' && <AuthBadge />}
                </div>
              </Information>
            ))}
          </InfoContainer>
        </div>
      </Container>
    </CommonInner>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-top: 120px;
  margin-bottom: 180px;

  .information-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: flex-end;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 56px;
  border-radius: 20px;
  background: #fafafa;
  width: 1200px;
  height: 560px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;

  .title {
    width: 170px;
  }

  .content {
    min-width: 716px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
`;

export default Profile;