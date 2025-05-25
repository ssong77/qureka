import React from 'react';
import { Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import examImage from '../assets/images/exam.png';
import questionTypesImage from '../assets/images/pdf.png';
import howToUseImage from '../assets/images/process.png';

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom,rgb(246, 247, 249))',
      }}
    >
      <Header />

      <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          여러분들의 문서 도우미!
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          다양한 문서들을 쉽게 작성할 수 있도록 도와드립니다
        </Typography>
        <Button
          variant="contained"
          size="large"            // MUI 기본 large, medium, small
            sx={{
              minWidth: 100,        // 최소 너비
              height: 50,           // 고정 높이
              fontSize: '1.1rem',   // 폰트 크기
            }}
      
              onClick={() => {
                if (isLoggedIn) {
                  navigate('/upload');
                } else {
                  navigate('/login'); // 
                }
              }}
            >
          시작하기!
        </Button>
      </Container>

      {/* Section 1 */}
      <Container maxWidth="lg" sx={{ py: 10, px: { xs: 2, md: 8 } }}>
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 4, boxShadow: 3, p: 6 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" mb={4} sx={{ textAlign: 'left' }}>
                시험 및 퀴즈를 준비해 보세요
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2 }}>
                PDF만 업로드하면 나머지 작업은 AI 문제 생성기가 처리해 드립니다. <br />
                클릭 몇 번이면 원하는 대로 맞춤형 시험이나 퀴즈를 생성할 수 있습니다. <br />
                더 빠르고 강력하며 스마트한 도구를 만나보세요.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={examImage}
                alt="문서 요약"
                sx={{ width: '800%', maxWidth: 400, height: 'auto' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Section 2 */}
      <Container maxWidth="lg" sx={{ py: 10, px: { xs: 2, md: 8 } }}>
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 4, boxShadow: 3, p: 6 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={questionTypesImage}
                alt="문제 유형"
                sx={{ width: '80%', maxWidth: 350, height: 'auto' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" mb={4} sx={{ textAlign: 'left' }}>
                다양한 문제 유형 지원
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2 }}>
                객관식, 주관식, 순서 배열형, 빈칸형 문제 등 다양한 유형으로 <br />
                생성할 수 있어 맞춤형 학습 콘텐츠를 제공합니다.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Section 3 */}
      <Container maxWidth="lg" sx={{ py: 10, px: { xs: 2, md: 8 } }}>
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 4, boxShadow: 3, p: 6 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={howToUseImage}
                alt="큐레카 사용 방법"
                sx={{ width: '80%', maxWidth: 400, height: 'auto' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" mb={4}>
                큐레카 사용 방법
              </Typography>
              <Box component="ol" sx={{ pl: 3 }}>
                <Typography component="li" variant="body1" color="text.secondary" mb={2}>
                  문서 업로드 페이지에서 PDF 파일을 업로드하세요.
                </Typography>
                <Typography component="li" variant="body1" color="text.secondary" mb={2}>
                  요약 결과를 확인하고 문제 생성 버튼을 클릭하세요.
                </Typography>
                <Typography component="li" variant="body1" color="text.secondary" mb={2}>
                  생성된 문제를 검토하고 필요한 경우 수정하세요.
                </Typography>
                <Typography component="li" variant="body1" color="text.secondary" mb={2}>
                  최종 결과를 다운로드하여 활용하세요.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          지금 바로 Qureka와 함께 새로운 학습 콘텐츠를 만들어보세요!
        </Typography>
      </Container>
    </Box>
  );
}

export default Home;
