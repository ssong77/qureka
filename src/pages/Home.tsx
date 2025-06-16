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
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  여러분들의 문서 도우미!
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
                  다양한 문서들을 쉽게 작성할 수 있도록 도와드립니다
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
                  src={examImage} 
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
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            문제 정의
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
                      학습 효율 저하
                    </Typography>
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{ 
                        lineHeight: 1.7,
                        color: '#4B5563'
                      }}
                    >
                      교육을 위해 제공되는 방대한 양의 자료들은<br />
                      요약이나 학습 점검을 위해 오랜 시간이 필요함
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
                      기존 AI 프로그램의 한계
                    </Typography>
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{ 
                        lineHeight: 1.7,
                        color: '#4B5563'
                      }}
                    >
                      사용자가 일일이 프롬프트를 작성해야 하며,<br /> 
                      기존 프로그램들은 세부적인 설정이 불가능
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
                      시험 및 퀴즈를 준비해 보세요
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
                      PDF만 업로드하면 나머지 작업은 AI 문제 생성기가 처리해 드립니다. <br />
                      클릭 몇 번이면 원하는 대로 맞춤형 시험이나 퀴즈를 생성할 수 있습니다. <br />
                      더 빠르고 강력하며 스마트한 도구를 만나보세요.
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
                    <FeatureImage src={examImage} alt="문서 요약" />
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
                      다양한 문제 유형 지원
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
                      객관식, 주관식, 순서 배열형, 빈칸형 문제 등 다양한 유형으로 <br />
                      생성할 수 있어 맞춤형 학습 콘텐츠를 제공합니다.
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
                        '문서 업로드 페이지에서 PDF 파일을 업로드하세요.',
                        '요약 결과를 확인하고 문제 생성 버튼을 클릭하세요.',
                        '생성된 문제를 검토하고 필요한 경우 수정하세요.',
                        '최종 결과를 다운로드하여 활용하세요.',
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
            새로운 학습 콘텐츠를 만들어보세요!
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