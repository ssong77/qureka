import React from 'react';
import { Container, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';

import examImage from '../assets/images/exam.png';
import questionTypesImage from '../assets/images/pdf.png';
import howToUseImage from '../assets/images/process.png';
import projectMatterImage from '../assets/images/project_matter.png'; 
import projectMatter2Image from '../assets/images/project_matter2.png';
import aiImage from '../assets/images/ai.png';  
import heyImage from '../assets/images/hey.png'; 
// 스타일드 컴포넌트
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '20vh',
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2.5),
  border: '1px solid rgba(229, 231, 235, 0.8)',
  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  border: 0,
  borderRadius: theme.spacing(3),
  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
  color: 'white',
  height: 56,
  padding: '0 32px',
  fontSize: '1.1rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  border: 0,
  borderRadius: theme.spacing(3),
  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
  color: 'white',
  height: 56,
  padding: '0 32px',
  fontSize: '1.1rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
  },
}));

const FeatureImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  height: 'auto',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease',
  filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const NumberBadge = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '1.3rem',
  marginRight: theme.spacing(3),
  flexShrink: 0,
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
}));

const AccentSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.03) 0%, transparent 50%)',
  },
}));

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <>
      {/* 수정된 Hero Section - 텍스트 왼쪽, 이미지 오른쪽 */}
      <HeroSection>
        <Header />
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            zIndex: 1,
            pt: 1, // 상단 여백 추가
          }}
        >
          <Fade in timeout={1000}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              {/* 왼쪽 텍스트 영역 */}
              <Box sx={{ 
                flex: 1, 
                textAlign: { xs: 'center', md: 'left' },
                mb: { xs: 6, md: 0 },
                pr: { md: 6 },
                pl: { xs: 3, md: 6 }
              }}>
                <Typography
                  variant="h2"
                  fontWeight="800"
                  gutterBottom
                  sx={{
                    color: '#1F2937',
                    mb: 3,
                    fontSize: { xs: '2.0rem', md: '3.0rem' },
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Qureka와 함께라면 공부 걱정은 끝!
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#6B7280',
                    mb: 5,
                    lineHeight: 1.6,
                    fontWeight: '400',
                  }}
                >
                  강의자료를 업로드하면 AI가 요약과 맞춤형 문제를 제공합니다.<br/> 더 효율적인 공부, 지금 경험해보세요!
                </Typography>
                <PrimaryButton
                  size="large"
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate('/upload');
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  시작하기! 🚀
                </PrimaryButton>
              </Box>
              
              {/* 오른쪽 이미지 영역 */}
              <Box sx={{ 
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <FeatureImage 
                  src={aiImage} 
                  alt="문서 도우미" 
                  sx={{ 
                    maxWidth: { xs: '80%', md: '90%' }, 
                    transform: 'translateY(-20px)' 
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Container>
      </HeroSection>
      {/* 문제 정의 섹션 */}
      <Box sx={{ py: 12, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight="700"
            align="center"
            sx={{
              color: '#1F2937',
              mb: 6,
              fontSize: { xs: '2rem', md: '2.8rem' },
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Qureka의 장점
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 6,
              mb: 6
            }}
          >
            {/* 첫 번째 문제 정의 항목 */}
            <Fade in timeout={1000}>
              <StyledCard sx={{ flex: 1 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box 
                      component="img"
                      src={projectMatterImage}
                      alt="학습 효율 저하"
                      sx={{ 
                        width: '100%', 
                        maxWidth: 280,
                        height: 'auto',
                        mb: 3,
                        borderRadius: 2,
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                      }}
                    />
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      align="center"
                      sx={{ mb: 2 }}
                    >
                      다양한 유형 지원
                    </Typography>
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{ 
                        lineHeight: 1.7,
                        color: '#4B5563'
                      }}
                    >
                      요약의 유형이나 문제의 유형을 다양하게 지원하여<br />
                      맞춤형 콘텐츠 생성을 통한 학습 효율성 강화
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Fade>

            {/* 두 번째 문제 정의 항목 */}
            <Fade in timeout={1500}>
              <StyledCard sx={{ flex: 1 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box 
                      component="img"
                      src={projectMatter2Image}
                      alt="기존 AI 프로그램의 한계"
                      sx={{ 
                        width: '100%', 
                        maxWidth: 280,
                        height: 'auto',
                        mb: 3,
                        borderRadius: 2,
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                      }}
                    />
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      align="center"
                      sx={{ mb: 2 }}
                    >
                      초보자도 쉽게 사용 가능
                    </Typography>
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{ 
                        lineHeight: 1.7,
                        color: '#4B5563'
                      }}
                    >
                      분야, 난이도 등을 사용자가 직접 선택하여<br /> 
                      쉽고 편하게 다양한 자료 생성 가능
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Fade>
          </Box>
        </Container>
      </Box>


      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: '#ffffff' }}>
        {/* Section 1 */}
        <Container maxWidth="lg" sx={{ mb: 12 }}>
          <Fade in timeout={1500}>
            <StyledCard>
              <CardContent sx={{ p: 6 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {/* 좌측 텍스트 영역 */}
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography
                      variant="h3"
                      fontWeight="700"
                      mb={4}
                      sx={{
                        color: '#1F2937',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                       AI로 더 똑똑하고 빠르게 요약 및 문제 생성
                    </Typography>
                    <Typography
                      variant="h6"
                      color="#4B5563"
                      sx={{
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        fontWeight: '400',
                      }}
                    >
                      복잡한 문서도 핵심만 뽑아 요약하고, 중요한 내용만 골라 문제로 만들어줍니다. <br />
                      클릭 몇 번으로 요약본이랑 문제를 생성할 수 있습니다. <br />
                      공부는 간단하게, 시험 대비는 똑똑하게 준비해 보세요.
                    </Typography>
                  </Box>

                  {/* 우측 이미지 영역 */}
                  <Box
                    sx={{
                      flex: 1,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <FeatureImage src={heyImage} alt="문서 요약" />
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Fade>
        </Container>

        {/* Section 2 */}
        <Container maxWidth="lg" sx={{ mb: 12 }}>
          <Fade in timeout={2000}>
            <StyledCard>
              <CardContent sx={{ p: 6 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {/* 좌측 이미지 영역 */}
                  <Box
                    sx={{
                      flex: 1,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <FeatureImage src={questionTypesImage} alt="문제 유형" />
                  </Box>

                  {/* 우측 텍스트 영역 */}
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography
                      variant="h3"
                      fontWeight="700"
                      mb={4}
                      sx={{
                        color: '#1F2937',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      내 스타일, 내 방식대로 나만의 학습 설계
                    </Typography>
                    <Typography
                      variant="h6"
                      color="#4B5563"
                      sx={{
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        fontWeight: '400',
                      }}
                    >
                      기본 요약부터 주제별, 목차별 요약까지, 선택형부터 서술형까지 다양한 옵션을 제공합니다. <br />
                      나에게 맞는 방식으로 요약하고, 원하는 형태로 문제를 만들어 보세요.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Fade>
        </Container>

        {/* Section 3 - How to Use */}
        <Container maxWidth="lg">
          <Fade in timeout={2500}>
            <StyledCard>
              <CardContent sx={{ p: 6 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {/* 좌측 텍스트 영역 */}
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography
                      variant="h3"
                      fontWeight="700"
                      mb={4}
                      sx={{
                        color: '#1F2937',
                        background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      큐레카 사용 방법
                    </Typography>
                    <Box>
                      {[
                        '문서 업로드 페이지에서 강의자료를 업로드하세요.',
                        '요약 유형 및 세부설정을 설정하고 요약을 생성하세요.',
                        '생성된 요약을 검토하고 필요한 경우 수정하세요.',
                        '위와 동일하게 문제를 생성하세요. 다운로드도 가능합니다.',
                      ].map((step, index) => (
                        <Box
                          key={index}
                          sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}
                        >
                          <NumberBadge>{index + 1}</NumberBadge>
                          <Typography
                            variant="h6"
                            color="#4B5563"
                            sx={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: '400' }}
                          >
                            {step}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* 우측 이미지 영역 */}
                  <Box
                    sx={{
                      flex: 1,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <FeatureImage src={howToUseImage} alt="큐레카 사용 방법" />
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Fade>
        </Container>
      </Box>

      {/* CTA Footer */}
      <AccentSection sx={{ py: 12, position: 'relative' }}>
        <Container
          maxWidth="md"
          sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <Typography
            variant="h3"
            fontWeight="700"
            sx={{
              color: '#1F2937',
              mb: 3,
              background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            지금 바로 Qureka와 함께
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#6B7280',
              mb: 5,
              fontWeight: '400',
            }}
          >
            지금 바로 나만의 요약본 및 문제를 생성하세요!
          </Typography>
          <SecondaryButton
            size="large"
            onClick={() => {
              if (isLoggedIn) {
                navigate('/upload');
              } else {
                navigate('/login');
              }
            }}
          >
            지금 시작하기 ✨
          </SecondaryButton>
        </Container>
      </AccentSection>
    </>
  );
}

export default Home;